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
  Check,
  X,
  Target,
  ArrowRight,
  Sparkle,
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // AI Prompt Builder Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTab, setAiTab] = useState<'optimize' | 'scratch'>('optimize');

  // Prompt 1 (Optimize) State
  const [optResumeText, setOptResumeText] = useState('');
  const [optJobDesc, setOptJobDesc] = useState('');
  const [optTemplate, setOptTemplate] = useState('minimal');
  const [optLoading, setOptLoading] = useState(false);

  // Prompt 2 (Scratch) State
  const [scratchName, setScratchName] = useState('');
  const [scratchEmail, setScratchEmail] = useState('');
  const [scratchPhone, setScratchPhone] = useState('');
  const [scratchLocation, setScratchLocation] = useState('');
  const [scratchLinkedIn, setScratchLinkedIn] = useState('');
  const [scratchJobTitle, setScratchJobTitle] = useState('');
  const [scratchExperience, setScratchExperience] = useState('');
  const [scratchEducation, setScratchEducation] = useState('');
  const [scratchSkills, setScratchSkills] = useState('');
  const [scratchCerts, setScratchCerts] = useState('');
  const [scratchLanguages, setScratchLanguages] = useState('');
  const [scratchProjects, setScratchProjects] = useState('');
  const [scratchTemplate, setScratchTemplate] = useState('minimal');
  const [scratchLoading, setScratchLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setScratchName(user.user_metadata?.full_name || '');
      setScratchEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchResumes();
  }, [user]);

  // Handle template query parameter when navigating from Landing page
  useEffect(() => {
    if (!user || loading) return;

    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get('template');
    if (templateParam) {
      // Clear search param from URL so refresh doesn't duplicate creation
      window.history.replaceState({}, '', '/dashboard');
      createResume(templateParam);
    }
  }, [user, loading]);

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

  const createResume = async (selectedTemplate?: string) => {
    if (!user) return;
    setCreating(true);
    try {
      const targetTemplate = selectedTemplate || 'minimal';
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
          template: targetTemplate,
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

  const renameResume = async (id: string) => {
    if (!editingTitle.trim()) return;
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ title: editingTitle.trim() })
        .eq('id', id);

      if (error) throw error;
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: editingTitle.trim() } : r))
      );
    } catch (err) {
      console.error('Error renaming resume:', err);
      alert('Failed to rename resume. Please try again.');
    } finally {
      setEditingId(null);
    }
  };

  const handleOptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optResumeText.trim() || !optJobDesc.trim()) {
      alert('Please fill in both resume text and job description.');
      return;
    }
    try {
      setOptLoading(true);
      const res = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: {
            personalInfo: { fullName: scratchName || user?.user_metadata?.full_name || '', email: scratchEmail || user?.email || '', phone: '', location: '', website: '', linkedIn: '', github: '', twitter: '', jobTitle: '', summary: optResumeText.substring(0, 300) },
            experience: [],
            education: [],
            projects: [],
            skills: [],
            certifications: [],
          },
          jobDescription: optJobDesc,
        }),
      });

      if (!res.ok) throw new Error('Optimization request failed.');
      const optimizedContent = await res.json();

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user?.id,
          title: `ATS Optimized - ${resumes.length + 1}`,
          content: optimizedContent,
          template: optTemplate,
          is_paid: true,
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/dashboard/resume/${data.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to optimize and build resume.');
    } finally {
      setOptLoading(false);
    }
  };

  const handleScratchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchJobTitle.trim() || !scratchExperience.trim()) {
      alert('Please enter at least a job title and work experience details.');
      return;
    }
    try {
      setScratchLoading(true);
      
      const payload = {
        fullName: scratchName,
        email: scratchEmail,
        phone: scratchPhone,
        location: scratchLocation,
        linkedIn: scratchLinkedIn,
        jobTitle: scratchJobTitle,
        experienceRaw: scratchExperience,
        educationRaw: scratchEducation,
        skillsRaw: scratchSkills,
        certsRaw: scratchCerts,
        languagesRaw: scratchLanguages,
        projectsRaw: scratchProjects,
      };

      const res = await fetch('/api/generate-resume-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: payload }),
      });

      if (!res.ok) throw new Error('Generation request failed.');
      const compiledContent = await res.json();

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user?.id,
          title: `${scratchJobTitle} Resume`,
          content: compiledContent,
          template: scratchTemplate,
          is_paid: true,
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/dashboard/resume/${data.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate resume.');
    } finally {
      setScratchLoading(false);
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Dashboard Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0c0c0c] tracking-tight">My Resumes</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Create, optimize, and export your ATS-compliant professional resumes.
        </p>
      </div>

      {/* 3-Column Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Create Manually */}
        <div 
          onClick={() => !creating && createResume()}
          className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-[#febc04] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              {creating ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#febc04]" />
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0c0c0c] group-hover:text-amber-500 transition-colors">Create Manually</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Start from a clean slate. Input your details step-by-step using our rich visual editor and download your resume.
              </p>
            </div>
          </div>
          <div className="pt-6">
            <Button
              className="w-full bg-[#febc04] hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/10 text-slate-950 font-bold text-xs py-5 rounded-xl border-0 flex items-center justify-center gap-1.5 transition-all"
            >
              Start Fresh
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Card 2: Create with AI */}
        <div 
          onClick={() => setShowAiModal(true)}
          className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-indigo-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0c0c0c] group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                Create with AI
                <span className="rounded-full bg-indigo-500/10 text-indigo-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-indigo-200/50">New</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Generate tailored resumes from scratch or optimize existing CV text for target job descriptions using prompts.
              </p>
            </div>
          </div>
          <div className="pt-6">
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 text-white font-bold text-xs py-5 rounded-xl border-0 flex items-center justify-center gap-1.5 transition-all"
            >
              Build with AI
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Card 3: Check ATS Score */}
        <div 
          onClick={() => router.push('/dashboard/ats-score')}
          className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0c0c0c] group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                Check ATS Score
                <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-emerald-200/50">New</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Scan your CV against any job posting. Get a match score, find missing keywords, and get structural suggestions.
              </p>
            </div>
          </div>
          <div className="pt-6">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-500/10 text-white font-bold text-xs py-5 rounded-xl border-0 flex items-center justify-center gap-1.5 transition-all"
            >
              Run ATS Check
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Saved Resumes Header */}
      <div className="border-t border-slate-200 pt-8 mb-6">
        <h2 className="text-xl font-extrabold text-[#0c0c0c] tracking-tight">My Saved Resumes</h2>
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
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-[#ffffff] text-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-[#febc04] flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#0c0c0c]">No Resumes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
            {searchQuery ? 'No resumes match your search query.' : "You haven't created any resumes yet. Click below to start crafting your first resume!"}
          </p>
          <Button variant="accent" onClick={() => createResume()} disabled={creating} className="gap-2">
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

                {editingId === resume.id ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm font-bold text-[#0c0c0c] focus:border-[#0c0c0c] focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') renameResume(resume.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <button
                      onClick={() => renameResume(resume.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-slate-400 hover:bg-slate-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group/title mb-2">
                    <h3 className="text-xl font-bold text-[#0c0c0c] group-hover/title:text-[#e5a803] transition-colors line-clamp-1">
                      {resume.title}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingId(resume.id);
                        setEditingTitle(resume.title);
                      }}
                      className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-all rounded hover:bg-slate-100"
                      title="Rename Resume"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

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

      {/* AI Prompt Builder Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#febc04]" />
                <h3 className="text-lg font-bold text-[#0c0c0c]">Create Resume with AI</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-1 m-4 rounded-xl">
              <button
                type="button"
                onClick={() => setAiTab('optimize')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  aiTab === 'optimize'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Optimize Existing CV
              </button>
              <button
                type="button"
                onClick={() => setAiTab('scratch')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  aiTab === 'scratch'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Build From Scratch
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 pt-0">
              {aiTab === 'optimize' ? (
                <form onSubmit={handleOptSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Paste Current Resume Text</label>
                    <textarea
                      required
                      value={optResumeText}
                      onChange={(e) => setOptResumeText(e.target.value)}
                      placeholder="Paste the text contents of your current resume here..."
                      rows={5}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Paste Target Job Description (Optional context)</label>
                    <textarea
                      required
                      value={optJobDesc}
                      onChange={(e) => setOptJobDesc(e.target.value)}
                      placeholder="Paste the job description of the role you are targeting..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select Template Design</label>
                    <select
                      value={optTemplate}
                      onChange={(e) => setOptTemplate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                    >
                      <option value="minimal">Minimalist Classic</option>
                      <option value="modern">Modern Slate</option>
                      <option value="executive">Executive Premium</option>
                      <option value="creative">Creative Teal</option>
                      <option value="academic">Academic Serif</option>
                      <option value="tech">Developer Tech</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={optLoading}
                    className="w-full py-6 font-bold text-sm"
                  >
                    {optLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Optimizing & Rewriting...
                      </>
                    ) : (
                      'Optimize & Rewrite Resume'
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleScratchSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={scratchName}
                        onChange={(e) => setScratchName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email</label>
                      <input
                        type="email"
                        required
                        value={scratchEmail}
                        onChange={(e) => setScratchEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone</label>
                      <input
                        type="text"
                        value={scratchPhone}
                        onChange={(e) => setScratchPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Location</label>
                      <input
                        type="text"
                        value={scratchLocation}
                        onChange={(e) => setScratchLocation(e.target.value)}
                        placeholder="San Francisco, CA"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Target Job Title</label>
                    <input
                      type="text"
                      required
                      value={scratchJobTitle}
                      onChange={(e) => setScratchJobTitle(e.target.value)}
                      placeholder="Senior Full Stack Engineer"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Work Experience (Roles, Companies, Dates, Achievement notes)</label>
                    <textarea
                      required
                      value={scratchExperience}
                      onChange={(e) => setScratchExperience(e.target.value)}
                      placeholder="e.g., Software Engineer at Google (2021-2023) - developed APIs, scaled search microservices to 10k users. Product Developer at Stripe (2019-2021)..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Education Details (Degrees, Institutions, Dates)</label>
                    <textarea
                      value={scratchEducation}
                      onChange={(e) => setScratchEducation(e.target.value)}
                      placeholder="e.g., BS in Computer Science from Stanford University (2015-2019)..."
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      value={scratchSkills}
                      onChange={(e) => setScratchSkills(e.target.value)}
                      placeholder="React, Next.js, Node.js, Python, AWS, SQL"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Projects (Name, Role, Details/Bullet points)</label>
                    <textarea
                      value={scratchProjects}
                      onChange={(e) => setScratchProjects(e.target.value)}
                      placeholder="e.g. ChatApp - Lead Developer - built real-time WebSocket messaging service reducing latency by 40%..."
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Certificates &amp; Credentials</label>
                    <input
                      type="text"
                      value={scratchCerts}
                      onChange={(e) => setScratchCerts(e.target.value)}
                      placeholder="e.g. AWS Certified Developer Associate, Google Project Management Professional..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Languages</label>
                    <input
                      type="text"
                      value={scratchLanguages}
                      onChange={(e) => setScratchLanguages(e.target.value)}
                      placeholder="e.g. English (Native), Spanish (Conversational), Arabic (Fluent)..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select Template Design</label>
                    <select
                      value={scratchTemplate}
                      onChange={(e) => setScratchTemplate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-xs font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
                    >
                      <option value="minimal">Minimalist Classic</option>
                      <option value="modern">Modern Slate</option>
                      <option value="executive">Executive Premium</option>
                      <option value="creative">Creative Teal</option>
                      <option value="academic">Academic Serif</option>
                      <option value="tech">Developer Tech</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={scratchLoading}
                    className="w-full py-6 font-bold text-sm"
                  >
                    {scratchLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Resume...
                      </>
                    ) : (
                      'Create ATS Resume'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
