'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Sparkles,
  Search,
  Copy,
  Calendar,
  Clock,
  Layout,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface Resume {
  id: string;
  user_id: string;
  title: string;
  template: string;
  is_paid: boolean;
  updated_at: string;
}

export default function ResumesDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchResumes();
  }, [user]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('id, user_id, title, template, is_paid, updated_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createResume = async () => {
    if (!user) return;
    setCreating(true);
    try {
      const defaultContent = {
        personalInfo: {
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: '',
          location: '',
          website: '',
          linkedIn: '',
          github: '',
          twitter: '',
          jobTitle: '',
          summary: '',
        },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certifications: [],
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: `Resume ${resumes.length + 1}`,
          content: defaultContent,
          template: 'minimal',
          is_paid: true,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/dashboard/resume/${data.id}`);
    } catch (err) {
      console.error('Error creating resume:', err);
      alert('Failed to create resume. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume.');
    } finally {
      setDeletingId(null);
    }
  };

  const duplicateResume = async (resume: Resume) => {
    if (!user) return;
    try {
      const { data: fullResume, error: fetchErr } = await supabase
        .from('resumes')
        .select('content')
        .eq('id', resume.id)
        .single();

      if (fetchErr) throw fetchErr;

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: `${resume.title} (Copy)`,
          content: fullResume.content,
          template: resume.template,
          is_paid: true,
        })
        .select()
        .single();

      if (error) throw error;
      fetchResumes();
    } catch (err) {
      console.error('Error duplicating resume:', err);
      alert('Failed to duplicate resume.');
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0c0c0c] tracking-tight">My Resumes</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Create, edit, and export your ATS-compliant professional resumes
          </p>
        </div>

        <Button
          variant="accent"
          size="lg"
          onClick={createResume}
          disabled={creating}
          className="gap-2 shadow-md py-6 text-sm font-bold"
        >
          {creating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Create New Resume
            </>
          )}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resumes by title..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:outline-none shadow-sm"
        />
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="flex py-20 justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white text-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-[#febc04] flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#0c0c0c]">No Resumes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
            {searchQuery ? 'No resumes match your search query.' : "You haven't created any resumes yet. Click below to start crafting your first resume!"}
          </p>
          <Button variant="accent" onClick={createResume} disabled={creating} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Build Resume Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div
              key={resume.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-[#0c0c0c] text-[#febc04] flex items-center justify-center shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 capitalize">
                      {resume.template || 'Minimal'} Template
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#0c0c0c] group-hover:text-[#e5a803] transition-colors mb-2 line-clamp-1">
                  {resume.title}
                </h3>

                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(resume.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/dashboard/resume/${resume.id}`)}
                  className="flex-1 gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5 text-[#febc04]" />
                  Edit Resume
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => duplicateResume(resume)}
                  title="Duplicate Resume"
                >
                  <Copy className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteResume(resume.id)}
                  disabled={deletingId === resume.id}
                  title="Delete Resume"
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                >
                  {deletingId === resume.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
