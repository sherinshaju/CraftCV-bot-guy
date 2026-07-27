'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  FileText,
  Layout,
  Columns,
  BookOpen,
  Laptop,
  CheckCircle2,
  ListFilter,
  User,
  Sliders,
  Type,
  Palette,
} from 'lucide-react';

const TEMPLATE_DEFS = [
  {
    id: 'minimal',
    name: 'Minimalist Classic',
    desc: 'Standard serif, centered header. Traditional gold-standard layout. Clean and professional.',
    color: '#111111',
    font: 'Georgia / Lora',
    type: 'Single-Column',
    tag: 'Most Popular',
  },
  {
    id: 'modern',
    name: 'Modern Slate',
    desc: 'Deep slate accents, left sidebar for photo, contacts, and skills. Professional layout.',
    color: '#475569',
    font: 'Inter',
    type: 'Two-Column',
    tag: 'Trending',
  },
  {
    id: 'executive',
    name: 'Executive Premium',
    desc: 'Outfit typography, bold underlines, neat top-right photo. Suited for senior roles.',
    color: '#1E293B',
    font: 'Outfit',
    type: 'Single-Column',
    tag: 'Executive',
  },
  {
    id: 'creative',
    name: 'Creative Teal',
    desc: 'Teal sidebar, white text details, Lora headings. Stand out from other applicants.',
    color: '#0D9488',
    font: 'Lora + Inter',
    type: 'Two-Column',
    tag: 'Creative Choice',
  },
  {
    id: 'academic',
    name: 'Academic Serif',
    desc: 'Dense Merriweather structure. High content density, traditional margins. No photo.',
    color: '#1F2937',
    font: 'Merriweather',
    type: 'Single-Column',
    tag: 'Research & CV',
  },
  {
    id: 'tech',
    name: 'Developer Tech',
    desc: 'Dark slate sidebar, monospace tags for tech stacks, terminal-like history.',
    color: '#0F172A',
    font: 'Fira Code + Inter',
    type: 'Two-Column',
    tag: 'Developer Favorite',
  },
  {
    id: 'elegant',
    name: 'Elegant Navy',
    desc: 'Circular banner photo, Playfair Display titles, deep navy accents. Clean and premium.',
    color: '#1E3A8A',
    font: 'Playfair + Inter',
    type: 'Single-Column',
    tag: 'Premium Design',
  },
  {
    id: 'simple',
    name: 'Simple Emerald',
    desc: 'Left header photo, fresh emerald lines and dividers. Light and airy.',
    color: '#059669',
    font: 'Open Sans',
    type: 'Single-Column',
    tag: 'Clean & Fresh',
  },
  {
    id: 'metro',
    name: 'Metro Boxed',
    desc: 'Modern boxed sections, high density Outfit font. No photo.',
    color: '#374151',
    font: 'Outfit',
    type: 'Single-Column',
    tag: 'Boxed Layout',
  },
  {
    id: 'warm',
    name: 'Warm Ochre',
    desc: 'Ochre details, rounded pills, contacts in sidebar, photo in main content.',
    color: '#D97706',
    font: 'Lora + Outfit',
    type: 'Two-Column',
    tag: 'Warm Palette',
  },
  {
    id: 'marketing',
    name: 'Marketing Bold',
    desc: 'Vibrant yellow/amber headers, bold black sidebar cards for stats. Dynamic layout.',
    color: '#EAB308',
    font: 'Inter',
    type: 'Two-Column',
    tag: 'Highly Dynamic',
  },
  {
    id: 'corporate',
    name: 'Corporate Slate Blue',
    desc: 'Professional slate blue accents, clean underlines, modern sans-serif layout. Outstanding for corporate roles.',
    color: '#2B6CB0',
    font: 'Inter',
    type: 'Single-Column',
    tag: 'Corporate Spec',
  },
  {
    id: 'chicago',
    name: 'Chicago Editorial',
    desc: 'Traditional serif styling, centered header blocks, elegant margin spaces. Perfect for writers and researchers.',
    color: '#2D3748',
    font: 'Merriweather',
    type: 'Single-Column',
    tag: 'Editorial Classic',
  },
  {
    id: 'berkeley',
    name: 'Berkeley Academic Navy',
    desc: 'Deep navy color accents, structured traditional layout, Lora serif typography. Tailored for academic CVs.',
    color: '#1A365D',
    font: 'Lora',
    type: 'Single-Column',
    tag: 'Academic Gold',
  },
  {
    id: 'geneva',
    name: 'Geneva Modernist',
    desc: 'Minimalist header with fresh light blue accent lines, highly parseable and extremely clean.',
    color: '#3182CE',
    font: 'Open Sans',
    type: 'Single-Column',
    tag: 'Modernist Line',
  },
  {
    id: 'tokyo',
    name: 'Tokyo Minimalist Boxed',
    desc: 'Neat boxed categories, dense grid structure, premium Outfit typography. Excellent for compact profiles.',
    color: '#4A5568',
    font: 'Outfit',
    type: 'Single-Column',
    tag: 'Compact Box',
  },
  {
    id: 'sydney',
    name: 'Sydney Creative Bold',
    desc: 'Thick purple sidebar accents, clean left-aligned typography. Designed to grab recruiters\' attention.',
    color: '#805AD5',
    font: 'Inter',
    type: 'Single-Column',
    tag: 'Bold & Creative',
  },
  {
    id: 'classic_pro',
    name: 'Classic Professional',
    desc: 'Clean dark grey accents, traditional spacing, highly readable Inter typography. The ultimate ATS-safe layout.',
    color: '#2C3E50',
    font: 'Inter',
    type: 'Single-Column',
    tag: 'Standard Core',
  },
  {
    id: 'retail',
    name: 'Retail & Service Hub',
    desc: 'Amber highlighted tabs, friendly sans-serif body, left-aligned photo grid. Suited for customer success roles.',
    color: '#D69E2E',
    font: 'Open Sans',
    type: 'Single-Column',
    tag: 'Operations Spec',
  },
  {
    id: 'startup',
    name: 'Startup Executive',
    desc: 'Bold red accent borders, neat side-by-side header boxes, Outfit font. Modern, fast-paced and striking.',
    color: '#E53E3E',
    font: 'Outfit',
    type: 'Single-Column',
    tag: 'Fast Pace Spec',
  },
];

export default function TemplatesPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'All' | 'Single-Column' | 'Two-Column'>('All');

  const filteredTemplates = TEMPLATE_DEFS.filter(
    (tpl) => filter === 'All' || tpl.type === filter
  );

  // Helper to render mini CSS layout mockups representing the template structure
  const renderMiniMockup = (templateId: string) => {
    switch (templateId) {
      case 'minimal':
      case 'chicago':
      case 'classic_pro':
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
      case 'corporate':
      case 'startup':
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
      case 'sydney':
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
      case 'berkeley':
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
      case 'elegant':
        return (
          <div className="w-full h-full bg-white p-3 flex flex-col border border-slate-100 rounded-lg shadow-inner">
            <div className="flex flex-col items-center space-y-1.5 mb-2 border-b border-indigo-900/10 pb-2">
              <div className="h-7 w-7 rounded-full bg-indigo-50 border border-slate-200 flex-shrink-0" />
              <div className="h-2 w-16 bg-indigo-950 rounded-sm" />
              <div className="h-[3px] w-12 bg-indigo-500 rounded-sm" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-1 w-8 bg-indigo-900 rounded-sm" />
              <div className="space-y-1">
                <div className="h-1 w-24 bg-slate-300 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case 'simple':
      case 'geneva':
      case 'retail':
        return (
          <div className="w-full h-full bg-white p-3 flex flex-col border border-slate-100 rounded-lg shadow-inner">
            <div className="flex gap-2 items-center border-b border-emerald-500/20 pb-2 mb-2">
              <div className="h-7 w-7 rounded bg-slate-100 border border-slate-200" />
              <div className="space-y-1">
                <div className="h-2.5 w-12 bg-slate-900 rounded-sm" />
                <div className="h-1 w-8 bg-emerald-600 rounded-sm" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-1.5 w-10 bg-emerald-600/30 rounded-sm" />
              <div className="space-y-1">
                <div className="h-1 w-24 bg-slate-300 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case 'metro':
      case 'tokyo':
        return (
          <div className="w-full h-full bg-white p-3 flex flex-col border border-slate-100 rounded-lg shadow-inner">
            <div className="border border-slate-200 p-1.5 rounded mb-2">
              <div className="h-2 w-14 bg-slate-800 rounded-sm" />
              <div className="h-[3px] w-8 bg-slate-400 rounded-sm mt-1" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="border border-slate-100 p-1.5 rounded">
                <div className="h-1.5 w-12 bg-slate-700 rounded-sm mb-1" />
                <div className="h-[3px] w-20 bg-slate-300 rounded-sm" />
              </div>
            </div>
          </div>
        );
      case 'warm':
        return (
          <div className="w-full h-full bg-white flex border border-slate-100 rounded-lg shadow-inner overflow-hidden">
            <div className="w-1/3 bg-amber-50/50 p-2 flex flex-col gap-2 border-r border-amber-100">
              <div className="h-6 w-6 rounded-full bg-amber-100 mx-auto" />
              <div className="space-y-1">
                <div className="h-[3px] w-8 bg-amber-700/60 rounded-sm" />
                <div className="h-[3px] w-6 bg-slate-400 rounded-sm" />
              </div>
            </div>
            <div className="flex-1 p-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-2.5 w-16 bg-slate-900 rounded-sm" />
                <div className="h-1 w-10 bg-slate-400 rounded-sm" />
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-1.5 w-8 bg-amber-600/40 rounded-full" />
                <div className="space-y-1">
                  <div className="h-1 w-20 bg-slate-300/80 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'marketing':
        return (
          <div className="w-full h-full bg-white flex border border-slate-100 rounded-lg shadow-inner overflow-hidden">
            <div className="w-1/3 bg-[#febc04]/10 p-2 flex flex-col gap-2 border-r border-amber-200">
              <div className="h-6 w-6 rounded-lg bg-amber-300/30 mx-auto" />
              <div className="space-y-1">
                <div className="h-[3px] w-8 bg-amber-800 rounded-sm" />
                <div className="h-[3px] w-6 bg-slate-400 rounded-sm" />
              </div>
            </div>
            <div className="flex-1 p-2.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="h-2.5 w-16 bg-slate-900 rounded-sm" />
                <div className="h-1.5 w-8 bg-amber-500 rounded-sm" />
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-1 w-20 bg-slate-300 rounded-sm" />
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

      {/* Header Banner */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 bg-gradient-to-b from-white to-slate-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-800 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#febc04]" />
            <span>Premium ATS-Friendly Templates by Bot&amp;Guy</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#0c0c0c] sm:text-5xl max-w-3xl mx-auto">
            Choose Your Resume Template
          </h1>

          <p className="max-w-2xl text-base text-slate-600 mx-auto">
            Select a design and start crafting your job-winning resume in minutes. Absolutely free, optimized to bypass applicant tracking systems, and designed to recruiter standards.
          </p>

          {/* Filtering Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1 shadow-sm">
              <button
                onClick={() => setFilter('All')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === 'All'
                    ? 'bg-[#0c0c0c] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0c0c0c]'
                }`}
              >
                All Layouts
              </button>
              <button
                onClick={() => setFilter('Single-Column')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === 'Single-Column'
                    ? 'bg-[#0c0c0c] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0c0c0c]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5" />
                  Single Column
                </span>
              </button>
              <button
                onClick={() => setFilter('Two-Column')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === 'Two-Column'
                    ? 'bg-[#0c0c0c] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0c0c0c]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Columns className="w-3.5 h-3.5" />
                  Two Column
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid List of Templates */}
      <section className="py-12 bg-white flex-1 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Mockup Preview Area */}
                  <div className="w-full aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 p-4 mb-4 relative overflow-hidden flex items-center justify-center group-hover:bg-slate-100/50 transition-colors">
                    {renderMiniMockup(tpl.id)}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {tpl.tag}
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: tpl.color }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-[#0c0c0c] mb-2">{tpl.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{tpl.desc}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {/* Mini details list */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Sliders className="h-3 w-3" />
                      {tpl.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Type className="h-3 w-3" />
                      {tpl.font}
                    </span>
                  </div>

                  <Link
                    href={
                      user
                        ? `/dashboard?template=${tpl.id}`
                        : `/auth/login?redirect=${encodeURIComponent(`/dashboard?template=${tpl.id}`)}`
                    }
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between group-hover:border-[#0c0c0c] group-hover:bg-[#0c0c0c] group-hover:text-white transition-all font-bold"
                    >
                      <span>Use This Template</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-[#F9F9F9] border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <h2 className="text-2xl font-extrabold text-[#0c0c0c]">
            All Templates Built with Industry Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#0c0c0c]">100% ATS Optimized</h3>
              <p className="text-xs text-slate-500">Structured markup format allows scanners to read details perfectly.</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#0c0c0c]">Recruiter Approved</h3>
              <p className="text-xs text-slate-500">Layout typography hierarchy that recruiters love and scan easily.</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#0c0c0c]">Vector PDF Output</h3>
              <p className="text-xs text-slate-500">Perfectly scaled rendering with exact margins on export.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
