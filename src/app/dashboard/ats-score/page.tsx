'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Check,
  X,
  Sliders,
  Type,
} from 'lucide-react';

interface Resume {
  id: string;
  title: string;
  template: string;
  content: any;
}

interface Suggestion {
  before: string;
  after: string;
  reason: string;
}

interface AnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  atsFeedback: string[];
  suggestions: Suggestion[];
}

const TEMPLATES = [
  { id: 'minimal', name: 'Minimalist Classic', type: 'Single-Column' },
  { id: 'modern', name: 'Modern Slate', type: 'Two-Column' },
  { id: 'executive', name: 'Executive Premium', type: 'Single-Column' },
  { id: 'creative', name: 'Creative Teal', type: 'Two-Column' },
  { id: 'academic', name: 'Academic Serif', type: 'Single-Column' },
  { id: 'tech', name: 'Developer Tech', type: 'Two-Column' },
];

export default function AtsScorePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  
  const [selectedResumeId, setSelectedResumeId] = useState<string>('custom');
  const [pastedResumeText, setPastedResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('minimal');

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchResumes();
  }, [user]);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('id, title, template, content')
        .eq('user_id', user?.id);

      if (error) throw error;
      setResumes(data || []);
      if (data && data.length > 0) {
        setSelectedResumeId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleAnalyze = async () => {
    setErrorMsg(null);
    setAnalysisResult(null);

    let resumeTextToAnalyze = '';
    if (selectedResumeId === 'custom') {
      if (!pastedResumeText.trim()) {
        setErrorMsg('Please paste your resume text or select an existing one.');
        return;
      }
      resumeTextToAnalyze = pastedResumeText;
    } else {
      const selected = resumes.find((r) => r.id === selectedResumeId);
      if (selected) {
        // Convert structured content to a plain string representable for analysis
        resumeTextToAnalyze = JSON.stringify(selected.content);
      }
    }

    if (!jobDescription.trim()) {
      setErrorMsg('Please paste the target job description.');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeTextToAnalyze,
          jobDescription,
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed. Please try again.');
      }

      const result = await res.json();
      setAnalysisResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOptimizeAndCreate = async () => {
    if (!analysisResult) return;
    setErrorMsg(null);

    let baseContent = {
      personalInfo: { fullName: user?.user_metadata?.full_name || '', email: user?.email || '', phone: '', location: '', website: '', linkedIn: '', github: '', twitter: '', jobTitle: '', summary: '' },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
    };

    if (selectedResumeId !== 'custom') {
      const selected = resumes.find((r) => r.id === selectedResumeId);
      if (selected) {
        baseContent = selected.content;
      }
    } else {
      // Create simple shell based on pasted text or standard structure
      baseContent.personalInfo.summary = pastedResumeText.substring(0, 300);
    }

    try {
      setOptimizing(true);
      
      // Call optimize API to rewrite content to ATS-friendly metrics
      const optimizeRes = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: baseContent,
          jobDescription,
        }),
      });

      if (!optimizeRes.ok) {
        throw new Error('Optimization request failed.');
      }

      const optimizedContent = await optimizeRes.json();

      // Create new resume in Supabase
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user?.id,
          title: `ATS Optimized - ${resumes.length + 1}`,
          content: optimizedContent,
          template: selectedTemplate,
          is_paid: true,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/dashboard/resume/${data.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate optimized resume.');
    } finally {
      setOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500 bg-emerald-50';
    if (score >= 50) return 'text-amber-500 border-amber-500 bg-amber-50';
    return 'text-rose-500 border-rose-500 bg-rose-50';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-[#0c0c0c] tracking-tight flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-[#febc04]" />
            ATS Resume Score Checker
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Analyze matches, identify missing keywords, and get tailored Suggestions to pass candidate screening filters.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-200 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Section */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#0c0c0c] border-b pb-3 border-slate-100">Configure Analysis</h2>

          {/* Resume Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">1. Select Resume Source</label>
            {loadingResumes ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading your resumes...</span>
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-900 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.template} template)
                  </option>
                ))}
                <option value="custom">-- Paste Custom Resume Text --</option>
              </select>
            )}
          </div>

          {/* Pasted text area if custom is selected */}
          {selectedResumeId === 'custom' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Paste Resume Text</label>
              <textarea
                value={pastedResumeText}
                onChange={(e) => setPastedResumeText(e.target.value)}
                placeholder="Paste your existing resume text here..."
                rows={8}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
              />
            </div>
          )}

          {/* Job Description Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">2. Paste Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description details here to find keywords and calculate score..."
              rows={8}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0c0c0c] focus:bg-white focus:outline-none"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-6 font-bold text-sm gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Compatibility...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Analyze Compatibility & Score
              </>
            )}
          </Button>
        </div>

        {/* Right Output / Results Section */}
        <div className="lg:col-span-5 space-y-6">
          {analyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 py-20 animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-[#febc04]" />
              <h3 className="text-sm font-bold text-[#0c0c0c]">Calculating ATS Score</h3>
              <p className="text-xs text-slate-500 max-w-xs">Our AI optimizer is scanning section headers, calculating keyword frequencies, and preparing writing improvements.</p>
            </div>
          )}

          {!analysisResult && !analyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center py-20 space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 text-[#febc04] flex items-center justify-center mx-auto shadow-sm">
                <Sliders className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-[#0c0c0c]">Awaiting Analysis</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Select a resume and input a job description to trigger compatibility match results.</p>
            </div>
          )}

          {analysisResult && !analyzing && (
            <div className="space-y-6">
              {/* Score Gauge */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-center flex flex-col items-center space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">ATS Match Score</h3>
                <div className={`h-24 w-24 rounded-full border-4 flex items-center justify-center text-2xl font-black ${getScoreColor(analysisResult.score)}`}>
                  {analysisResult.score}%
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {analysisResult.score >= 80
                    ? 'Excellent ATS match! Ready to apply.'
                    : analysisResult.score >= 50
                    ? 'Good start, but adding missing keywords can boost your rank.'
                    : 'Needs attention. Rewriting experience bullets is highly recommended.'}
                </p>
              </div>

              {/* Keywords Match Summary */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#0c0c0c]">Keywords Analysis</h3>
                
                {/* Missing */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    Missing Keywords ({analysisResult.missingKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingKeywords.map((kw, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-rose-50 border border-rose-100 text-rose-700 px-2.5 py-1 rounded-lg">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Matched */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Matched Keywords ({analysisResult.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formatting & Structure advice */}
              {analysisResult.atsFeedback && analysisResult.atsFeedback.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-[#0c0c0c] flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ATS Formatting Checklist
                  </h3>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600 pl-1">
                    {analysisResult.atsFeedback.map((fb, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                        <span>{fb}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Before / After Suggestions */}
              {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-[#0c0c0c]">Suggested Optimizations</h3>
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {analysisResult.suggestions.map((sug, i) => (
                      <div key={i} className="text-xs border border-slate-100 p-3.5 rounded-2xl bg-slate-50/50 space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Current Bullet</span>
                          <p className="text-slate-500 italic mt-0.5">"{sug.before}"</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">ATS Optimized</span>
                          <p className="text-slate-800 font-bold mt-0.5">"{sug.after}"</p>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 mt-1">{sug.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Select Template & Create optimized resume */}
              <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 shadow-xl space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#febc04] animate-pulse" />
                    Rewrite with AI Resume Builder
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Completely rewrite the selected experience bullets incorporating missing keywords, formatting fixes, and download as PDF.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Template Design</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs font-semibold text-white focus:border-[#febc04] focus:outline-none"
                  >
                    {TEMPLATES.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.type})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="accent"
                  onClick={handleOptimizeAndCreate}
                  disabled={optimizing}
                  className="w-full py-6 font-bold text-sm shadow-md"
                >
                  {optimizing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Optimizing & Building...
                    </>
                  ) : (
                    <>
                      Optimize & Create CV
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
