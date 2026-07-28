import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  initialized: false,
  setSession: async (session) => {
    if (!session) {
      set({ session: null, user: null, profile: null, loading: false });
      return;
    }
    
    const isAlreadyAuthenticated = get().user !== null && get().profile !== null;
    
    set({ 
      session, 
      user: session.user, 
      loading: isAlreadyAuthenticated ? false : true 
    });
    
    try {
      if (isAlreadyAuthenticated) {
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      set({ profile, loading: false });
    } catch (error) {
      console.error('Error loading user profile:', error);
      set({ loading: false });
    }
  },
  initialize: async () => {
    if (get().initialized) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await get().setSession(session);
    } catch (error) {
      console.error('Error fetching initial session:', error);
      set({ loading: false });
    }
    
    supabase.auth.onAuthStateChange(async (_event, session) => {
      await get().setSession(session);
    });
    
    set({ initialized: true });
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    set({ session: null, user: null, profile: null });
  }
}));
