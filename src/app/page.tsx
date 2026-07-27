"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Sliders,
  ShieldCheck,
  Award,
  ArrowRight,
  ChevronRight,
  Star,
  Users,
  Layout,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuthStore();
  const templates = [
    {
      id: "minimal",
      name: "Minimal Clean",
      tag: "Most Popular",
      desc: "Simple, elegant layout with strong typography hierarchy. Preferred by top recruiters.",
      color: "bg-slate-900",
    },
    {
      id: "modern",
      name: "Modern Accent",
      tag: "Trending",
      desc: "Bold header bar with gold accent styling for tech, design & business professionals.",
      color: "bg-[#febc04]",
    },
    {
      id: "executive",
      name: "Executive Leadership",
      tag: "Professional",
      desc: "Refined structure tailored for senior managers, directors, and C-level leaders.",
      color: "bg-indigo-900",
    },
    {
      id: "tech",
      name: "Tech & Developer",
      tag: "Developer Choice",
      desc: "Highlights technical stack, GitHub links, projects & system engineering achievements.",
      color: "bg-[#0F172A]",
    },
    {
      id: "creative",
      name: "Creative Studio",
      tag: "Designers",
      desc: "Side-column visual layout designed for UX/UI designers, artists, and marketers.",
      color: "bg-teal-700",
    },
    {
      id: "academic",
      name: "Academic Serif",
      tag: "Density Optimized",
      desc: "Fits maximum research, publication and academic experience into a crisp layout.",
      color: "bg-slate-800",
    },
  ];

  const features = [
    {
      icon: <Eye className="h-6 w-6 text-[#febc04]" />,
      title: "Real-Time Multi-Page Preview",
      desc: "Watch your resume render instantly with real-time page-break calculations as you type.",
    },
    {
      icon: <Download className="h-6 w-6 text-[#febc04]" />,
      title: "Pixel-Perfect PDF Export",
      desc: "Export crisp, vector-based PDF files optimized for printing and online applications.",
    },
    {
      icon: <Sliders className="h-6 w-6 text-[#febc04]" />,
      title: "Custom Section Ordering",
      desc: "Drag, reorder, hide or highlight sections effortlessly according to your target job role.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#febc04]" />,
      title: "100% ATS-Friendly Structure",
      desc: "Built with industry-standard semantic headers so applicant tracking systems parse every detail.",
    },
    {
      icon: <Layout className="h-6 w-6 text-[#febc04]" />,
      title: "Paper Sizes & Margin Control",
      desc: "Switch between A4, US Letter, or Legal with live font scaling and custom margin settings.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#febc04]" />,
      title: "Smart Color & Font Themes",
      desc: "Personalize primary colors, accent tones, and typography fonts with one click.",
    },
  ];

  const faqs = [
    {
      q: "What is the best resume format to land interviews globally?",
      a: "Top employers and recruiters globally rely on Applicant Tracking Systems (like Workday, Taleo, Greenhouse, Lever, and LinkedIn). The best format is a clean, structured 1 to 2 page resume with standard font hierarchies, quantified achievements, and clear section headings. CraftCV templates are pre-built to pass all major ATS filters seamlessly.",
    },
    {
      q: "Will my resume pass Applicant Tracking Systems (ATS) worldwide?",
      a: "Absolutely. CraftCV templates use standardized font families, parseable semantic headers, and standard layout structures that pass global ATS screening with 100% precision.",
    },
    {
      q: "Is CraftCV completely free to use?",
      a: "Yes! You can build, customize, and export high-resolution PDF resumes with our core templates completely free.",
    },
    {
      q: "Can I create multiple versions of my resume for different job applications?",
      a: "Yes! Your personal dashboard allows you to duplicate existing resumes, tailor keywords for specific job roles, and save unlimited versions for any industry.",
    },
    {
      q: "Is my data secure?",
      a: "Your data is encrypted and securely stored using Supabase cloud infrastructure. Only you have access to your personal information and resumes.",
    },
  ];

  const renderMiniMockup = (templateId: string) => {
    switch (templateId) {
      case 'minimal':
        return (
          <div className="w-full h-full bg-white p-3 flex flex-col justify-between border border-slate-100 rounded-lg shadow-inner">
            <div className="flex flex-col items-center space-y-1 mb-2">
              <div className="h-2 w-16 bg-slate-900 rounded-sm" />
              <div className="h-1 w-20 bg-slate-300 rounded-sm" />
              <div className="flex gap-1">
                <div className="h-[3px] w-8 bg-slate-200 rounded-sm" />
                <div className="h-[3px] w-8 bg-slate-200 rounded-sm" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-1.5 w-12 bg-amber-500/35 rounded-sm" />
              <div className="space-y-1 pl-1">
                <div className="flex justify-between">
                  <div className="h-1 w-14 bg-slate-400 rounded-sm" />
                  <div className="h-1 w-6 bg-slate-200 rounded-sm" />
                </div>
                <div className="h-1 w-24 bg-slate-300 rounded-sm" />
              </div>
              <div className="h-1.5 w-12 bg-amber-500/35 rounded-sm" />
              <div className="space-y-1 pl-1">
                <div className="flex justify-between">
                  <div className="h-1 w-12 bg-slate-400 rounded-sm" />
                  <div className="h-1 w-6 bg-slate-200 rounded-sm" />
                </div>
                <div className="h-1 w-20 bg-slate-300 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case 'modern':
        return (
          <div className="w-full h-full bg-white flex border border-slate-100 rounded-lg shadow-inner overflow-hidden">
            <div className="w-1/3 bg-slate-800 p-2 flex flex-col gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-600 mx-auto" />
              <div className="space-y-1">
                <div className="h-[3px] w-8 bg-slate-400 rounded-sm" />
                <div className="h-[3px] w-6 bg-slate-400 rounded-sm" />
              </div>
              <div className="space-y-1 mt-auto">
                <div className="h-1.5 w-6 bg-[#febc04]/70 rounded-sm" />
                <div className="flex flex-wrap gap-0.5">
                  <div className="h-2 w-4 bg-slate-700 rounded-[2px]" />
                  <div className="h-2 w-5 bg-slate-700 rounded-[2px]" />
                  <div className="h-2 w-3 bg-slate-700 rounded-[2px]" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-2.5 w-16 bg-slate-900 rounded-sm" />
                <div className="h-1.5 w-10 bg-slate-400 rounded-sm" />
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-1 w-10 bg-[#febc04] rounded-sm" />
                <div className="space-y-1">
                  <div className="h-1 w-20 bg-slate-300/80 rounded-sm" />
                  <div className="h-1 w-24 bg-slate-200 rounded-sm" />
                </div>
                <div className="h-1 w-10 bg-[#febc04] rounded-sm" />
                <div className="space-y-1">
                  <div className="h-1 w-20 bg-slate-300/80 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'executive':
        return (
          <div className="w-full h-full bg-white p-3 flex flex-col border border-slate-100 rounded-lg shadow-inner">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
              <div className="space-y-1">
                <div className="h-2.5 w-14 bg-slate-900 rounded-sm" />
                <div className="h-1 w-10 bg-slate-400 rounded-sm" />
              </div>
              <div className="h-7 w-7 rounded-lg bg-slate-200 border border-slate-300" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-1.5 w-16 bg-slate-800 rounded-sm" />
              <div className="space-y-1">
                <div className="h-1 w-24 bg-slate-300 rounded-sm" />
                <div className="h-1 w-20 bg-slate-200 rounded-sm" />
              </div>
              <div className="h-1.5 w-16 bg-slate-800 rounded-sm" />
              <div className="space-y-1">
                <div className="h-1 w-24 bg-slate-300 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case 'creative':
        return (
          <div className="w-full h-full bg-white flex border border-slate-100 rounded-lg shadow-inner overflow-hidden">
            <div className="w-1/3 bg-teal-800 p-2 flex flex-col gap-2">
              <div className="h-6 w-6 rounded-full bg-teal-600 mx-auto" />
              <div className="space-y-1">
                <div className="h-[3px] w-8 bg-teal-400 rounded-sm" />
                <div className="h-[3px] w-6 bg-teal-400 rounded-sm" />
              </div>
            </div>
            <div className="flex-1 p-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-2.5 w-16 bg-slate-900 rounded-sm" />
                <div className="h-1.5 w-10 bg-slate-400 rounded-sm" />
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-1 w-12 bg-teal-700 rounded-sm" />
                <div className="space-y-1">
                  <div className="h-1 w-20 bg-slate-300/80 rounded-sm" />
                  <div className="h-1 w-24 bg-slate-200 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'academic':
        return (
          <div className="w-full h-full bg-white p-3 flex flex-col border border-slate-100 rounded-lg shadow-inner">
            <div className="flex flex-col items-center space-y-1 mb-2 border-b border-slate-200 pb-1.5">
              <div className="h-2 w-20 bg-slate-900 rounded-sm" />
              <div className="h-[3px] w-12 bg-slate-500 rounded-sm" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-1 w-10 bg-slate-800 rounded-sm font-bold" />
              <div className="space-y-1 pl-1">
                <div className="h-[3px] w-24 bg-slate-300 rounded-sm" />
                <div className="h-[3px] w-20 bg-slate-300 rounded-sm" />
                <div className="h-[3px] w-24 bg-slate-200 rounded-sm" />
              </div>
              <div className="h-1 w-10 bg-slate-800 rounded-sm font-bold" />
              <div className="space-y-1 pl-1">
                <div className="h-[3px] w-24 bg-slate-300 rounded-sm" />
                <div className="h-[3px] w-24 bg-slate-200 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case 'tech':
        return (
          <div className="w-full h-full bg-white flex border border-slate-100 rounded-lg shadow-inner overflow-hidden">
            <div className="w-1/3 bg-slate-900 p-2 flex flex-col gap-2">
              <div className="h-4 w-10 bg-slate-800 rounded-sm" />
              <div className="space-y-1">
                <div className="h-[3px] w-8 bg-slate-500 rounded-sm" />
                <div className="h-[3px] w-6 bg-slate-500 rounded-sm" />
              </div>
              <div className="space-y-1 mt-auto">
                <div className="h-1.5 w-8 bg-slate-600 rounded-sm" />
                <div className="flex flex-wrap gap-0.5">
                  <div className="h-2.5 w-6 bg-slate-800 rounded-[2px]" />
                  <div className="h-2.5 w-5 bg-slate-800 rounded-[2px]" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-2.5 w-16 bg-slate-950 rounded-sm" />
                <div className="h-1 w-12 bg-slate-500 rounded-sm" />
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-1 w-10 bg-slate-800 rounded-sm" />
                <div className="space-y-1">
                  <div className="h-1 w-20 bg-slate-300/80 rounded-sm" />
                  <div className="h-1 w-24 bg-slate-200 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-lg shadow-inner">
            <FileText className="h-8 w-8 text-slate-300" />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F9F9]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 bg-gradient-to-b from-white via-[#F9F9F9] to-slate-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-800 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#febc04]" />
                <span>
                  The #1 Free ATS Resume Builder &amp; Online CV Maker by Bot&amp;Guy
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-[#0c0c0c] sm:text-5xl lg:text-6xl leading-[1.1]">
                Craft Job-Winning Resumes{" "}
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0c0c0c] via-slate-800 to-[#e5a803]">
                  for Global Careers &amp; Remote Jobs
                </span>
              </h1>

              <p className="max-w-2xl text-base sm:text-lg text-slate-600 font-normal leading-relaxed mx-auto lg:mx-0">
                Create ATS-optimized, high-impact professional resumes &amp; CVs
                tailored for top recruiters and hiring managers worldwide.
                Real-time multi-page preview, smart section ordering, and
                instant PDF download.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href={user ? "/dashboard" : "/auth/login?redirect=%2Fdashboard"} className="w-full sm:w-auto">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-base px-8 py-6 shadow-lg shadow-amber-500/20"
                  >
                    <Sparkles className="h-5 w-5" />
                    Build My Resume Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/templates" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-base px-6 py-6 border-slate-300"
                  >
                    <Layout className="h-5 w-5 text-slate-600" />
                    Explore Templates
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Global &amp; US Standard Format</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>ATS-Compliant Parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Instant Vector PDF Export</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-transform hover:scale-[1.02] duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    CraftCV Live Builder
                  </span>
                </div>

                {/* Mock Resume Canvas */}
                <div className="space-y-4 rounded-xl bg-slate-50 p-5 border border-slate-200/60 font-sans">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      Alex Morgan
                    </h3>
                    <p className="text-xs font-bold text-[#febc04]">
                      Senior Software Architect
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      alex.morgan@email.com • +1 (555) 019-2834 • San Francisco,
                      CA
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                      Professional Experience
                    </h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span>Lead Full-Stack Engineer</span>
                        <span className="text-slate-400 text-[10px]">
                          2022 - Present
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Architected micro-frontend systems scaled to 2M+ active
                        daily users with 99.99% uptime.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                      Core Competencies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "React & Next.js",
                        "TypeScript",
                        "Node.js",
                        "Supabase",
                        "Tailwind",
                        "PostgreSQL",
                      ].map((sk) => (
                        <span
                          key={sk}
                          className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl bg-[#0c0c0c] text-white p-3 shadow-xl border border-slate-800">
                  <div className="rounded-lg bg-[#febc04] p-2 text-[#0c0c0c]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white">
                      Live PDF Export
                    </p>
                    <p className="text-[10px] text-slate-400">
                      High-resolution vector output
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-20 bg-white border-y border-slate-200/80"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#e5a803] mb-2">
              Powerful Features
            </h2>
            <p className="text-3xl font-extrabold text-[#0c0c0c] sm:text-4xl">
              Everything You Need to Stand Out
            </p>
            <p className="mt-3 text-slate-600 text-base">
              Designed with recruiter standards and modern design precision in
              mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[#0c0c0c] p-3 shadow-md group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0c0c0c] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Templates Gallery */}
      <section id="templates" className="py-20 bg-[#F9F9F9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#e5a803] mb-2">
              Curated Designs
            </h2>
            <p className="text-3xl font-extrabold text-[#0c0c0c] sm:text-4xl">
              Professional Resume Templates
            </p>
            <p className="mt-3 text-slate-600 text-base">
              Select from battle-tested layouts built for every industry and
              career stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Mockup Preview Area */}
                  <div className="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 p-4 mb-4 relative overflow-hidden flex items-center justify-center group-hover:bg-slate-100/50 transition-colors">
                    {renderMiniMockup(tpl.id)}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
                      {tpl.tag}
                    </span>
                    <span className={`h-3 w-3 rounded-full ${tpl.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0c0c0c] mb-2">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {tpl.desc}
                  </p>
                </div>
                <Link href={user ? `/dashboard?template=${tpl.id}` : `/auth/login?redirect=${encodeURIComponent(`/dashboard?template=${tpl.id}`)}`}>
                  <Button
                    variant="outline"
                    className="w-full justify-between group-hover:border-[#0c0c0c] group-hover:bg-[#0c0c0c] group-hover:text-white transition-all font-bold"
                  >
                    <span>Use Template</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* View All Templates Button */}
          <div className="flex justify-center mt-12">
            <Link href="/templates">
              <Button
                variant="default"
                size="lg"
                className="gap-2 px-8 py-6 font-bold shadow-md bg-[#0c0c0c] text-white hover:bg-neutral-800"
              >
                View All Templates
                <ArrowRight className="h-5 w-5 text-[#febc04]" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Tier */}
      <section
        id="pricing"
        className="py-20 bg-white border-t border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#e5a803] mb-2">
              Transparent Access
            </h2>
            <p className="text-3xl font-extrabold text-[#0c0c0c] sm:text-4xl">
              Start Building Free
            </p>
          </div>

          <div className="max-w-md mx-auto rounded-3xl border-2 border-[#0c0c0c] bg-white p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#febc04] text-[#0c0c0c] text-[11px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl">
              Pro Free Access
            </div>
            <h3 className="text-2xl font-extrabold text-[#0c0c0c] mb-2">
              Complete Resume Pass
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Create and export up to 2 high-quality professional resumes.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-[#0c0c0c]">$0</span>
              <span className="text-slate-500 text-sm">/ forever free</span>
            </div>

            <ul className="space-y-3 text-xs font-medium text-slate-700 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Up to 2 Resumes &amp; Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>All Professional Resume Templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>High-Res PDF Download with Multi-Page Break</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Custom Color Schemes &amp; Typography</span>
              </li>
            </ul>

            <Link href={user ? "/dashboard" : "/auth/login?redirect=%2Fdashboard"}>
              <Button
                variant="accent"
                size="lg"
                className="w-full font-extrabold text-base py-6 shadow-md"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#F9F9F9]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#0c0c0c]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-bold text-base text-[#0c0c0c] mb-2 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#febc04]" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-[#0c0c0c] text-white">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            Ready to Land Your Next Dream Job?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Build your professional resume now with CraftCV by Bot&amp;Guy and
            showcase your qualifications to recruiters.
          </p>
          <Link href={user ? "/dashboard" : "/auth/login?redirect=%2Fdashboard"}>
            <Button
              variant="accent"
              size="lg"
              className="gap-2 px-8 py-6 text-base font-extrabold shadow-xl"
            >
              <Sparkles className="h-5 w-5" />
              Create Resume Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
