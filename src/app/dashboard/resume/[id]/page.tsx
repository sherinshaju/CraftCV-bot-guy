"use client";

import React, { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Download,
  Eye,
  Layout,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  CheckCircle,
  Info,
  X,
  Camera,
  Globe,
  Sliders,
  EyeOff,
  Columns,
  Type,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Check,
  Palette,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Paper Size Configurations
const PAPER_CONFIG: Record<
  string,
  {
    name: string;
    label: string;
    widthMm: number;
    heightMm: number;
    cssSize: string;
  }
> = {
  a4: {
    name: "A4",
    label: "A4 (210 × 297 mm)",
    widthMm: 210,
    heightMm: 297,
    cssSize: "A4",
  },
  letter: {
    name: "Letter",
    label: "US Letter (8.5 × 11 in)",
    widthMm: 215.9,
    heightMm: 279.4,
    cssSize: "letter",
  },
  legal: {
    name: "Legal",
    label: "Legal (8.5 × 14 in)",
    widthMm: 215.9,
    heightMm: 355.6,
    cssSize: "legal",
  },
};

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedIn: string;
  github: string;
  twitter: string;
  jobTitle: string;
  summary: string;
  photoUrl?: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship"
    | "Freelance";
  workMode: "On-site" | "Remote" | "Hybrid";
}

interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  gradDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  role: string;
  link: string;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

interface ResumeContent {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
}

type TemplateType =
  | "minimal"
  | "modern"
  | "executive"
  | "creative"
  | "academic"
  | "tech"
  | "elegant"
  | "simple"
  | "metro"
  | "warm"
  | "marketing";

interface Resume {
  id: string;
  title: string;
  template: TemplateType;
  content: ResumeContent;
}

const TEMPLATE_DEFS = [
  {
    id: "minimal",
    name: "Minimalist Classic",
    desc: "Standard serif, centered header. Traditional gold-standard layout. Single Column.",
    color: "#111111",
    font: "Georgia / Lora",
    type: "Single-Column",
  },
  {
    id: "modern",
    name: "Modern Slate",
    desc: "Deep slate accents, left sidebar for photo, contacts, and skills. Professional layout.",
    color: "#475569",
    font: "Inter",
    type: "Two-Column",
  },
  {
    id: "executive",
    name: "Executive Premium",
    desc: "Outfit typography, bold underlines, neat top-right photo. Suited for senior roles.",
    color: "#1E293B",
    font: "Outfit",
    type: "Single-Column",
  },
  {
    id: "creative",
    name: "Creative Teal",
    desc: "Teal sidebar, white text details, Lora headings. Stand out from others.",
    color: "#0D9488",
    font: "Lora + Inter",
    type: "Two-Column",
  },
  {
    id: "academic",
    name: "Academic Serif",
    desc: "Dense Merriweather structure. High content density, traditional margins. No photo.",
    color: "#1F2937",
    font: "Merriweather",
    type: "Single-Column",
  },
  {
    id: "tech",
    name: "Developer Tech",
    desc: "Dark slate sidebar, monospace tags for tech stacks, terminal-like history.",
    color: "#0F172A",
    font: "Fira Code + Inter",
    type: "Two-Column",
  },
  {
    id: "elegant",
    name: "Elegant Navy",
    desc: "Circular banner photo, Playfair Display titles, deep navy accents. Clean and premium.",
    color: "#1E3A8A",
    font: "Playfair + Inter",
    type: "Single-Column",
  },
  {
    id: "simple",
    name: "Simple Emerald",
    desc: "Left header photo, fresh emerald lines and dividers. Light and airy.",
    color: "#059669",
    font: "Open Sans",
    type: "Single-Column",
  },
  {
    id: "metro",
    name: "Metro Boxed",
    desc: "Modern boxed sections, high density Outfit font. No photo.",
    color: "#374151",
    font: "Outfit",
    type: "Single-Column",
  },
  {
    id: "warm",
    name: "Warm Ochre",
    desc: "Ochre details, rounded pills, contacts in sidebar, photo in main content.",
    color: "#D97706",
    font: "Lora + Outfit",
    type: "Two-Column",
  },
  {
    id: "marketing",
    name: "SEO & Digital Marketing",
    desc: "Vibrant Growth Indigo template. Features left/right balanced header, clean outlines, and highlighted conversion metrics.",
    color: "#6366F1",
    font: "Inter",
    type: "Single-Column",
  },
] as const;

const ACCENT_COLORS = [
  { name: "Charcoal", hex: "#1E293B" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Growth Indigo", hex: "#6366F1" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Emerald", hex: "#059669" },
  { name: "Amber", hex: "#D97706" },
  { name: "Violet", hex: "#7C3AED" },
  { name: "Crimson", hex: "#DC2626" },
];

const SUGGESTED_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "UI/UX Design",
  "Project Management",
  "Agile/Scrum",
  "Communication",
];

const THEME_PRESETS = [
  {
    id: "corp-navy",
    name: "Corporate Navy",
    color: "#1E3A8A",
    font: "Outfit",
    bg: "#FFFFFF",
    divider: "solid",
    thickness: "1px",
    photo: "rounded-full",
    spacing: 16,
    skills: "pills",
  },
  {
    id: "creative-teal",
    name: "Creative Teal",
    color: "#0D9488",
    font: "Lora",
    bg: "#FAFAF5",
    divider: "dashed",
    thickness: "1px",
    photo: "rounded-2xl",
    spacing: 20,
    skills: "outlined",
  },
  {
    id: "seo-marketing",
    name: "SEO & Growth Marketing",
    color: "#6366F1",
    font: "Inter",
    bg: "#F8FAFC",
    divider: "solid",
    thickness: "1px",
    photo: "rounded-2xl",
    spacing: 16,
    skills: "outlined",
  },
  {
    id: "minimal-charcoal",
    name: "Minimal Charcoal",
    color: "#1E293B",
    font: "Merriweather",
    bg: "#FFFFFF",
    divider: "solid",
    thickness: "0.5px",
    photo: "rounded-none",
    spacing: 14,
    skills: "classic",
  },
  {
    id: "warm-amber",
    name: "Warm Amber",
    color: "#D97706",
    font: "Outfit",
    bg: "#FDFBF7",
    divider: "dotted",
    thickness: "2px",
    photo: "rounded-2xl",
    spacing: 18,
    skills: "pills",
  },
] as const;

interface AuditTip {
  type: "success" | "warning" | "info";
  message: string;
}

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function ResumeBuilder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "info"
    | "experience"
    | "education"
    | "projects"
    | "skills"
    | "certs"
    | "design"
  >("design");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Canvas Custom Styling States
  const [accentColor, setAccentColor] = useState("#111111");
  const [fontFamily, setFontFamily] = useState<
    | "default"
    | "Inter"
    | "Lora"
    | "Outfit"
    | "Fira Code"
    | "Merriweather"
    | "Playfair Display"
    | "Open Sans"
    | "Arial"
  >("Arial");
  const [fontSize, setFontSize] = useState(12); // in px
  const [lineSpacing, setLineSpacing] = useState(1.4); // multiplier
  const [marginSize, setMarginSize] = useState(12); // in mm
  const [textAlignment, setTextAlignment] = useState<"left" | "justify">(
    "left",
  );

  // Paper Size & Colors
  const [paperSize, setPaperSize] = useState<"a4" | "letter" | "legal">("a4");
  const [paperBg, setPaperBg] = useState<
    "#FFFFFF" | "#FAFAF5" | "#FDFBF7" | "#F8FAFC"
  >("#FFFFFF");
  const activePaper = PAPER_CONFIG[paperSize] || PAPER_CONFIG.a4;

  // Divider & Border Customization
  const [dividerStyle, setDividerStyle] = useState<
    "solid" | "dashed" | "dotted" | "none"
  >("solid");
  const [dividerThickness, setDividerThickness] = useState<
    "0.5px" | "1px" | "2px"
  >("1px");

  // Advanced Borders & Background Layouts
  const [pageBorderStyle, setPageBorderStyle] = useState<
    "none" | "solid" | "double"
  >("none");
  const [pageBorderColor, setPageBorderColor] = useState("#1E293B");
  const [photoBorderThickness, setPhotoBorderThickness] = useState(0); // in px
  const [headingDividerWidth, setHeadingDividerWidth] = useState<
    "full" | "text"
  >("full");
  const [showGridPattern, setShowGridPattern] = useState(false);
  const [mobileMode, setMobileMode] = useState<"edit" | "preview">("edit");

  // Spacing & Skill Style
  const [sectionSpacing, setSectionSpacing] = useState(16); // in px
  const [skillsStyle, setSkillsStyle] = useState<
    "pills" | "outlined" | "classic"
  >("pills");

  // Rounding styles
  const [photoRadius, setPhotoRadius] = useState<
    "rounded-none" | "rounded-2xl" | "rounded-full"
  >("rounded-full");

  // Dynamic Section Layout & Ordering States
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "certs",
    "languages",
  ]);
  const [sectionVisibility, setSectionVisibility] = useState<
    Record<string, boolean>
  >({
    summary: true,
    experience: true,
    education: true,
    projects: true,
    skills: true,
    certs: true,
    languages: true,
  });
  const [sectionColumns, setSectionColumns] = useState<
    Record<string, "main" | "sidebar">
  >({
    summary: "main",
    experience: "main",
    education: "sidebar",
    projects: "main",
    skills: "sidebar",
    certs: "sidebar",
    languages: "sidebar",
  });

  // Advanced Visual Toggles
  const [showSectionIcons, setShowSectionIcons] = useState(false);

  // AI enhancement animation state
  const [enhancingField, setEnhancingField] = useState<string | null>(null);

  // AI Generator state variables
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Shuffling states for auto-selection template animation
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleId, setShuffleId] = useState<string | null>(null);

  const shuffleTemplates = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomTemp =
        TEMPLATE_DEFS[Math.floor(Math.random() * TEMPLATE_DEFS.length)];
      setShuffleId(randomTemp.id);
      count++;
      if (count > 12) {
        clearInterval(interval);
        const finalTemp =
          TEMPLATE_DEFS[Math.floor(Math.random() * TEMPLATE_DEFS.length)];
        handleTemplateChange(finalTemp.id);
        setShuffleId(null);
        setIsShuffling(false);
      }
    }, 100);
  };

  const [resume, setResume] = useState<Resume | null>(null);
  const [skillInput, setSkillInput] = useState("");

  // Fetch resume data
  useEffect(() => {
    if (!user || !id) return;
    const fetchResume = async () => {
      try {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        const normalized = normalizeResumeData(data);
        setResume(normalized);

        // Match default template color
        const temp = TEMPLATE_DEFS.find((t) => t.id === normalized.template);
        if (temp) {
          setAccentColor(temp.color);
          setPageBorderColor(temp.color);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        router.push("/dashboard/resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [user, id, router]);

  const isInitialLoad = useRef(true);

  // Autosave when resume content changes
  useEffect(() => {
    if (!resume || loading) return;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Set a debounce timer (1 minute / 60 seconds of inactivity)
    const timer = setTimeout(() => {
      const autoSave = async () => {
        setSaving(true);
        try {
          const { error } = await supabase
            .from("resumes")
            .update({
              title: resume.title,
              template: resume.template,
              content: resume.content,
              updated_at: new Date().toISOString(),
            })
            .eq("id", resume.id);

          if (error) throw error;

          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
          console.error("Autosave error:", err);
        } finally {
          setSaving(false);
        }
      };

      autoSave();
    }, 60000); // 1 minute (60,000ms) debounce

    return () => clearTimeout(timer);
  }, [resume, loading]);

  // Normalize fetched data with default fallbacks to avoid crashes
  const normalizeResumeData = (raw: any): Resume => {
    return {
      id: raw.id,
      title: raw.title || "My Resume",
      template: raw.template || "minimal",
      content: {
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          linkedIn: "",
          github: "",
          twitter: "",
          jobTitle: "",
          summary: "",
          photoUrl: "",
          ...raw.content?.personalInfo,
        },
        experience: Array.isArray(raw.content?.experience)
          ? raw.content.experience.map((exp: any) => ({
              employmentType: "Full-time",
              workMode: "On-site",
              ...exp,
            }))
          : [],
        education: Array.isArray(raw.content?.education)
          ? raw.content.education
          : [],
        projects: Array.isArray(raw.content?.projects)
          ? raw.content.projects
          : [],
        skills: Array.isArray(raw.content?.skills) ? raw.content.skills : [],
        certifications: Array.isArray(raw.content?.certifications)
          ? raw.content.certifications
          : [],
        languages: Array.isArray(raw.content?.languages)
          ? raw.content.languages
          : [],
      },
    };
  };

  const currentTemplate =
    TEMPLATE_DEFS.find((t) => t.id === (resume?.template || "minimal")) ||
    TEMPLATE_DEFS[0];

  const handleTemplateChange = (templateId: TemplateType) => {
    if (!resume) return;
    setResume({ ...resume, template: templateId });
    const target = TEMPLATE_DEFS.find((t) => t.id === templateId);
    if (target) {
      setAccentColor(target.color);
      setPageBorderColor(target.color);
    }

    // Apply smart column rendering configuration default depending on layout type
    if (
      templateId === "modern" ||
      templateId === "creative" ||
      templateId === "tech" ||
      templateId === "warm"
    ) {
      setSectionColumns({
        summary: "main",
        experience: "main",
        projects: "main",
        education: "sidebar",
        skills: "sidebar",
        certs: "sidebar",
        languages: "sidebar",
      });
    } else {
      setSectionColumns({
        summary: "main",
        experience: "main",
        projects: "main",
        education: "main",
        skills: "main",
        certs: "main",
        languages: "main",
      });
    }
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        personalInfo: {
          ...resume.content.personalInfo,
          [field]: value,
        },
      },
    });
  };

  const handleSave = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("resumes")
        .update({
          title: resume.title,
          template: resume.template,
          content: resume.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", resume.id);

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving resume:", err);
      alert("Failed to save resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Section drag/reorder controls
  const moveSectionInOrder = (index: number, direction: "up" | "down") => {
    const updated = [...sectionOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSectionOrder(updated);
  };

  const toggleSectionVisibility = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSectionColumn = (section: string) => {
    setSectionColumns((prev) => ({
      ...prev,
      [section]: prev[section] === "main" ? "sidebar" : "main",
    }));
  };

  // AI Phrase Enhancer using Gemini backend API
  const enhanceWithAI = async (
    field:
      | "summary"
      | { type: "experience"; index: number }
      | { type: "project"; index: number },
  ) => {
    if (!resume) return;
    let originalText = "";
    let fieldType: "summary" | "experience" | "project" = "summary";
    let isSummary = field === "summary";
    let expIndex = -1;
    let projIndex = -1;

    if (isSummary) {
      originalText = resume.content.personalInfo.summary;
      setEnhancingField("summary");
    } else if (typeof field === "object" && field.type === "experience") {
      fieldType = "experience";
      expIndex = field.index;
      originalText = resume.content.experience[expIndex]?.description || "";
      setEnhancingField(`experience-${expIndex}`);
    } else if (typeof field === "object" && field.type === "project") {
      fieldType = "project";
      projIndex = field.index;
      originalText = resume.content.projects[projIndex]?.description || "";
      setEnhancingField(`project-${projIndex}`);
    }

    if (!originalText.trim()) {
      alert("Please type some draft text first, and the AI will enhance it!");
      setEnhancingField(null);
      return;
    }

    try {
      const res = await fetch("/api/enhance-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, type: fieldType }),
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(
          data?.error || `Enhance request failed (${res.status}: ${res.statusText})`
        );
      }

      if (!data?.enhancedText) {
        throw new Error("No enhanced text received from AI service.");
      }

      const { enhancedText } = data;

      if (isSummary) {
        updatePersonalInfo("summary", enhancedText);
      } else if (fieldType === "experience") {
        updateExperience(expIndex, "description", enhancedText);
      } else if (fieldType === "project") {
        updateProject(projIndex, "description", enhancedText);
      }
    } catch (err: any) {
      console.error("AI Enhance error:", err);
      alert(
        err.message || "Error occurred while enhancing text. Please try again.",
      );
    } finally {
      setEnhancingField(null);
    }
  };

  // AI Resume Generator handler
  const handleAiGenerate = async () => {
    if (!resume) return;
    if (!aiPrompt.trim()) {
      alert("Please describe your career/profile details first!");
      return;
    }

    const confirmGenerate = window.confirm(
      "Using AI Builder will overwrite the current content in your resume editor. Do you want to proceed?",
    );
    if (!confirmGenerate) return;

    setIsAiGenerating(true);
    setAiStatusMessage("Connecting to Google Gemini...");

    // Dynamic progress status simulation while backend resolves
    const statusSteps = [
      "Analyzing your career profile...",
      "Synthesizing professional experience...",
      "Formatting bullet points & metrics...",
      "Mapping technical stack & skill tags...",
      "Structuring certifications & languages...",
      "Assembling final resume JSON structure...",
    ];
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < statusSteps.length) {
        setAiStatusMessage(statusSteps[stepIndex]);
        stepIndex++;
      }
    }, 2000);

    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      clearInterval(interval);

      const contentType = res.headers.get("content-type") || "";
      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(
          data?.error || `Generate resume failed (${res.status}: ${res.statusText})`
        );
      }

      if (!data?.content) {
        throw new Error("No resume content generated by AI service.");
      }

      const { content } = data;

      // Normalize content fields and generate IDs
      const normalizedContent: ResumeContent = {
        personalInfo: {
          fullName: content.personalInfo?.fullName || "",
          email: content.personalInfo?.email || "",
          phone: content.personalInfo?.phone || "",
          location: content.personalInfo?.location || "",
          website: content.personalInfo?.website || "",
          linkedIn: content.personalInfo?.linkedIn || "",
          github: content.personalInfo?.github || "",
          twitter: content.personalInfo?.twitter || "",
          jobTitle: content.personalInfo?.jobTitle || "",
          summary: content.personalInfo?.summary || "",
          photoUrl: resume.content.personalInfo.photoUrl || "", // Preserve uploaded photo!
        },
        experience: Array.isArray(content.experience)
          ? content.experience.map((exp: any) => ({
              id: exp.id || crypto.randomUUID(),
              company: exp.company || "",
              role: exp.role || "",
              location: exp.location || "",
              startDate: exp.startDate || "",
              endDate: exp.endDate || "",
              current: !!exp.current,
              description: exp.description || "",
              employmentType: exp.employmentType || "Full-time",
              workMode: exp.workMode || "On-site",
            }))
          : [],
        education: Array.isArray(content.education)
          ? content.education.map((edu: any) => ({
              id: edu.id || crypto.randomUUID(),
              school: edu.school || "",
              degree: edu.degree || "",
              location: edu.location || "",
              gradDate: edu.gradDate || "",
              gpa: edu.gpa || "",
            }))
          : [],
        projects: Array.isArray(content.projects)
          ? content.projects.map((proj: any) => ({
              id: proj.id || crypto.randomUUID(),
              name: proj.name || "",
              role: proj.role || "",
              link: proj.link || "",
              description: proj.description || "",
            }))
          : [],
        skills: Array.isArray(content.skills) ? content.skills : [],
        certifications: Array.isArray(content.certifications)
          ? content.certifications.map((cert: any) => ({
              id: cert.id || crypto.randomUUID(),
              name: cert.name || "",
              issuer: cert.issuer || "",
              date: cert.date || "",
            }))
          : [],
        languages: Array.isArray(content.languages)
          ? content.languages.map((lang: any) => ({
              id: lang.id || crypto.randomUUID(),
              name: lang.name || "",
              level: lang.level || "Professional",
            }))
          : [],
      };

      setResume({
        ...resume,
        content: normalizedContent,
      });

      // Switch active tab to info so they see it filled
      setActiveTab("info");

      // Clear prompt
      setAiPrompt("");
    } catch (err: any) {
      console.error("AI generate resume error:", err);
      alert(
        err.message ||
          "Error occurred while generating resume. Please try again.",
      );
    } finally {
      clearInterval(interval);
      setIsAiGenerating(false);
      setAiStatusMessage("");
    }
  };

  // Experience Handlers
  const addExperience = () => {
    if (!resume) return;
    const newItem: Experience = {
      id: crypto.randomUUID(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      employmentType: "Full-time",
      workMode: "On-site",
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: [...resume.content.experience, newItem],
      },
    });
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: any,
  ) => {
    if (!resume) return;
    const updated = [...resume.content.experience];
    updated[index] = { ...updated[index], [field]: value };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: updated,
      },
    });
  };

  const deleteExperience = (index: number) => {
    if (!resume) return;
    const updated = resume.content.experience.filter((_, i) => i !== index);
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: updated,
      },
    });
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    if (!resume) return;
    const items = [...resume.content.experience];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: items,
      },
    });
  };

  // Education Handlers
  const addEducation = () => {
    if (!resume) return;
    const newItem: Education = {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      location: "",
      gradDate: "",
      gpa: "",
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: [...resume.content.education, newItem],
      },
    });
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    if (!resume) return;
    const updated = [...resume.content.education];
    updated[index] = { ...updated[index], [field]: value };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: updated,
      },
    });
  };

  const deleteEducation = (index: number) => {
    if (!resume) return;
    const updated = resume.content.education.filter((_, i) => i !== index);
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: updated,
      },
    });
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    if (!resume) return;
    const items = [...resume.content.education];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: items,
      },
    });
  };

  // Projects Handlers
  const addProject = () => {
    if (!resume) return;
    const newItem: Project = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      link: "",
      description: "",
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        projects: [...resume.content.projects, newItem],
      },
    });
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string,
  ) => {
    if (!resume) return;
    const updated = [...resume.content.projects];
    updated[index] = { ...updated[index], [field]: value };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        projects: updated,
      },
    });
  };

  const deleteProject = (index: number) => {
    if (!resume) return;
    const updated = resume.content.projects.filter((_, i) => i !== index);
    setResume({
      ...resume,
      content: {
        ...resume.content,
        projects: updated,
      },
    });
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    if (!resume) return;
    const items = [...resume.content.projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        projects: items,
      },
    });
  };

  // Skills Handlers
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !skillInput.trim()) return;
    const clean = skillInput.trim();
    if (resume.content.skills.includes(clean)) {
      setSkillInput("");
      return;
    }
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: [...resume.content.skills, clean],
      },
    });
    setSkillInput("");
  };

  const clickAddSkill = (skill: string) => {
    if (!resume) return;
    if (resume.content.skills.includes(skill)) return;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: [...resume.content.skills, skill],
      },
    });
  };

  const deleteSkill = (skill: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: resume.content.skills.filter((s) => s !== skill),
      },
    });
  };

  // Certifications Handlers
  const addCertification = () => {
    if (!resume) return;
    const newItem: Certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        certifications: [...resume.content.certifications, newItem],
      },
    });
  };

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    if (!resume) return;
    const updated = [...resume.content.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        certifications: updated,
      },
    });
  };

  const deleteCertification = (index: number) => {
    if (!resume) return;
    const updated = resume.content.certifications.filter((_, i) => i !== index);
    setResume({
      ...resume,
      content: {
        ...resume.content,
        certifications: updated,
      },
    });
  };

  // Languages Handlers
  const addLanguage = () => {
    if (!resume) return;
    const newItem: Language = {
      id: crypto.randomUUID(),
      name: "",
      level: "Professional",
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        languages: [...resume.content.languages, newItem],
      },
    });
  };

  const updateLanguage = (
    index: number,
    field: keyof Language,
    value: string,
  ) => {
    if (!resume) return;
    const updated = [...resume.content.languages];
    updated[index] = { ...updated[index], [field]: value };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        languages: updated,
      },
    });
  };

  const deleteLanguage = (index: number) => {
    if (!resume) return;
    const updated = resume.content.languages.filter((_, i) => i !== index);
    setResume({
      ...resume,
      content: {
        ...resume.content,
        languages: updated,
      },
    });
  };

  // Export PDF Direct via jsPDF (Programmatic multi-page PDF download)
  const exportPdfDirect = async () => {
    const resumeElement = document.getElementById("resume-preview-container");
    if (!resumeElement || !resume) return;

    try {
      setIsExporting(true);
      // Auto-save progress to Supabase first
      const { error: saveErr } = await supabase
        .from("resumes")
        .update({
          title: resume.title,
          template: resume.template,
          content: resume.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", resume.id);

      if (saveErr) {
        console.error("Auto-save failed before PDF download:", saveErr);
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      const paper = PAPER_CONFIG[paperSize] || PAPER_CONFIG.a4;
      const fullHeightPx = resumeElement.scrollHeight;

      const canvas = await html2canvas(resumeElement, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: paperBg,
        logging: false,
        height: fullHeightPx,
        windowHeight: fullHeightPx,
        onclone: (clonedDoc) => {
          const styleTags = clonedDoc.querySelectorAll("style");
          styleTags.forEach((style) => {
            if (style.textContent && style.textContent.includes("oklch")) {
              style.textContent = style.textContent.replace(/oklch\([^)]+\)/gi, "rgba(0, 0, 0, 0)");
            }
          });
          const styledEls = clonedDoc.querySelectorAll("[style*='oklch']");
          styledEls.forEach((el) => {
            const attr = el.getAttribute("style");
            if (attr) {
              el.setAttribute("style", attr.replace(/oklch\([^)]+\)/gi, "transparent"));
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: paper.cssSize.toLowerCase() as any,
      });

      const pdfWidth = paper.widthMm;
      const pdfHeight = paper.heightMm;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgHeightMm = (canvasHeight * pdfWidth) / canvasWidth;

      let heightRemainingMm = imgHeightMm;
      let positionMm = 0;

      // Page 1
      pdf.addImage(imgData, "JPEG", 0, positionMm, pdfWidth, imgHeightMm);
      heightRemainingMm -= pdfHeight;

      // Multi-page loop
      while (heightRemainingMm > 3) {
        positionMm -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, positionMm, pdfWidth, imgHeightMm);
        heightRemainingMm -= pdfHeight;
      }

      pdf.save(`${resume.title.replace(/\s+/g, "_") || "Resume"}.pdf`);
    } catch (err) {
      console.error("Direct PDF export error, falling back to print:", err);
      exportPdfPrint();
    } finally {
      setIsExporting(false);
    }
  };

  // Export PDF Vector Print (Mount clone technique to unconstrain layout for multi-page printing)
  const exportPdfPrint = () => {
    const resumeElement = document.getElementById("resume-preview-container");
    if (!resumeElement || !resume) return;

    const paper = PAPER_CONFIG[paperSize] || PAPER_CONFIG.a4;

    // Create a standalone container on document body to avoid parent overflow clipping
    const printMount = document.createElement("div");
    printMount.id = "resume-print-mount";

    // Create repeating header space (thead) and footer space (tfoot) for page margins
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.border = "none";

    // Top margin space (repeats at the top of every printed page)
    const thead = document.createElement("thead");
    const theadRow = document.createElement("tr");
    const theadCell = document.createElement("td");
    const theadSpace = document.createElement("div");
    theadSpace.style.height = `${marginSize}mm`;
    theadSpace.style.width = "100%";
    theadCell.appendChild(theadSpace);
    theadRow.appendChild(theadCell);
    thead.appendChild(theadRow);
    table.appendChild(thead);

    // Actual Content Row
    const tbody = document.createElement("tbody");
    const tbodyRow = document.createElement("tr");
    const tbodyCell = document.createElement("td");

    const clone = resumeElement.cloneNode(true) as HTMLElement;
    const indicators = clone.querySelectorAll(".page-break-indicator");
    indicators.forEach((el) => el.remove());

    tbodyCell.appendChild(clone);
    tbodyRow.appendChild(tbodyCell);
    tbody.appendChild(tbodyRow);
    table.appendChild(tbody);

    // Bottom margin space (repeats at the bottom of every printed page)
    const tfoot = document.createElement("tfoot");
    const tfootRow = document.createElement("tr");
    const tfootCell = document.createElement("td");
    const tfootSpace = document.createElement("div");
    tfootSpace.style.height = `${marginSize}mm`;
    tfootSpace.style.width = "100%";
    tfootCell.appendChild(tfootSpace);
    tfootRow.appendChild(tfootCell);
    tfoot.appendChild(tfootRow);
    table.appendChild(tfoot);

    printMount.appendChild(table);
    document.body.appendChild(printMount);

    const style = document.createElement("style");
    style.id = "print-style-override";
    style.innerHTML = `
      @page {
        size: ${paper.cssSize} portrait;
        margin: 0 !important;
      }
      @media print {
        html, body {
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          background-color: ${paperBg} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body > *:not(#resume-print-mount) {
          display: none !important;
        }
        #resume-print-mount {
          display: block !important;
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: ${paperBg} !important;
        }
        #resume-print-mount table {
          width: 100% !important;
          height: auto !important;
          border-collapse: collapse !important;
          border: none !important;
          background-color: ${paperBg} !important;
        }
        #resume-print-mount thead, #resume-print-mount tfoot {
          background: transparent !important;
        }
        #resume-print-mount #resume-preview-container {
          position: static !important;
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          margin: 0 !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          padding-left: ${marginSize}mm !important;
          padding-right: ${marginSize}mm !important;
          box-shadow: none !important;
          border: ${pageBorderStyle !== "none" ? `${dividerThickness} ${pageBorderStyle} ${pageBorderColor}` : "none"} !important;
          background-color: ${paperBg} !important;
          background-image: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .break-inside-avoid, [style*="break-inside: avoid"], [style*="breakInside: avoid"] {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
          -webkit-column-break-inside: avoid !important;
        }
        .break-after-avoid, [style*="break-after: avoid"], [style*="breakAfter: avoid"] {
          break-after: avoid !important;
          page-break-after: avoid !important;
        }
        .print-hidden, .page-break-indicator {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    const originalTitle = document.title;
    document.title = resume.title || "Resume";

    window.print();

    document.title = originalTitle;
    setTimeout(() => {
      if (document.body.contains(printMount)) {
        document.body.removeChild(printMount);
      }
      const el = document.getElementById("print-style-override");
      if (el) {
        document.head.removeChild(el);
      }
    }, 1000);
  };

  // Export JPG (Download directly by appending anchor link to body)
  const exportJpg = async () => {
    const resumeElement = document.getElementById("resume-preview-container");
    if (!resumeElement || !resume) return;

    try {
      setIsExporting(true);
      // Auto-save progress to Supabase first
      const { error: saveErr } = await supabase
        .from("resumes")
        .update({
          title: resume.title,
          template: resume.template,
          content: resume.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", resume.id);

      if (saveErr) {
        console.error("Auto-save failed before JPG download:", saveErr);
      }

      // Wait for React to re-render without background guide lines/dots
      await new Promise((resolve) => setTimeout(resolve, 80));

      const canvas = await html2canvas(resumeElement, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: paperBg,
        logging: false,
        onclone: (clonedDoc) => {
          const styleTags = clonedDoc.querySelectorAll("style");
          styleTags.forEach((style) => {
            if (style.textContent && style.textContent.includes("oklch")) {
              style.textContent = style.textContent.replace(/oklch\([^)]+\)/gi, "rgba(0, 0, 0, 0)");
            }
          });
          const styledEls = clonedDoc.querySelectorAll("[style*='oklch']");
          styledEls.forEach((el) => {
            const attr = el.getAttribute("style");
            if (attr) {
              el.setAttribute("style", attr.replace(/oklch\([^)]+\)/gi, "transparent"));
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${resume.title.replace(/\s+/g, "_") || "Resume"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating JPG:", err);
      alert("Failed to generate JPG. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getFontFamilyCss = () => {
    if (fontFamily !== "default") {
      switch (fontFamily) {
        case "Inter":
          return "'Inter', sans-serif";
        case "Lora":
          return "'Lora', serif";
        case "Outfit":
          return "'Outfit', sans-serif";
        case "Fira Code":
          return "'Fira Code', monospace";
        case "Merriweather":
          return "'Merriweather', serif";
        case "Playfair Display":
          return "'Playfair Display', serif";
        case "Open Sans":
          return "'Open Sans', sans-serif";
        case "Arial":
          return "Arial, Helvetica, sans-serif";
      }
    }
    switch (resume?.template) {
      case "minimal":
        return "'Lora', Georgia, serif";
      case "academic":
        return "'Merriweather', serif";
      case "tech":
        return "'Inter', sans-serif";
      case "elegant":
        return "'Playfair Display', serif";
      case "creative":
        return "'Lora', serif";
      case "warm":
        return "'Outfit', sans-serif";
      case "metro":
        return "'Outfit', sans-serif";
      case "simple":
        return "'Open Sans', sans-serif";
      case "executive":
        return "'Outfit', sans-serif";
      case "marketing":
        return "'Inter', sans-serif";
      default:
        return "'Inter', sans-serif";
    }
  };

  const getHeadingStyle = (templateId: string) => {
    const borderCss =
      dividerStyle !== "none" && headingDividerWidth === "full"
        ? `${dividerThickness} ${dividerStyle} ${accentColor}33`
        : "none";
    const textBorderCss =
      dividerStyle !== "none" && headingDividerWidth === "text"
        ? `${dividerThickness} ${dividerStyle} ${accentColor}33`
        : "none";

    switch (templateId) {
      case "minimal":
        return {
          className:
            "text-[11px] font-black uppercase tracking-wider pb-0.5 mt-5",
          style: { color: accentColor, borderBottom: borderCss },
          textStyle: { borderBottom: textBorderCss },
        };
      case "modern":
        return {
          className:
            "text-[10px] font-bold uppercase tracking-wider bg-slate-100/60 px-3 py-1 rounded mt-4",
          style: { color: accentColor },
          textStyle: {},
        };
      case "executive":
        return {
          className:
            "text-[11px] font-black uppercase tracking-wider pb-1 mt-5",
          style: { color: accentColor, borderBottom: borderCss },
          textStyle: { borderBottom: textBorderCss },
        };
      case "creative":
        return {
          className:
            "text-[10px] font-bold uppercase tracking-widest pb-1 mt-4",
          style: { color: accentColor, borderBottom: borderCss },
          textStyle: { borderBottom: textBorderCss },
        };
      case "academic":
        return {
          className: "text-[11px] font-bold uppercase tracking-wider pb-1 mt-5",
          style: { color: accentColor, borderBottom: borderCss },
          textStyle: { borderBottom: textBorderCss },
        };
      case "tech":
        return {
          className:
            "text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mt-4 border-b pb-0.5",
          style: { borderColor: `${accentColor}1A` },
          textStyle: {},
        };
      case "elegant":
        return {
          className: "text-xs font-bold tracking-widest pb-1 uppercase mt-5",
          style: { color: accentColor, borderBottom: borderCss },
          textStyle: { borderBottom: textBorderCss },
        };
      case "simple":
        return {
          className: "text-xs font-black uppercase tracking-wider pb-0.5 mt-5",
          style: { color: accentColor, borderBottom: borderCss },
          textStyle: { borderBottom: textBorderCss },
        };
      case "metro":
        return {
          className:
            "text-[10px] font-black uppercase tracking-wider mt-4 border-b pb-0.5",
          style: { color: accentColor, borderColor: `${accentColor}1A` },
          textStyle: {},
        };
      case "warm":
        return {
          className:
            "text-[10px] font-bold uppercase tracking-widest pb-1 mt-4",
          style: { color: accentColor, borderBottom: borderCss },
          textStyle: { borderBottom: textBorderCss },
        };
      case "marketing":
        return {
          className:
            "text-[11px] font-black uppercase tracking-wider pb-0.5 mt-5 border-l-4 pl-2.5",
          style: { color: accentColor, borderColor: accentColor },
          textStyle: {},
        };
      default:
        return {
          className: "text-xs font-bold uppercase border-b pb-1 mt-4",
          style: { color: accentColor },
          textStyle: {},
        };
    }
  };

  const renderBullets = (text: string) => {
    if (!text) return null;
    return (
      <div className="mt-1.5 space-y-1 text-justify animate-in fade-in duration-200">
        {text.split("\n").map((line, idx) => {
          const cleanLine = line.replace(/^-\s*|^•\s*/, "").trim();
          if (!cleanLine) return null;
          return (
            <div
              key={idx}
              className="flex items-start gap-2 text-inherit leading-relaxed break-inside-avoid print:break-inside-avoid"
              style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              <span
                className="mt-1.5 select-none flex-shrink-0 text-[6px]"
                style={{ color: accentColor }}
              >
                ●
              </span>
              <span className="flex-1 text-inherit">{cleanLine}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSectionTitle = (title: string, icon: any, hStyle: any) => {
    return (
      <h2
        className={`${hStyle.className} break-after-avoid print:break-after-avoid`}
        style={{
          ...hStyle.style,
          breakAfter: "avoid",
          pageBreakAfter: "avoid",
        }}
      >
        <span
          style={hStyle.textStyle}
          className="inline-flex items-center gap-1.5"
        >
          {showSectionIcons && icon && (
            <span
              style={{ color: accentColor }}
              className="flex-shrink-0 flex items-center justify-center"
            >
              {React.createElement(icon, { className: "w-3 h-3" })}
            </span>
          )}
          {title}
        </span>
      </h2>
    );
  };

  // MODULAR SECTION RENDERERS
  const renderSummarySection = (templateId: string) => {
    if (!resume?.content.personalInfo.summary) return null;
    const hStyle = getHeadingStyle(templateId);
    return (
      <div
        key="summary"
        className="space-y-1.5 text-inherit break-inside-avoid print:break-inside-avoid resume-item-block"
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        {renderSectionTitle(
          templateId === "tech" ? "1. summary" : "Professional Summary",
          FileText,
          hStyle,
        )}
        <p className="text-neutral-700 leading-relaxed text-justify px-0.5 text-inherit">
          {resume.content.personalInfo.summary}
        </p>
      </div>
    );
  };

  const renderExperienceSection = (templateId: string) => {
    if (!resume || resume.content.experience.length === 0) return null;
    const hStyle = getHeadingStyle(templateId);
    return (
      <div key="experience" className="space-y-3 text-inherit">
        {renderSectionTitle(
          templateId === "tech" ? "2. experience" : "Work Experience",
          Briefcase,
          hStyle,
        )}
        <div className="space-y-4 px-0.5 text-inherit">
          {resume.content.experience.map((exp) => (
            <div
              key={exp.id}
              className="space-y-0.5 text-inherit break-inside-avoid print:break-inside-avoid resume-item-block"
              style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              <div className="flex justify-between items-start gap-4 font-bold text-inherit">
                <div className="text-inherit flex-1 min-w-0">
                  <span className="text-neutral-900 font-bold">
                    {exp.role || "Role"}
                  </span>
                  <span className="text-neutral-400 font-normal">
                    {" "}
                    {templateId === "tech" ? "@" : "at"}{" "}
                  </span>
                  <span className="text-neutral-700 font-semibold">
                    {exp.company || "Company"}
                    {(exp.employmentType || exp.workMode) && (
                      <span className="text-[10px] text-neutral-400 font-normal ml-1">
                        ({exp.employmentType || "Full-time"} •{" "}
                        {exp.workMode || "On-site"})
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-neutral-500 whitespace-nowrap text-[10px] font-medium font-mono shrink-0 mt-0.5">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">
                {exp.location}
              </p>
              {renderBullets(exp.description)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = (templateId: string) => {
    if (!resume || resume.content.education.length === 0) return null;
    const hStyle = getHeadingStyle(templateId);
    const isSidebar =
      sectionColumns.education === "sidebar" &&
      (templateId === "modern" ||
        templateId === "creative" ||
        templateId === "tech" ||
        templateId === "warm");
    return (
      <div key="education" className="space-y-2 text-inherit">
        {renderSectionTitle(
          templateId === "tech" ? "3. education" : "Education",
          GraduationCap,
          hStyle,
        )}
        <div className="space-y-3 px-0.5 text-inherit">
          {resume.content.education.map((edu) => (
            <div
              key={edu.id}
              className="space-y-0.5 text-inherit break-inside-avoid print:break-inside-avoid resume-item-block"
              style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              <div
                className={`flex ${isSidebar ? "flex-col" : "justify-between"} font-bold text-inherit`}
              >
                <span className="text-neutral-900 text-xs font-bold">
                  {edu.degree || "Degree"}
                </span>
                <span className="text-neutral-500 font-medium text-[10px]">
                  {edu.gradDate}
                </span>
              </div>
              <div
                className={`flex ${isSidebar ? "flex-col text-[10px]" : "justify-between"} text-neutral-600`}
              >
                <span>
                  {edu.school || "School"}{" "}
                  <span className="text-[9px] text-neutral-400 font-normal">
                    ({edu.location})
                  </span>
                </span>
                {edu.gpa && (
                  <span className="font-semibold text-neutral-500">
                    GPA: {edu.gpa}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = (templateId: string) => {
    if (!resume || resume.content.projects.length === 0) return null;
    const hStyle = getHeadingStyle(templateId);
    return (
      <div key="projects" className="space-y-3 text-inherit">
        {renderSectionTitle(
          templateId === "tech" ? "4. projects" : "Projects",
          Code,
          hStyle,
        )}
        <div className="space-y-3 px-0.5 text-inherit">
          {resume.content.projects.map((proj) => (
            <div
              key={proj.id}
              className="space-y-0.5 text-inherit break-inside-avoid print:break-inside-avoid resume-item-block"
              style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              <div className="flex justify-between items-start gap-4 font-bold text-inherit">
                <div className="text-inherit flex-1 min-w-0">
                  <span className="text-neutral-900 font-bold break-words">
                    {proj.name || "Project Name"}
                  </span>
                  {proj.role && (
                    <span className="text-neutral-500 font-semibold text-[9px] ml-2 px-1.5 py-0.5 bg-neutral-100/80 border border-black/5 rounded inline-block align-middle">
                      {proj.role}
                    </span>
                  )}
                </div>
                {proj.link && (
                  <span className="text-neutral-500 font-medium text-[9px] font-mono break-all text-right shrink-0 mt-0.5 max-w-[50%]">
                    {proj.link}
                  </span>
                )}
              </div>
              {renderBullets(proj.description)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsSection = (templateId: string) => {
    if (!resume || resume.content.skills.length === 0) return null;
    const hStyle = getHeadingStyle(templateId);
    const isSidebar =
      sectionColumns.skills === "sidebar" &&
      (templateId === "modern" ||
        templateId === "creative" ||
        templateId === "tech" ||
        templateId === "warm");

    return (
      <div
        key="skills"
        className="space-y-2 text-inherit break-inside-avoid print:break-inside-avoid resume-item-block"
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        {renderSectionTitle(
          templateId === "tech" ? "5. skills" : "Key Skills",
          Sparkles,
          hStyle,
        )}
        {skillsStyle === "classic" ? (
          <p className="text-neutral-700 leading-relaxed font-semibold text-inherit text-xs">
            {resume.content.skills.join("   •   ")}
          </p>
        ) : isSidebar ||
          skillsStyle === "pills" ||
          skillsStyle === "outlined" ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {resume.content.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-bold px-2.5 py-1 shadow-sm border transition-all"
                style={{
                  backgroundColor:
                    skillsStyle === "outlined" ? "transparent" : accentColor,
                  color: skillsStyle === "outlined" ? accentColor : "#FFFFFF",
                  borderColor: accentColor,
                  borderRadius:
                    photoRadius === "rounded-full"
                      ? "9999px"
                      : photoRadius === "rounded-2xl"
                        ? "6px"
                        : "0px",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-neutral-700 leading-relaxed font-semibold text-inherit text-xs">
            {resume.content.skills.join("   •   ")}
          </p>
        )}
      </div>
    );
  };

  const renderCertificationsSection = (templateId: string) => {
    if (!resume || resume.content.certifications.length === 0) return null;
    const hStyle = getHeadingStyle(templateId);
    return (
      <div key="certs" className="space-y-2 text-inherit">
        {renderSectionTitle(
          templateId === "tech" ? "6. credentials" : "Certifications",
          Award,
          hStyle,
        )}
        <div className="space-y-2 px-0.5 text-inherit">
          {resume.content.certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex justify-between items-start text-xs text-inherit break-inside-avoid print:break-inside-avoid resume-item-block"
              style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              <div className="text-inherit">
                <span className="font-bold text-neutral-900">{cert.name}</span>
                <p className="text-[10px] text-neutral-400 font-semibold">
                  {cert.issuer}
                </p>
              </div>
              <span className="text-neutral-400 font-mono text-[9px]">
                {cert.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguagesSection = (templateId: string) => {
    if (!resume || resume.content.languages.length === 0) return null;
    const hStyle = getHeadingStyle(templateId);
    const isSidebar =
      sectionColumns.languages === "sidebar" &&
      (templateId === "modern" ||
        templateId === "creative" ||
        templateId === "tech" ||
        templateId === "warm");
    return (
      <div
        key="languages"
        className="space-y-2 text-inherit break-inside-avoid print:break-inside-avoid resume-item-block"
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        {renderSectionTitle(
          templateId === "tech" ? "7. languages" : "Languages",
          Globe,
          hStyle,
        )}
        {isSidebar ? (
          <div className="space-y-1 text-neutral-600 text-[10px] text-inherit">
            {resume.content.languages.map((l) => (
              <p key={l.id} className="font-bold text-inherit">
                {l.name}{" "}
                <span className="text-neutral-400 font-normal">
                  ({l.level})
                </span>
              </p>
            ))}
          </div>
        ) : (
          <p className="text-neutral-600 text-xs font-semibold text-inherit">
            {resume.content.languages
              .map((l) => `${l.name} (${l.level})`)
              .join("   •   ")}
          </p>
        )}
      </div>
    );
  };

  const renderSectionNode = (sectionId: string, templateId: string) => {
    if (!sectionVisibility[sectionId]) return null;
    let node = null;
    switch (sectionId) {
      case "summary":
        node = renderSummarySection(templateId);
        break;
      case "experience":
        node = renderExperienceSection(templateId);
        break;
      case "education":
        node = renderEducationSection(templateId);
        break;
      case "projects":
        node = renderProjectsSection(templateId);
        break;
      case "skills":
        node = renderSkillsSection(templateId);
        break;
      case "certs":
        node = renderCertificationsSection(templateId);
        break;
      case "languages":
        node = renderLanguagesSection(templateId);
        break;
    }
    if (!node) return null;
    return (
      <div
        key={sectionId}
        className="break-inside-avoid print:break-inside-avoid"
        style={{
          marginBottom: `${sectionSpacing}px`,
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        {node}
      </div>
    );
  };

  // Social Links Component Helper
  const renderSocials = (templateId: string) => {
    if (!resume) return null;
    const list = [];
    if (resume.content.personalInfo.linkedIn) {
      list.push(
        <span key="li" className="flex items-center gap-1">
          <LinkedInIcon className="w-3 h-3 text-neutral-400" />
          {resume.content.personalInfo.linkedIn.replace(
            /https?:\/\/(www\.)?/,
            "",
          )}
        </span>,
      );
    }
    if (resume.content.personalInfo.github) {
      list.push(
        <span key="gh" className="flex items-center gap-1">
          <GitHubIcon className="w-3 h-3 text-neutral-400" />
          {resume.content.personalInfo.github.replace(
            /https?:\/\/(www\.)?/,
            "",
          )}
        </span>,
      );
    }
    if (resume.content.personalInfo.twitter) {
      list.push(
        <span key="tw" className="flex items-center gap-1">
          <TwitterIcon className="w-3 h-3 text-neutral-400" />
          {resume.content.personalInfo.twitter.replace(
            /https?:\/\/(www\.)?/,
            "",
          )}
        </span>,
      );
    }

    if (list.length === 0) return null;

    if (
      templateId === "minimal" ||
      templateId === "academic" ||
      templateId === "elegant"
    ) {
      return (
        <div className="flex flex-wrap justify-center gap-3 mt-1.5 text-neutral-500 font-medium text-xs">
          {list}
        </div>
      );
    }

    return (
      <div className="space-y-1 mt-1 text-[11px] text-neutral-500">{list}</div>
    );
  };

  const getCleanPhotoUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("data:")) return url;
    return `${url}${url.includes("?") ? "&" : "?"}cb=${Date.now()}`;
  };

  // Live ATS Check Audit
  const calculateAtsScore = () => {
    if (!resume) return { score: 0, tips: [] as AuditTip[] };
    let score = 0;
    const tips: AuditTip[] = [];
    const info = resume.content.personalInfo;

    // 1. Contacts Complete (Max 25)
    let contactPts = 0;
    if (info.email) contactPts += 5;
    if (info.phone) contactPts += 5;
    if (info.linkedIn) contactPts += 5;
    if (info.github) contactPts += 5;
    if (info.location) contactPts += 5;
    score += contactPts;

    if (contactPts < 25) {
      tips.push({
        type: "warning",
        message:
          "Add missing contacts (LinkedIn, GitHub) to increase accessibility.",
      });
    } else {
      tips.push({
        type: "success",
        message: "Comprehensive contact info listed.",
      });
    }

    // 2. Photo Warning
    if (info.photoUrl) {
      tips.push({
        type: "info",
        message:
          "Photo included. Note: Some US/UK ATS prefer resumes without photos.",
      });
    }

    // 3. Summary (Max 15)
    if (info.summary) {
      const words = info.summary.split(/\s+/).filter(Boolean).length;
      if (words >= 30 && words <= 100) {
        score += 15;
        tips.push({
          type: "success",
          message: "Summary length is optimized (30-100 words).",
        });
      } else if (words < 30) {
        score += 8;
        tips.push({
          type: "warning",
          message: "Summary is short. Elaborate on core competencies.",
        });
      } else {
        score += 10;
        tips.push({
          type: "warning",
          message: "Summary exceeds 100 words. Keep it concise.",
        });
      }
    } else {
      tips.push({
        type: "warning",
        message: "Add a summary to frame your experience.",
      });
    }

    // 4. Experience Bullets (Max 25)
    const exp = resume.content.experience;
    if (exp.length > 0) {
      let bullets = 0;
      exp.forEach((e) => {
        bullets += e.description.split("\n").filter((b) => b.trim()).length;
      });
      const avg = bullets / exp.length;
      if (avg >= 3) {
        score += 25;
        tips.push({
          type: "success",
          message: "Excellent description details (avg 3+ bullets per role).",
        });
      } else {
        score += 15;
        tips.push({
          type: "warning",
          message: "Expand descriptions with more bullets.",
        });
      }
    } else {
      tips.push({ type: "warning", message: "Include job experience items." });
    }

    // 5. Skills Density (Max 20)
    const skills = resume.content.skills;
    if (skills.length >= 6) {
      score += 20;
      tips.push({
        type: "success",
        message: "Great skills volume for ATS indexing.",
      });
    } else if (skills.length > 0) {
      score += 10;
      tips.push({
        type: "warning",
        message: "Add at least 6 key skills for better parsing.",
      });
    } else {
      tips.push({ type: "warning", message: "Include core industry skills." });
    }

    // 6. Credentials / Projects (Max 15)
    let extra = 0;
    if (resume.content.projects.length > 0) extra += 8;
    if (resume.content.certifications.length > 0) extra += 7;
    score += extra;

    if (resume.content.projects.length === 0)
      tips.push({
        type: "info",
        message: "Add projects to showcase practical skills.",
      });
    if (resume.content.certifications.length === 0)
      tips.push({
        type: "info",
        message: "Add certifications for credentials.",
      });

    return { score, tips };
  };

  // Fit to Single Page
  const fitToSinglePage = () => {
    setFontSize(11);
    setLineSpacing(1.3);
    setMarginSize(10);
    setSectionSpacing(12);
  };

  // Theme Preset Applicator
  const applyThemePreset = (presetId: string) => {
    const p = THEME_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setAccentColor(p.color);
    setPageBorderColor(p.color);
    setFontFamily(p.font as any);
    setPaperBg(p.bg as any);
    setDividerStyle(p.divider as any);
    setDividerThickness(p.thickness as any);
    setPhotoRadius(p.photo as any);
    setSectionSpacing(p.spacing);
    setSkillsStyle(p.skills as any);
  };

  const { score: atsScore, tips: atsTips } = calculateAtsScore();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-10 h-10 text-[#febc04] animate-spin" />
        <p className="text-neutral-500 text-sm">Loading Resume...</p>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="space-y-6 mx-auto h-[calc(100vh-8rem)] flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-black/5 p-4 rounded-xl shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push("/dashboard/resume")}
            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-all"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            className="font-extrabold text-[#0C0C0C] text-base bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-[#febc04] focus:outline-none px-1 py-0.5 transition-all w-full sm:w-64"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
          {/* Autosave Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-neutral-400 text-[10px] font-bold mr-2 select-none">
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#febc04] animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600">Saved to cloud</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-neutral-300" />
                <span>Autosaved</span>
              </>
            )}
          </div>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Layout className="w-4 h-4 text-[#febc04]" />
            <span className="hidden sm:inline">Change Template:</span>{" "}
            <span className="text-neutral-900 capitalize font-extrabold">
              {currentTemplate.name}
            </span>
          </button>

          {/* Action Buttons */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#0C0C0C] text-white hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save
          </button>

          <button
            onClick={exportPdfDirect}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-[#febc04] text-[#261900] px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md transition-all disabled:opacity-50"
            title="Download Multi-Page PDF Document"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}{" "}
            PDF Download
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 flex-shrink-0 animate-in fade-in slide-in-from-top-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Resume saved successfully to cloud!
        </div>
      )}

      {/* AI Resume Builder Panel (Premium Glassmorphism Card) - Hidden as requested */}
      {/*
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-xl flex-shrink-0 relative overflow-hidden animate-in fade-in duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="flex flex-col md:flex-row gap-5 items-start relative z-10">
          <div className="flex items-start gap-3 md:w-1/3">
            <div className="p-3 bg-indigo-500/15 rounded-xl border border-indigo-400/20 text-indigo-400 shadow-inner flex-shrink-0 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-sm text-white tracking-wider uppercase">
                  AI Quick Builder
                </h2>
                <span className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-widest font-mono">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-semibold">
                Describe your profile, roles, and education. AI will
                automatically construct your summary, roles, projects, and
                skills.
              </p>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="relative">
              <textarea
                rows={2}
                disabled={isAiGenerating}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your background (e.g. 'I am a Frontend Dev with 4 years experience in React and Node.js at TechCorp. I graduated from NIT with 8.5 GPA, and have skills in Next.js, Redux, Docker. I built a real-time chat app.')"
                className="w-full bg-black/35 border border-neutral-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all resize-none shadow-inner"
              />
              {isAiGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-xs font-bold text-white tracking-wide animate-pulse">
                      {aiStatusMessage}
                    </span>
                  </div>
                  <div className="w-48 bg-neutral-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full animate-progress"
                      style={{ width: "40%" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {!isAiGenerating && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-neutral-400 mr-1 font-bold">
                  Suggestions:
                </span>
                {[
                  {
                    label: "React Developer",
                    text: "React Frontend Engineer with 4 years experience, specialized in Next.js, TypeScript, and state management. Graduated from IIT Bombay in Computer Science. Built a collaborative workspace app.",
                  },
                  {
                    label: "Data Analyst",
                    text: "Data Analyst with 3 years experience. Skilled in SQL, Python, Tableau, and pandas. Experience in cleaning large datasets, optimizing queries, and building business dashboards.",
                  },
                  {
                    label: "Product Manager",
                    text: "Product Manager with 5 years experience in SaaS. Managed product lifecycle from ideation to launch. Skilled in Scrum/Agile and SQL. Graduated with MBA from IIM.",
                  },
                ].map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAiPrompt(pill.text)}
                    className="bg-neutral-800/40 hover:bg-neutral-700/40 border border-neutral-700/50 hover:border-neutral-600 text-neutral-300 hover:text-white text-[10px] px-2.5 py-1 rounded-lg transition-all"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" /> Overwrites
                editor data on generate
              </span>
              <div className="flex items-center gap-2">
                {aiPrompt && (
                  <button
                    type="button"
                    onClick={() => setAiPrompt("")}
                    className="text-neutral-400 hover:text-white text-xs font-semibold px-2 py-1 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating || !aiPrompt.trim()}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:pointer-events-none hover:scale-102 cursor-pointer"
                >
                  {isAiGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Generate Complete Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Mobile & Tablet Mode Switcher Toggle */}
      <div className="flex lg:hidden items-center border border-slate-200 bg-slate-100 p-1 rounded-2xl mb-2 flex-shrink-0 w-full shadow-sm">
        <button
          type="button"
          onClick={() => setMobileMode("edit")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            mobileMode === "edit"
              ? "bg-[#0C0C0C] text-white shadow-md"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Edit Fields
        </button>
        <button
          type="button"
          onClick={() => setMobileMode("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            mobileMode === "preview"
              ? "bg-[#0C0C0C] text-white shadow-md"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-hidden">
        {/* Left Panel: Inputs Form */}
        <div className={`bg-white border border-black/5 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm ${mobileMode === "preview" ? "hidden lg:flex" : "flex"}`}>
          {/* Tabs header - DESIGN IS FIRST! */}
          <div className="flex items-center border-b border-black/5 px-2 flex-shrink-0 relative">
            <button
              onClick={() => scrollTabs("left")}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors flex-shrink-0"
              type="button"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={tabsRef}
              className="flex-1 flex overflow-x-auto gap-1 scrollbar-none py-2 scroll-smooth"
            >
              {[
                { id: "design", label: "Design", icon: Sliders },
                { id: "info", label: "Info", icon: FileText },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "education", label: "Education & Projects", icon: GraduationCap },
                { id: "skills", label: "Skills & Certs", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-[#0C0C0C]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollTabs("right")}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors flex-shrink-0"
              type="button"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tab content area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Design Tab */}
            {activeTab === "design" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Real-time ATS Optimizer Score Card */}
                <div className="bg-[#febc04]/5 border border-[#febc04]/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#febc04] animate-pulse" />
                      <span className="font-extrabold text-xs text-neutral-800 uppercase tracking-wider">
                        ATS Optimisation Score
                      </span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-black text-[#febc04]">
                        {atsScore}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold">
                        /100
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-200/60 rounded-full h-2">
                    <div
                      className="bg-[#febc04] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>

                  {/* Checklist summary dropdown */}
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-[11px] font-medium leading-relaxed text-neutral-600">
                    {atsTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-1.5 py-0.5"
                      >
                        {tip.type === "success" && (
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        {tip.type === "warning" && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                        {tip.type === "info" && (
                          <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{tip.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1. Coordinated Theme Presets */}
                <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-black/5">
                  <h3 className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider pb-2 border-b border-black/5">
                    <Palette className="w-3.5 h-3.5 text-[#febc04]" /> Color &
                    Preset Themes
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyThemePreset(preset.id)}
                        className="bg-white hover:bg-neutral-50 border border-black/5 rounded-xl p-3 flex flex-col gap-2 items-start transition-all shadow-sm group hover:border-[#febc04]/30"
                      >
                        <span className="text-[11px] font-extrabold text-neutral-800 group-hover:text-neutral-900">
                          {preset.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                            style={{ backgroundColor: preset.color }}
                          />
                          <span className="text-[9px] text-neutral-400 uppercase font-mono">
                            {preset.font}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. fit-to-Page Optimizer */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-black/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-neutral-800">
                      Fit to Single Page
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Automatically adjust spacing and sizes to fit page height.
                    </p>
                  </div>
                  <button
                    onClick={fitToSinglePage}
                    className="flex items-center gap-1 text-[11px] font-bold bg-[#febc04]/15 hover:bg-[#febc04]/25 text-[#261900] px-3.5 py-2 rounded-xl border border-[#febc04]/30 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#febc04]" /> Auto Fit
                  </button>
                </div>

                {/* 3. Layout Inspector (Layers) */}
                <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-black/5">
                  <div className="flex justify-between items-center pb-2 border-b border-black/5">
                    <h3 className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <Layout className="w-3.5 h-3.5 text-[#febc04]" /> Layout &
                      Layers
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Hierarchy Inspector
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sectionOrder.map((section, index) => {
                      const isVisible = sectionVisibility[section];
                      const currentColumn = sectionColumns[section] || "main";
                      const isTwoCol = currentTemplate.type === "Two-Column";

                      return (
                        <div
                          key={section}
                          className={`flex items-center justify-between bg-white border p-2.5 rounded-xl transition-all ${
                            isVisible
                              ? "border-black/5 hover:border-neutral-300"
                              : "border-dashed border-neutral-200 opacity-55"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveSectionInOrder(index, "up")}
                                className="text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={index === sectionOrder.length - 1}
                                onClick={() =>
                                  moveSectionInOrder(index, "down")
                                }
                                className="text-neutral-400 hover:text-neutral-900 disabled:opacity-20"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-neutral-800 capitalize">
                              {section === "certs" ? "Certifications" : section}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isTwoCol && (
                              <button
                                type="button"
                                onClick={() => toggleSectionColumn(section)}
                                className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                  currentColumn === "main"
                                    ? "bg-neutral-100 border-neutral-200 text-neutral-600"
                                    : "bg-amber-50 border-amber-200 text-amber-700"
                                }`}
                              >
                                <Columns className="w-3 h-3" />
                                {currentColumn === "main" ? "Main" : "Sidebar"}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleSectionVisibility(section)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isVisible
                                  ? "bg-[#febc04]/10 border-[#febc04]/20 text-neutral-800"
                                  : "bg-neutral-50 border-neutral-200 text-neutral-400"
                              }`}
                            >
                              {isVisible ? (
                                <Eye className="w-3.5 h-3.5" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Global Canvas Customization */}
                <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-black/5">
                  <h3 className="text-xs font-black text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider pb-2 border-b border-black/5">
                    <Paintbrush className="w-3.5 h-3.5 text-[#febc04]" /> Canvas
                    Properties
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Font Family */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Global Font Family
                      </label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value as any)}
                        className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                      >
                        <option value="default">Template Default</option>
                        <option value="Inter">Inter (Sans-Serif)</option>
                        <option value="Outfit">Outfit (Geometric Sans)</option>
                        <option value="Open Sans">
                          Open Sans (Clean Sans)
                        </option>
                        <option value="Lora">Lora (Elegant Serif)</option>
                        <option value="Merriweather">
                          Merriweather (Readability Serif)
                        </option>
                        <option value="Playfair Display">
                          Playfair Display (Premium Serif)
                        </option>
                        <option value="Fira Code">
                          Fira Code (Developer Monospace)
                        </option>
                      </select>
                    </div>

                    {/* Paper background */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Paper Canvas Fill
                      </label>
                      <div className="flex gap-2 py-1">
                        {[
                          { hex: "#FFFFFF", name: "Crisp White" },
                          { hex: "#FAFAF5", name: "Ivory Cream" },
                          { hex: "#FDFBF7", name: "Warm Sand" },
                          { hex: "#F8FAFC", name: "Cool Ice" },
                        ].map((fill) => (
                          <button
                            key={fill.hex}
                            onClick={() => setPaperBg(fill.hex as any)}
                            className={`w-6 h-6 rounded-lg border border-black/10 transition-all ${
                              paperBg === fill.hex
                                ? "scale-110 ring-2 ring-[#febc04]/30"
                                : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: fill.hex }}
                            title={fill.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Paper Size / Format */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Paper Size / Format
                      </label>
                      <select
                        value={paperSize}
                        onChange={(e) => setPaperSize(e.target.value as any)}
                        className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all font-semibold"
                      >
                        <option value="a4">
                          A4 Standard (210 × 297 mm) [Default]
                        </option>
                        <option value="letter">
                          US Letter (215.9 × 279.4 mm)
                        </option>
                        <option value="legal">Legal (215.9 × 355.6 mm)</option>
                      </select>
                    </div>

                    {/* Divider style */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Section Divider Line
                      </label>
                      <select
                        value={dividerStyle}
                        onChange={(e) => setDividerStyle(e.target.value as any)}
                        className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                      >
                        <option value="solid">Solid Line</option>
                        <option value="dashed">Dashed Line</option>
                        <option value="dotted">Dotted Line</option>
                        <option value="none">No Divider Lines</option>
                      </select>
                    </div>

                    {/* Divider Thickness */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Line Weight
                      </label>
                      <select
                        value={dividerThickness}
                        onChange={(e) =>
                          setDividerThickness(e.target.value as any)
                        }
                        className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                      >
                        <option value="0.5px">0.5px (Hairline)</option>
                        <option value="1px">1px (Default)</option>
                        <option value="2px">2px (Thick)</option>
                      </select>
                    </div>

                    {/* Heading Divider Width toggle */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Heading Divider Width
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: "full", label: "Full Width" },
                          { id: "text", label: "Under Text Only" },
                        ].map((wMode) => (
                          <button
                            key={wMode.id}
                            type="button"
                            onClick={() =>
                              setHeadingDividerWidth(wMode.id as any)
                            }
                            className={`flex-1 text-[10px] font-bold py-2 rounded-xl border transition-all ${
                              headingDividerWidth === wMode.id
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                                : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                            }`}
                          >
                            {wMode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Faint Grid Toggle */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Canvas Grid Layout
                      </label>
                      <div className="flex gap-2">
                        {[
                          { val: false, label: "Off" },
                          { val: true, label: "On (Faint Dots)" },
                        ].map((gridOpt) => (
                          <button
                            key={gridOpt.label}
                            type="button"
                            onClick={() => setShowGridPattern(gridOpt.val)}
                            className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${
                              showGridPattern === gridOpt.val
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                                : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                            }`}
                          >
                            {gridOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Alignment */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Paragraph Alignment
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: "left", label: "Left Align" },
                          { id: "justify", label: "Justified Alignment" },
                        ].map((align) => (
                          <button
                            key={align.id}
                            type="button"
                            onClick={() => setTextAlignment(align.id as any)}
                            className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${
                              textAlignment === align.id
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                                : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                            }`}
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photo Rounding */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Corner Rounding (Radius)
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: "rounded-none", label: "Square" },
                          { id: "rounded-2xl", label: "Rounded" },
                          { id: "rounded-full", label: "Circle" },
                        ].map((radius) => (
                          <button
                            key={radius.id}
                            type="button"
                            onClick={() => setPhotoRadius(radius.id as any)}
                            className={`flex-1 text-[10px] font-bold py-2 rounded-xl border transition-all ${
                              photoRadius === radius.id
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                                : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                            }`}
                          >
                            {radius.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photo Border outline thickness */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Photo Border Outline
                      </label>
                      <select
                        value={photoBorderThickness}
                        onChange={(e) =>
                          setPhotoBorderThickness(Number(e.target.value))
                        }
                        className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                      >
                        <option value={0}>No Border</option>
                        <option value={1}>1px (Thin)</option>
                        <option value={2}>2px (Medium)</option>
                        <option value={4}>4px (Thick)</option>
                      </select>
                    </div>

                    {/* Page Border Style */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        A4 Page Border Frame
                      </label>
                      <select
                        value={pageBorderStyle}
                        onChange={(e) =>
                          setPageBorderStyle(e.target.value as any)
                        }
                        className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                      >
                        <option value="none">No Border Frame</option>
                        <option value="solid">Solid Frame Line</option>
                        <option value="double">Double Frame Line</option>
                      </select>
                    </div>

                    {/* Section Spacing (Vertical Gaps) Slider */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase flex justify-between">
                        <span>Section Spacing (Gap)</span>
                        <span className="font-extrabold text-neutral-800">
                          {sectionSpacing}px
                        </span>
                      </label>
                      <input
                        type="range"
                        min={8}
                        max={24}
                        step={1}
                        value={sectionSpacing}
                        onChange={(e) =>
                          setSectionSpacing(Number(e.target.value))
                        }
                        className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#febc04] mt-2"
                      />
                    </div>

                    {/* Skills Layout Style */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Skills Style
                      </label>
                      <select
                        value={skillsStyle}
                        onChange={(e) => setSkillsStyle(e.target.value as any)}
                        className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                      >
                        <option value="pills">Solid Pills (Filled)</option>
                        <option value="outlined">Outlined Badges</option>
                        <option value="classic">
                          Classic List (Dot Separators)
                        </option>
                      </select>
                    </div>

                    {/* Header Icons Toggle */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Header Icons
                      </label>
                      <div className="flex gap-2">
                        {[
                          { val: false, label: "Off" },
                          { val: true, label: "On (Aligned)" },
                        ].map((iconOpt) => (
                          <button
                            key={iconOpt.label}
                            type="button"
                            onClick={() => setShowSectionIcons(iconOpt.val)}
                            className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${
                              showSectionIcons === iconOpt.val
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                                : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                            }`}
                          >
                            {iconOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Tab */}
            {activeTab === "info" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-2 border-b border-black/5 pb-2">
                  <FileText className="w-4 h-4 text-[#febc04]" /> Personal
                  Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2 bg-neutral-50 p-4 rounded-xl border border-black/5">
                    <label className="text-xs font-bold text-neutral-600 block">
                      Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                      {resume.content.personalInfo.photoUrl ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-black/10 flex-shrink-0">
                          <img
                            src={getCleanPhotoUrl(
                              resume.content.personalInfo.photoUrl,
                            )}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => updatePersonalInfo("photoUrl", "")}
                            className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 flex-shrink-0">
                          <Camera className="w-5 h-5 text-neutral-300" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <input
                          type="file"
                          accept="image/*"
                          id="profile-photo-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updatePersonalInfo(
                                  "photoUrl",
                                  reader.result as string,
                                );
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="profile-photo-upload"
                          className="inline-block bg-white border border-black/10 hover:bg-neutral-50 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                        >
                          Upload Photo
                        </label>
                        <p className="text-[10px] text-neutral-400">
                          PNG or JPG. Stored securely inside the resume.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={resume.content.personalInfo.fullName}
                      onChange={(e) =>
                        updatePersonalInfo("fullName", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      Job Title
                    </label>
                    <input
                      type="text"
                      placeholder="Software Engineer"
                      value={resume.content.personalInfo.jobTitle}
                      onChange={(e) =>
                        updatePersonalInfo("jobTitle", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={resume.content.personalInfo.email}
                      onChange={(e) =>
                        updatePersonalInfo("email", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      value={resume.content.personalInfo.phone}
                      onChange={(e) =>
                        updatePersonalInfo("phone", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Mumbai, India"
                      value={resume.content.personalInfo.location}
                      onChange={(e) =>
                        updatePersonalInfo("location", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      Website / Portfolio
                    </label>
                    <input
                      type="text"
                      placeholder="johndoe.dev"
                      value={resume.content.personalInfo.website}
                      onChange={(e) =>
                        updatePersonalInfo("website", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      LinkedIn handle
                    </label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/johndoe"
                      value={resume.content.personalInfo.linkedIn}
                      onChange={(e) =>
                        updatePersonalInfo("linkedIn", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      GitHub handle
                    </label>
                    <input
                      type="text"
                      placeholder="github.com/johndoe"
                      value={resume.content.personalInfo.github || ""}
                      onChange={(e) =>
                        updatePersonalInfo("github", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-neutral-600">
                      Twitter / X handle
                    </label>
                    <input
                      type="text"
                      placeholder="x.com/johndoe"
                      value={resume.content.personalInfo.twitter || ""}
                      onChange={(e) =>
                        updatePersonalInfo("twitter", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-neutral-600">
                        Professional Summary
                      </label>
                      <button
                        type="button"
                        onClick={() => enhanceWithAI("summary")}
                        disabled={enhancingField === "summary"}
                        className="flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-lg disabled:opacity-50"
                      >
                        {enhancingField === "summary" ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />{" "}
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" /> AI Enhance
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Results-driven Software Engineer with 5+ years of experience specializing in React, Next.js, and cloud architecture. Proven track record of optimizing page load speed by 40% and leading agile developer teams to deliver high-quality SaaS applications."
                      value={resume.content.personalInfo.summary}
                      onChange={(e) =>
                        updatePersonalInfo("summary", e.target.value)
                      }
                      className="w-full bg-neutral-50 border border-black/5 rounded-xl px-4 py-2.5 text-sm text-[#0C0C0C] outline-none focus:border-[#febc04] resize-none transition-all"
                    />
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5 leading-relaxed">
                      Tip: Write a compelling 3-4 sentence overview of your
                      career, core strengths, tech stack, and key achievements.
                      Keep it professional and aligned with your target roles.
                    </p>
                  </div>
                </div>

                {/* Languages Section */}
                <div className="space-y-4 border-t border-black/5 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#febc04]" /> Languages
                    </h3>
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="flex items-center gap-1 text-[11px] font-bold bg-[#febc04]/15 hover:bg-[#febc04]/25 text-[#261900] px-3 py-1.5 rounded-lg border border-[#febc04]/30"
                    >
                      <Plus className="w-3 h-3" /> Add Language
                    </button>
                  </div>

                  {resume.content.languages.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-2">
                      No languages added yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {resume.content.languages.map((lang, index) => (
                        <div
                          key={lang.id}
                          className="flex gap-3 items-center bg-neutral-50 border border-black/5 p-3 rounded-xl relative group"
                        >
                          <input
                            type="text"
                            placeholder="English"
                            value={lang.name}
                            onChange={(e) =>
                              updateLanguage(index, "name", e.target.value)
                            }
                            className="flex-1 bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                          />
                          <select
                            value={lang.level}
                            onChange={(e) =>
                              updateLanguage(index, "level", e.target.value)
                            }
                            className="bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Conversational">
                              Conversational
                            </option>
                            <option value="Basic">Basic</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteLanguage(index)}
                            className="text-neutral-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-black/5 pb-2">
                  <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#febc04]" /> Work
                    Experience
                  </h3>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 text-[11px] font-bold bg-[#febc04]/15 hover:bg-[#febc04]/25 text-[#261900] px-3 py-1.5 rounded-lg border border-[#febc04]/30"
                  >
                    <Plus className="w-3 h-3" /> Add Job
                  </button>
                </div>

                {resume.content.experience.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">
                    No experience items added. Click "Add Job" above.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {resume.content.experience.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="bg-neutral-50 border border-black/5 rounded-xl p-4 space-y-3 relative group"
                      >
                        <div className="absolute right-3 top-3 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => moveExperience(index, "up")}
                            disabled={index === 0}
                            className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-neutral-600" />
                          </button>
                          <button
                            onClick={() => moveExperience(index, "down")}
                            disabled={
                              index === resume.content.experience.length - 1
                            }
                            className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-neutral-600" />
                          </button>
                          <button
                            onClick={() => deleteExperience(index)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="font-bold text-xs text-neutral-400">
                          Position #{index + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500">
                              Company
                            </label>
                            <input
                              type="text"
                              placeholder="Google"
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "company",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500">
                              Role / Job Title
                            </label>
                            <input
                              type="text"
                              placeholder="Senior Developer"
                              value={exp.role}
                              onChange={(e) =>
                                updateExperience(index, "role", e.target.value)
                              }
                              className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500">
                              Location
                            </label>
                            <input
                              type="text"
                              placeholder="Bangalore, India"
                              value={exp.location}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "location",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Start Date
                              </label>
                              <input
                                type="text"
                                placeholder="Jun 2021"
                                value={exp.startDate}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "startDate",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                End Date
                              </label>
                              <input
                                type="text"
                                placeholder="Present"
                                disabled={exp.current}
                                value={exp.current ? "Present" : exp.endDate}
                                onChange={(e) =>
                                  updateExperience(
                                    index,
                                    "endDate",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all disabled:opacity-50"
                              />
                            </div>
                          </div>

                          {/* Work Mode & Job Type Dropdowns */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500">
                              Employment Type
                            </label>
                            <select
                              value={exp.employmentType || "Full-time"}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "employmentType",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                              <option value="Freelance">Freelance</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500">
                              Work Mode
                            </label>
                            <select
                              value={exp.workMode || "On-site"}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "workMode",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                            >
                              <option value="On-site">On-site</option>
                              <option value="Remote">Remote</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>

                          <div className="md:col-span-2 flex items-center gap-2 mt-1">
                            <input
                              type="checkbox"
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onChange={(e) => {
                                updateExperience(
                                  index,
                                  "current",
                                  e.target.checked,
                                );
                                if (e.target.checked) {
                                  updateExperience(index, "endDate", "Present");
                                }
                              }}
                              className="w-3.5 h-3.5 border-black/10 text-[#febc04] rounded focus:ring-[#febc04]"
                            />
                            <label
                              htmlFor={`current-${exp.id}`}
                              className="text-xs font-bold text-neutral-600 cursor-pointer"
                            >
                              I currently work here
                            </label>
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-bold text-neutral-500 flex justify-between">
                                <span>Description (Bullets, one per line)</span>
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  enhanceWithAI({ type: "experience", index })
                                }
                                disabled={
                                  enhancingField === `experience-${index}`
                                }
                                className="flex items-center gap-1 text-[9px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-lg disabled:opacity-50"
                              >
                                {enhancingField === `experience-${index}` ? (
                                  <>
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" />{" "}
                                    Enhancing...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-2.5 h-2.5" /> AI
                                    Enhance
                                  </>
                                )}
                              </button>
                            </div>
                            <textarea
                              rows={4}
                              placeholder="• Spearheaded database performance tuning and architectural refactors, achieving a 35% reduction in page loading latencies.&#10;• Orchestrated and mentored a high-performing team of 5+ developers, establishing Agile/Scrum best practices.&#10;• Collaborated with cross-functional stakeholders to deliver 5+ key features under tight deadlines."
                              value={exp.description}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-black/5 rounded-lg px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] resize-none transition-all"
                            />
                            <p className="text-[9px] text-neutral-400 font-semibold mt-0.5 leading-relaxed">
                              Tip: Start each line with a bullet symbol '• '.
                              Try to follow the format:{" "}
                              <strong>
                                Action Verb + Task + Outcome/Technology
                              </strong>{" "}
                              (e.g. "Developed dynamic dashboard using React,
                              reducing load times by 20%").
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Education & Projects Tab */}
            {activeTab === "education" && (
              <div className="space-y-6 animate-in fade-in duration-200 divide-y divide-black/5">
                {/* A. Education Panel */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-black/5 pb-2">
                    <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#febc04]" /> Education
                    </h3>
                    <button
                      onClick={addEducation}
                      className="flex items-center gap-1 text-[11px] font-bold bg-[#febc04]/15 hover:bg-[#febc04]/25 text-[#261900] px-3 py-1.5 rounded-lg border border-[#febc04]/30"
                    >
                      <Plus className="w-3 h-3" /> Add Degree
                    </button>
                  </div>

                  {resume.content.education.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-6">
                      No education items added. Click "Add Degree" above.
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {resume.content.education.map((edu, index) => (
                        <div
                          key={edu.id}
                          className="bg-neutral-50 border border-black/5 rounded-xl p-4 space-y-3 relative group"
                        >
                          <div className="absolute right-3 top-3 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => moveEducation(index, "up")}
                              disabled={index === 0}
                              className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                            <button
                              onClick={() => moveEducation(index, "down")}
                              disabled={
                                index === resume.content.education.length - 1
                              }
                              className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                            <button
                              onClick={() => deleteEducation(index)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="font-bold text-xs text-neutral-400">
                            Education #{index + 1}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                School / University
                              </label>
                              <input
                                type="text"
                                placeholder="IIT Bombay"
                                value={edu.school}
                                onChange={(e) =>
                                  updateEducation(index, "school", e.target.value)
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Degree / Specialization
                              </label>
                              <input
                                type="text"
                                placeholder="B.Tech in Computer Science"
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(index, "degree", e.target.value)
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Location
                              </label>
                              <input
                                type="text"
                                placeholder="Mumbai, India"
                                value={edu.location}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "location",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500">
                                  Graduation Year/Date
                                </label>
                                <input
                                  type="text"
                                  placeholder="May 2021"
                                  value={edu.gradDate}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "gradDate",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500">
                                  GPA / Marks (Optional)
                                </label>
                                <input
                                  type="text"
                                  placeholder="9.2/10"
                                  value={edu.gpa}
                                  onChange={(e) =>
                                    updateEducation(index, "gpa", e.target.value)
                                  }
                                  className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* B. Projects Panel */}
                <div className="space-y-4 pt-6">
                  <div className="flex justify-between items-center border-b border-black/5 pb-2">
                    <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-2">
                      <Code className="w-4 h-4 text-[#febc04]" /> Projects
                    </h3>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-1 text-[11px] font-bold bg-[#febc04]/15 hover:bg-[#febc04]/25 text-[#261900] px-3 py-1.5 rounded-lg border border-[#febc04]/30"
                    >
                      <Plus className="w-3 h-3" /> Add Project
                    </button>
                  </div>

                  {resume.content.projects.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-6">
                      No projects added. Click "Add Project" above.
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {resume.content.projects.map((proj, index) => (
                        <div
                          key={proj.id}
                          className="bg-neutral-50 border border-black/5 rounded-xl p-4 space-y-3 relative group"
                        >
                          <div className="absolute right-3 top-3 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => moveProject(index, "up")}
                              disabled={index === 0}
                              className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                            <button
                              onClick={() => moveProject(index, "down")}
                              disabled={
                                index === resume.content.projects.length - 1
                              }
                              className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                            <button
                              onClick={() => deleteProject(index)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="font-bold text-xs text-neutral-400">
                            Project #{index + 1}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Project Name
                              </label>
                              <input
                                type="text"
                                placeholder="E-Commerce API"
                                value={proj.name}
                                onChange={(e) =>
                                  updateProject(index, "name", e.target.value)
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Role / Tech Stack
                              </label>
                              <input
                                type="text"
                                placeholder="React, Node.js, Postgres"
                                value={proj.role}
                                onChange={(e) =>
                                  updateProject(index, "role", e.target.value)
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Project Link (Github / Live Demo)
                              </label>
                              <input
                                type="text"
                                placeholder="github.com/username/project"
                                value={proj.link}
                                onChange={(e) =>
                                  updateProject(index, "link", e.target.value)
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-neutral-500">
                                  Description (One item per line for bullets)
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    enhanceWithAI({ type: "project", index })
                                  }
                                  disabled={enhancingField === `project-${index}`}
                                  className="flex items-center gap-1 text-[9px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-lg disabled:opacity-50"
                                >
                                  {enhancingField === `project-${index}` ? (
                                    <>
                                      <Loader2 className="w-2.5 h-2.5 animate-spin" />{" "}
                                      Enhancing...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-2.5 h-2.5" /> AI
                                      Enhance
                                    </>
                                  )}
                                </button>
                              </div>
                              <textarea
                                rows={4}
                                placeholder="• Developed a real-time collaborative workspace app using WebSockets, Next.js, and PostgreSQL, decreasing message latency by 35%.&#10;• Integrated Stripe payment gateway and Auth0 authentication for secure, streamlined subscription management.&#10;• Optimized database queries and indexed keys, decreasing server response times by 30%."
                                value={proj.description}
                                onChange={(e) =>
                                  updateProject(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] resize-none transition-all"
                              />
                              <p className="text-[9px] text-neutral-400 font-semibold mt-0.5 leading-relaxed">
                                Tip: Start each line with a bullet symbol '• '.
                                Try to follow the format:{" "}
                                <strong>
                                  Action Verb + Task + Outcome/Technology
                                </strong>{" "}
                                (e.g. "Developed real-time chat app using
                                WebSockets, reducing latency by 30%").
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills & Certs Tab */}
            {activeTab === "skills" && (
              <div className="space-y-6 animate-in fade-in duration-200 divide-y divide-black/5">
                {/* A. Skills Panel */}
                <div className="space-y-4">
                  <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-2 border-b border-black/5 pb-2">
                    <Sparkles className="w-4 h-4 text-[#febc04]" /> Key Skills (ATS Optimized)
                  </h3>

                  <form onSubmit={addSkill} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter a skill (e.g. React, Docker, SQL) and press enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="flex-1 bg-neutral-50 border border-black/5 rounded-xl px-4 py-2 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Add
                    </button>
                  </form>

                  {/* Predefined Click Suggestions */}
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold text-neutral-400">
                      Popular Suggestions (Click to Add):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {SUGGESTED_SKILLS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => clickAddSkill(skill)}
                          className="bg-neutral-50 hover:bg-[#febc04]/10 text-neutral-500 hover:text-neutral-900 border border-black/5 hover:border-[#febc04]/20 text-[10px] px-2.5 py-0.5 rounded-full transition-all"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-neutral-50 border border-black/5 rounded-xl p-4 space-y-2">
                    <div className="text-[10px] font-bold text-neutral-400">
                      Added Skills
                    </div>
                    {resume.content.skills.length === 0 ? (
                      <p className="text-xs text-neutral-400 py-2">
                        No skills added yet.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {resume.content.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-white border border-black/5 text-[#0C0C0C] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 group hover:border-red-200 transition-all cursor-pointer"
                            onClick={() => deleteSkill(skill)}
                            title="Click to remove"
                          >
                            {skill}
                            <span className="text-neutral-400 group-hover:text-red-500 font-bold transition-colors">
                              ×
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* B. Certifications Panel */}
                <div className="space-y-4 pt-6">
                  <div className="flex justify-between items-center border-b border-black/5 pb-2">
                    <h3 className="font-extrabold text-neutral-800 text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#febc04]" /> Certifications &amp; Licenses
                    </h3>
                    <button
                      onClick={addCertification}
                      className="flex items-center gap-1 text-[11px] font-bold bg-[#febc04]/15 hover:bg-[#febc04]/25 text-[#261900] px-3 py-1.5 rounded-lg border border-[#febc04]/30"
                    >
                      <Plus className="w-3 h-3" /> Add Cert
                    </button>
                  </div>

                  {resume.content.certifications.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-6">
                      No certifications added. Click "Add Cert" above.
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {resume.content.certifications.map((cert, index) => (
                        <div
                          key={cert.id}
                          className="bg-neutral-50 border border-black/5 rounded-xl p-4 space-y-3 relative group"
                        >
                          <button
                            onClick={() => deleteCertification(index)}
                            className="absolute right-3 top-3 p-1 hover:bg-red-50 text-red-500 rounded opacity-60 group-hover:opacity-100 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="font-bold text-xs text-neutral-400">
                            Certification #{index + 1}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Name
                              </label>
                              <input
                                type="text"
                                placeholder="AWS Certified Solutions Architect"
                                value={cert.name}
                                onChange={(e) =>
                                  updateCertification(
                                    index,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Date
                              </label>
                              <input
                                type="text"
                                placeholder="Dec 2022"
                                value={cert.date}
                                onChange={(e) =>
                                  updateCertification(
                                    index,
                                    "date",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-3">
                              <label className="text-[10px] font-bold text-neutral-500">
                                Issuing Organization / URL
                              </label>
                              <input
                                type="text"
                                placeholder="Amazon Web Services (AWS)"
                                value={cert.issuer}
                                onChange={(e) =>
                                  updateCertification(
                                    index,
                                    "issuer",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-black/5 rounded-lg px-3 py-1.5 text-xs text-[#0C0C0C] outline-none focus:border-[#febc04] transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className={`bg-white border border-black/5 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm ${mobileMode === "edit" ? "hidden lg:flex" : "flex"}`}>
          {/* Spacing & Style Adjustment Panel */}
          <div className="border-b border-black/5 px-4 py-3 bg-neutral-50 flex flex-wrap gap-4 items-center justify-between text-xs text-neutral-700 flex-shrink-0">
            {/* Accent Color Picker */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#febc04]" /> Accent:
              </span>
              <div className="flex gap-1">
                {ACCENT_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => {
                      setAccentColor(col.hex);
                      setPageBorderColor(col.hex);
                    }}
                    className={`w-4.5 h-4.5 rounded-full border border-black/10 transition-all ${
                      accentColor === col.hex
                        ? "scale-120 ring-2 ring-[#febc04]/30"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Typography & Paper Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-neutral-500">Paper:</span>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as any)}
                  className="bg-white border border-neutral-300 rounded-lg px-2 py-0.5 text-[11px] font-bold text-neutral-800 outline-none cursor-pointer hover:border-[#febc04] transition-all"
                >
                  <option value="a4">A4 (Default)</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-semibold text-neutral-500 font-medium">Font Family:</span>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="bg-white border border-neutral-300 rounded-lg px-2 py-0.5 text-[11px] font-bold text-neutral-800 outline-none cursor-pointer hover:border-[#febc04] transition-all"
                >
                  <option value="default">Default Theme Font</option>
                  <option value="Arial">Arial (ATS Classic)</option>
                  <option value="Inter">Inter (ATS Sans)</option>
                  <option value="Open Sans">Open Sans (ATS Sans)</option>
                  <option value="Outfit">Outfit (ATS Sans)</option>
                  <option value="Lora">Lora (ATS Serif)</option>
                  <option value="Merriweather">Merriweather (ATS Serif)</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Fira Code">Fira Code (Tech/Mono)</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-semibold text-neutral-500">Font Size:</span>
                <input
                  type="range"
                  min={10}
                  max={14}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-16 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#febc04]"
                />
                <span className="font-bold text-neutral-800 text-[10px]">
                  {fontSize}px (Min 10px)
                </span>
              </div>
            </div>
          </div>

          {/* Preview Document Canvas */}
          <div className="flex-1 overflow-auto p-3 sm:p-6 bg-neutral-100 flex justify-start lg:justify-center">
            {/* The actual resume sheet to render/download */}
            <div
              id="resume-preview-container"
              className="w-full h-fit shadow-lg select-text flex flex-col transition-all duration-300 relative"
              style={{
                maxWidth: `${activePaper.widthMm}mm`,
                fontSize: `${fontSize}px`,
                lineHeight: lineSpacing,
                padding: `${marginSize}mm`,
                backgroundColor: paperBg,
                fontFamily: getFontFamilyCss(),
                textAlign: textAlignment === "justify" ? "justify" : "left",
                border:
                  pageBorderStyle !== "none"
                    ? `${dividerThickness} ${pageBorderStyle} ${pageBorderColor}`
                    : "none",
                backgroundImage: isExporting
                  ? "none"
                  : showGridPattern
                    ? "radial-gradient(circle, #e2e8f0 1.2px, transparent 1.2px)"
                    : "none",
                backgroundSize: showGridPattern ? "16px 16px" : "auto",
              }}
            >
              {/* RENDER TEMPLATES */}

              {/* A. SINGLE-COLUMN TEMPLATES */}
              {currentTemplate.type === "Single-Column" && (
                <div className="space-y-5 text-neutral-800 text-inherit">
                  {/* Headers */}
                  {/* minimal */}
                  {resume.template === "minimal" && (
                    <div className="text-center space-y-1.5 border-b border-black/10 pb-4 text-inherit">
                      <h1 className="text-3xl font-extrabold tracking-tight text-black">
                        {resume.content.personalInfo.fullName || "Your Name"}
                      </h1>
                      {resume.content.personalInfo.jobTitle && (
                        <p
                          className="text-xs font-bold uppercase tracking-wider text-neutral-500"
                          style={{ color: accentColor }}
                        >
                          {resume.content.personalInfo.jobTitle}
                        </p>
                      )}
                      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-neutral-600 text-inherit">
                        {resume.content.personalInfo.email && (
                          <span>{resume.content.personalInfo.email}</span>
                        )}
                        {resume.content.personalInfo.phone && (
                          <span>• {resume.content.personalInfo.phone}</span>
                        )}
                        {resume.content.personalInfo.location && (
                          <span>• {resume.content.personalInfo.location}</span>
                        )}
                        {resume.content.personalInfo.website && (
                          <span>• {resume.content.personalInfo.website}</span>
                        )}
                      </div>
                      {renderSocials("minimal")}
                    </div>
                  )}

                  {/* academic */}
                  {resume.template === "academic" && (
                    <div className="text-center space-y-2 border-b border-neutral-300 pb-4 text-inherit">
                      <h1 className="text-3xl font-extrabold text-neutral-900">
                        {resume.content.personalInfo.fullName || "Your Name"}
                      </h1>
                      {resume.content.personalInfo.jobTitle && (
                        <p
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: accentColor }}
                        >
                          {resume.content.personalInfo.jobTitle}
                        </p>
                      )}
                      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-xs text-neutral-600 font-medium text-inherit">
                        {resume.content.personalInfo.email && (
                          <span>{resume.content.personalInfo.email}</span>
                        )}
                        {resume.content.personalInfo.phone && (
                          <span>| {resume.content.personalInfo.phone}</span>
                        )}
                        {resume.content.personalInfo.location && (
                          <span>| {resume.content.personalInfo.location}</span>
                        )}
                        {resume.content.personalInfo.website && (
                          <span>| {resume.content.personalInfo.website}</span>
                        )}
                      </div>
                      {renderSocials("academic")}
                    </div>
                  )}

                  {/* executive */}
                  {resume.template === "executive" && (
                    <div
                      className="flex justify-between items-center border-b-2 pb-4 gap-4 text-inherit"
                      style={{ borderColor: accentColor }}
                    >
                      <div className="flex-1 text-inherit">
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                          {resume.content.personalInfo.fullName || "Your Name"}
                        </h1>
                        {resume.content.personalInfo.jobTitle && (
                          <p
                            className="text-xs font-bold uppercase tracking-wider mt-1"
                            style={{ color: accentColor }}
                          >
                            {resume.content.personalInfo.jobTitle}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500 font-medium mt-2 text-inherit">
                          {resume.content.personalInfo.email && (
                            <span>{resume.content.personalInfo.email}</span>
                          )}
                          {resume.content.personalInfo.phone && (
                            <span>| {resume.content.personalInfo.phone}</span>
                          )}
                          {resume.content.personalInfo.location && (
                            <span>
                              | {resume.content.personalInfo.location}
                            </span>
                          )}
                          {resume.content.personalInfo.website && (
                            <span>| {resume.content.personalInfo.website}</span>
                          )}
                        </div>
                        {renderSocials("executive")}
                      </div>
                      {resume.content.personalInfo.photoUrl && (
                        <div
                          className={`w-20 h-20 overflow-hidden flex-shrink-0 shadow-sm ${photoRadius}`}
                          style={{
                            borderWidth: `${photoBorderThickness}px`,
                            borderColor: accentColor,
                            borderStyle: "solid",
                          }}
                        >
                          <img
                            src={getCleanPhotoUrl(
                              resume.content.personalInfo.photoUrl,
                            )}
                            alt={resume.content.personalInfo.fullName}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* elegant */}
                  {resume.template === "elegant" && (
                    <div
                      className="text-center space-y-3 border-b-2 pb-4 flex flex-col items-center text-inherit"
                      style={{ borderColor: accentColor }}
                    >
                      {resume.content.personalInfo.photoUrl && (
                        <div
                          className={`w-24 h-24 overflow-hidden flex-shrink-0 shadow-md ${photoRadius}`}
                          style={{
                            borderWidth: `${photoBorderThickness}px`,
                            borderColor: accentColor,
                            borderStyle: "solid",
                          }}
                        >
                          <img
                            src={getCleanPhotoUrl(
                              resume.content.personalInfo.photoUrl,
                            )}
                            alt={resume.content.personalInfo.fullName}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h1
                          className="text-3xl font-light tracking-widest uppercase"
                          style={{ color: accentColor }}
                        >
                          {resume.content.personalInfo.fullName || "Your Name"}
                        </h1>
                        {resume.content.personalInfo.jobTitle && (
                          <p className="text-xs font-bold tracking-widest text-neutral-800 uppercase">
                            {resume.content.personalInfo.jobTitle}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-0.5 text-xs text-neutral-500 font-medium text-inherit">
                        {resume.content.personalInfo.email && (
                          <span>{resume.content.personalInfo.email}</span>
                        )}
                        {resume.content.personalInfo.phone && (
                          <span>• {resume.content.personalInfo.phone}</span>
                        )}
                        {resume.content.personalInfo.location && (
                          <span>• {resume.content.personalInfo.location}</span>
                        )}
                        {resume.content.personalInfo.website && (
                          <span>• {resume.content.personalInfo.website}</span>
                        )}
                      </div>
                      {renderSocials("elegant")}
                    </div>
                  )}

                  {/* simple */}
                  {resume.template === "simple" && (
                    <div
                      className="flex items-center gap-5 border-b pb-4 text-inherit"
                      style={{ borderColor: `${accentColor}1D` }}
                    >
                      {resume.content.personalInfo.photoUrl && (
                        <div
                          className={`w-20 h-20 overflow-hidden border flex-shrink-0 shadow-sm ${photoRadius}`}
                          style={{
                            borderWidth: `${photoBorderThickness}px`,
                            borderColor: accentColor,
                            borderStyle: "solid",
                          }}
                        >
                          <img
                            src={getCleanPhotoUrl(
                              resume.content.personalInfo.photoUrl,
                            )}
                            alt={resume.content.personalInfo.fullName}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                      )}
                      <div className="flex-1 text-inherit">
                        <h1
                          className="text-3xl font-black tracking-tight"
                          style={{ color: accentColor }}
                        >
                          {resume.content.personalInfo.fullName || "Your Name"}
                        </h1>
                        {resume.content.personalInfo.jobTitle && (
                          <p className="text-xs font-bold tracking-widest text-neutral-800 uppercase mt-0.5">
                            {resume.content.personalInfo.jobTitle}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-neutral-400 font-semibold text-[11px] mt-1.5 text-inherit">
                          {resume.content.personalInfo.email && (
                            <span>{resume.content.personalInfo.email}</span>
                          )}
                          {resume.content.personalInfo.phone && (
                            <span>| {resume.content.personalInfo.phone}</span>
                          )}
                          {resume.content.personalInfo.location && (
                            <span>
                              | {resume.content.personalInfo.location}
                            </span>
                          )}
                          {resume.content.personalInfo.website && (
                            <span>| {resume.content.personalInfo.website}</span>
                          )}
                        </div>
                        {renderSocials("simple")}
                      </div>
                    </div>
                  )}

                  {/* metro */}
                  {resume.template === "metro" && (
                    <div
                      className="border p-4 rounded-xl flex justify-between items-center bg-neutral-50/50 flex-shrink-0 text-inherit"
                      style={{ borderColor: `${accentColor}33` }}
                    >
                      <div className="text-inherit">
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                          {resume.content.personalInfo.fullName || "Your Name"}
                        </h1>
                        {resume.content.personalInfo.jobTitle && (
                          <p
                            className="text-xs font-bold uppercase tracking-widest mt-0.5"
                            style={{ color: accentColor }}
                          >
                            {resume.content.personalInfo.jobTitle}
                          </p>
                        )}
                        {renderSocials("metro")}
                      </div>
                      <div className="text-right text-[10px] text-neutral-400 space-y-0.5 font-bold uppercase tracking-wider">
                        {resume.content.personalInfo.email && (
                          <p>{resume.content.personalInfo.email}</p>
                        )}
                        {resume.content.personalInfo.phone && (
                          <p>{resume.content.personalInfo.phone}</p>
                        )}
                        {resume.content.personalInfo.location && (
                          <p>{resume.content.personalInfo.location}</p>
                        )}
                        {resume.content.personalInfo.website && (
                          <p>{resume.content.personalInfo.website}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* marketing */}
                  {resume.template === "marketing" && (
                    <div
                      className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b pb-4 gap-4 text-inherit"
                      style={{ borderColor: `${accentColor}33` }}
                    >
                      <div className="flex-1 space-y-1.5 text-center sm:text-left text-inherit">
                        <div
                          className="inline-block bg-[#6366F1]/10 text-[#6366F1] font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${accentColor}1A`,
                            color: accentColor,
                          }}
                        >
                          SEO & Digital Marketing Specialist
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 uppercase">
                          {resume.content.personalInfo.fullName || "Your Name"}
                        </h1>
                        {resume.content.personalInfo.jobTitle && (
                          <p
                            className="text-xs font-black uppercase tracking-widest"
                            style={{ color: accentColor }}
                          >
                            {resume.content.personalInfo.jobTitle}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500 font-semibold text-inherit justify-center sm:justify-start">
                          {resume.content.personalInfo.email && (
                            <span>{resume.content.personalInfo.email}</span>
                          )}
                          {resume.content.personalInfo.phone && (
                            <span>| {resume.content.personalInfo.phone}</span>
                          )}
                          {resume.content.personalInfo.location && (
                            <span>
                              | {resume.content.personalInfo.location}
                            </span>
                          )}
                          {resume.content.personalInfo.website && (
                            <span>| {resume.content.personalInfo.website}</span>
                          )}
                        </div>
                        {renderSocials("marketing")}
                      </div>

                      {resume.content.personalInfo.photoUrl && (
                        <div
                          className={`w-20 h-20 overflow-hidden flex-shrink-0 shadow-sm ${photoRadius}`}
                          style={{
                            borderWidth: `${photoBorderThickness}px`,
                            borderColor: accentColor,
                            borderStyle: "solid",
                          }}
                        >
                          <img
                            src={getCleanPhotoUrl(
                              resume.content.personalInfo.photoUrl,
                            )}
                            alt={resume.content.personalInfo.fullName}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loop & render sections in order */}
                  {sectionOrder.map((sectionId) =>
                    renderSectionNode(sectionId, resume.template),
                  )}
                </div>
              )}

              {/* B. TWO-COLUMN TEMPLATES */}
              {currentTemplate.type === "Two-Column" && (
                <div className="grid grid-cols-3 gap-6 flex-1 text-neutral-800 text-inherit">
                  {/* Left Sidebar */}
                  <div
                    className={`col-span-1 pr-5 space-y-5 flex flex-col border-r`}
                    style={{ borderColor: `${accentColor}1D` }}
                  >
                    {/* Render photo inside sidebar */}
                    {resume.content.personalInfo.photoUrl && (
                      <div
                        className={`w-28 h-28 mx-auto overflow-hidden flex-shrink-0 shadow-sm ${photoRadius}`}
                        style={{
                          borderWidth: `${photoBorderThickness}px`,
                          borderColor: accentColor,
                          borderStyle: "solid",
                        }}
                      >
                        <img
                          src={getCleanPhotoUrl(
                            resume.content.personalInfo.photoUrl,
                          )}
                          alt={resume.content.personalInfo.fullName}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}

                    {/* Sidebar Contact Info */}
                    <div className="space-y-2 text-inherit">
                      <h3
                        className="font-bold text-[10px] uppercase tracking-wider border-b pb-1"
                        style={{
                          color: accentColor,
                          borderColor: `${accentColor}33`,
                        }}
                      >
                        Contact
                      </h3>
                      <div className="space-y-1.5 text-neutral-600 break-words text-[11px] text-inherit">
                        {resume.content.personalInfo.email && (
                          <p className="font-medium">
                            {resume.content.personalInfo.email}
                          </p>
                        )}
                        {resume.content.personalInfo.phone && (
                          <p>{resume.content.personalInfo.phone}</p>
                        )}
                        {resume.content.personalInfo.location && (
                          <p>{resume.content.personalInfo.location}</p>
                        )}
                        {resume.content.personalInfo.website && (
                          <p
                            className="font-bold"
                            style={{ color: accentColor }}
                          >
                            {resume.content.personalInfo.website}
                          </p>
                        )}
                        {renderSocials(resume.template)}
                      </div>
                    </div>

                    {/* Loop & render sections mapped to sidebar */}
                    {sectionOrder
                      .filter((secId) => sectionColumns[secId] === "sidebar")
                      .map((secId) =>
                        renderSectionNode(secId, resume.template),
                      )}
                  </div>

                  {/* Right Main Column */}
                  <div className="col-span-2 space-y-5 flex flex-col text-inherit">
                    {/* Header title */}
                    <div className="flex justify-between items-start gap-4 text-inherit">
                      <div className="text-inherit">
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight uppercase">
                          {resume.content.personalInfo.fullName || "Your Name"}
                        </h1>
                        {resume.content.personalInfo.jobTitle && (
                          <p
                            className="text-sm font-bold tracking-wider uppercase mt-0.5"
                            style={{ color: accentColor }}
                          >
                            {resume.content.personalInfo.jobTitle}
                          </p>
                        )}
                      </div>

                      {/* Photo in main column (only if sidebar column doesn't support or if user drags layout) */}
                      {resume.template === "warm" &&
                        resume.content.personalInfo.photoUrl && (
                          <div
                            className={`w-16 h-16 overflow-hidden flex-shrink-0 shadow-sm ${photoRadius}`}
                            style={{
                              borderWidth: `${photoBorderThickness}px`,
                              borderColor: accentColor,
                              borderStyle: "solid",
                            }}
                          >
                            <img
                              src={getCleanPhotoUrl(
                                resume.content.personalInfo.photoUrl,
                              )}
                              alt={resume.content.personalInfo.fullName}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                          </div>
                        )}
                    </div>

                    {/* Loop & render sections mapped to main column */}
                    {sectionOrder
                      .filter((secId) => sectionColumns[secId] === "main")
                      .map((secId) =>
                        renderSectionNode(secId, resume.template),
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-black/10 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
              <div>
                <h2 className="text-lg font-extrabold text-[#0C0C0C] flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#febc04]" /> Select Resume
                  Template
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Select from 11 advanced, fully ATS-optimized premium layouts.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={shuffleTemplates}
                  disabled={isShuffling}
                  className="flex items-center gap-1.5 bg-[#febc04]/10 hover:bg-[#febc04]/20 border border-[#febc04]/30 text-[#261900] px-4 py-2 rounded-xl text-xs font-black transition-all"
                >
                  <Sparkles
                    className={`w-3.5 h-3.5 text-[#febc04] ${isShuffling ? "animate-spin" : "animate-bounce"}`}
                  />
                  {isShuffling ? "Analyzing..." : "Surprise Me! (Auto-Suggest)"}
                </button>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATE_DEFS.map((temp) => {
                const isCurrentShuffle = shuffleId === temp.id;
                const active = isShuffling
                  ? isCurrentShuffle
                  : resume.template === temp.id;

                // Career Suggestion Badges/Hints
                let badge = null;
                if (temp.id === "minimal")
                  badge = {
                    text: "⭐ Best Classic",
                    style: "bg-amber-100 text-amber-800",
                  };
                else if (temp.id === "marketing")
                  badge = {
                    text: "🔥 SEO & Marketing",
                    style:
                      "bg-[#6366F1]/10 text-[#6366F1] animate-pulse border border-[#6366F1]/20",
                  };
                else if (temp.id === "tech")
                  badge = {
                    text: "💻 Devs & Tech",
                    style: "bg-sky-100 text-sky-800",
                  };
                else if (temp.id === "executive")
                  badge = {
                    text: "👑 Senior Execs",
                    style: "bg-emerald-100 text-emerald-800",
                  };
                else if (temp.id === "elegant")
                  badge = {
                    text: "✨ Premium Look",
                    style: "bg-purple-100 text-purple-800",
                  };
                else if (temp.id === "modern")
                  badge = {
                    text: "💼 Recommended",
                    style: "bg-neutral-100 text-neutral-800",
                  };

                return (
                  <div
                    key={temp.id}
                    onClick={() =>
                      !isShuffling && handleTemplateChange(temp.id)
                    }
                    className={`border rounded-xl p-4 flex flex-col justify-between hover:scale-[1.02] hover:shadow-md cursor-pointer transition-all duration-200 relative ${
                      active
                        ? "border-[#febc04] bg-[#febc04]/5 ring-4 ring-[#febc04]/10 shadow-md"
                        : "border-black/5 bg-neutral-50 hover:bg-white"
                    } ${isShuffling ? "cursor-not-allowed opacity-50" : ""}`}
                    style={
                      active
                        ? {
                            borderColor: temp.color,
                            boxShadow: `0 4px 12px ${temp.color}15`,
                          }
                        : {}
                    }
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm text-neutral-900 capitalize">
                            {temp.name}
                          </h3>
                          {badge && (
                            <span
                              className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${badge.style}`}
                            >
                              {badge.text}
                            </span>
                          )}
                        </div>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: temp.color }}
                        />
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">
                        {temp.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-black/5 mt-4 pt-3 text-[10px] font-bold">
                      <span className="text-neutral-400">
                        Layout:{" "}
                        <strong className="text-neutral-600">
                          {temp.type}
                        </strong>
                      </span>
                      {active ? (
                        <span
                          className="bg-[#febc04] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase"
                          style={{ backgroundColor: temp.color }}
                        >
                          Active
                        </span>
                      ) : (
                        <span className="text-neutral-300 text-[9px] font-bold">
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-black/5 flex justify-end flex-shrink-0 bg-neutral-50">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="bg-neutral-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
