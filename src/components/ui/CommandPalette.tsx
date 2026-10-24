"use client";

import { useState, useEffect, useRef, useMemo, useCallback, useSyncExternalStore } from "react";
import {
  Search,
  Command,
  FileText,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Github,
  Linkedin,
  Compass,
  Layers,
  ArrowRight,
  X,
  Code2,
} from "lucide-react";
import { useLenis } from "lenis/react";
import { isSoundEnabled, setSoundEnabled, playHoverTick, playMechanicalClick } from "@/lib/sound";
import { personalInfo } from "@/lib/constants";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Orbital Sectors" | "Actions" | "Tech & Skills";
  keywords: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  onSelect: () => void;
}

function emptySubscribe() {
  return () => {};
}

function getIsMacSnapshot(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

function getIsMacServerSnapshot(): boolean {
  return false;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isMac = useSyncExternalStore(emptySubscribe, getIsMacSnapshot, getIsMacServerSnapshot);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Smooth scroll helper
  const scrollTo = useCallback(
    (selector: string) => {
      const el = document.querySelector(selector);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el as HTMLElement, { offset: -60 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [lenis]
  );

  // Command items definitions
  const allItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [
      // 1. Navigation
      {
        id: "nav-hero",
        title: "Home // Top of Galaxy",
        subtitle: "Return to the introductory cosmic vantage point",
        category: "Navigation",
        keywords: ["home", "hero", "start", "top", "welcome"],
        icon: Compass,
        onSelect: () => scrollTo("#hero"),
      },
      {
        id: "nav-about",
        title: "About Smruti",
        subtitle: "Biography, background, education & stats",
        category: "Navigation",
        keywords: ["about", "bio", "education", "synergy", "btech", "dhenkanal"],
        icon: FileText,
        onSelect: () => scrollTo("#about"),
      },
      {
        id: "nav-more-projects",
        title: "More Projects & Credentials",
        subtitle: "Archive of hackathon builds & internship deliverables",
        category: "Navigation",
        keywords: ["more projects", "archive", "calculator", "portfolio", "cttc"],
        icon: Layers,
        onSelect: () => scrollTo("#more-projects"),
      },
      {
        id: "nav-skills",
        title: "Technical Skills Matrix",
        subtitle: "Languages, AI/ML tools, frameworks & edge runtimes",
        category: "Navigation",
        keywords: ["skills", "tech stack", "languages", "tools", "python", "typescript"],
        icon: Code2,
        onSelect: () => scrollTo("#skills"),
      },
      {
        id: "nav-contact",
        title: "Get in Touch // Contact Form",
        subtitle: "Direct inquiry route to smrutiranjan2412@gmail.com",
        category: "Navigation",
        keywords: ["contact", "email", "hire", "message", "inquiry", "reach out"],
        icon: FileText,
        onSelect: () => scrollTo("#contact"),
      },

      // 2. Orbital Sectors (Planetary Projects)
      {
        id: "orbit-0",
        title: "Sector 01 // Earth — SafeSync",
        subtitle: "BPUT Hackathon Winner · AI-powered workplace safety system",
        category: "Orbital Sectors",
        keywords: ["earth", "safesync", "ppe", "safety", "fastapi", "hackathon"],
        icon: Compass,
        badge: "Earth",
        onSelect: () => scrollTo("#project-0"),
      },
      {
        id: "orbit-1",
        title: "Sector 02 // Mars — JANBHASHA",
        subtitle: "SIH 2026 · Offline edge AI vernacular learning app",
        category: "Orbital Sectors",
        keywords: ["mars", "janbhasha", "sih", "smart india", "vernacular", "edge ai"],
        icon: Compass,
        badge: "Mars",
        onSelect: () => scrollTo("#project-1"),
      },
      {
        id: "orbit-2",
        title: "Sector 03 // Jupiter — Face Attendance",
        subtitle: "Real-time biometric MTCNN attendance tracker",
        category: "Orbital Sectors",
        keywords: ["jupiter", "face", "attendance", "biometric", "opencv", "keras"],
        icon: Compass,
        badge: "Jupiter",
        onSelect: () => scrollTo("#project-2"),
      },
      {
        id: "orbit-3",
        title: "Sector 04 // Saturn — Emotion Detection",
        subtitle: "Live facial expression recognition & emotion vectorizer",
        category: "Orbital Sectors",
        keywords: ["saturn", "emotion", "expression", "cnn", "camera", "computer vision"],
        icon: Compass,
        badge: "Saturn",
        onSelect: () => scrollTo("#project-3"),
      },
      {
        id: "orbit-4",
        title: "Sector 05 // Neptune — REX AI Agent",
        subtitle: "Voice-enabled autonomous portfolio copilot & telemetry director",
        category: "Orbital Sectors",
        keywords: ["neptune", "rex", "ai agent", "copilot", "chat", "assistant"],
        icon: Compass,
        badge: "Neptune",
        onSelect: () => scrollTo("#project-4"),
      },

      // 3. Actions
      {
        id: "act-rex",
        title: "Ask REX AI Assistant",
        subtitle: "Open the interactive AI drawer & voice-enabled knowledge engine",
        category: "Actions",
        keywords: ["rex", "ai", "ask", "chat", "question", "bot"],
        icon: Sparkles,
        badge: "Agent",
        onSelect: () => {
          window.dispatchEvent(new CustomEvent("open-rex-assistant"));
        },
      },
      {
        id: "act-resume",
        title: "Download Curriculum Vitae (PDF)",
        subtitle: "Directly download Smruti's documented resume",
        category: "Actions",
        keywords: ["resume", "cv", "pdf", "download", "hire"],
        icon: FileText,
        badge: "PDF",
        onSelect: () => {
          const a = document.createElement("a");
          a.href = personalInfo.cvUrl || "/Smruti_Ranjan_Nayak_CV.pdf";
          a.download = "Smruti_Ranjan_Nayak_CV.pdf";
          a.click();
        },
      },
      {
        id: "act-sound",
        title: isSoundEnabled() ? "Mute Cosmic Audio" : "Enable Cosmic Audio",
        subtitle: "Toggle Web Audio API UI feedback tones",
        category: "Actions",
        keywords: ["sound", "audio", "mute", "unmute", "music", "tones"],
        icon: isSoundEnabled() ? VolumeX : Volume2,
        onSelect: () => {
          setSoundEnabled(!isSoundEnabled());
        },
      },
      {
        id: "act-email",
        title: copiedEmail ? "Email Copied to Clipboard!" : "Copy Direct Email Address",
        subtitle: "smrutiranjan2412@gmail.com",
        category: "Actions",
        keywords: ["copy", "email", "gmail", "address", "smrutiranjan2412"],
        icon: copiedEmail ? Check : Copy,
        onSelect: () => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText("smrutiranjan2412@gmail.com");
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
          }
        },
      },
      {
        id: "act-github",
        title: "Open GitHub Profile",
        subtitle: "https://github.com/SMRU08",
        category: "Actions",
        keywords: ["github", "code", "repo", "git", "smru08"],
        icon: Github,
        onSelect: () => window.open("https://github.com/SMRU08", "_blank"),
      },
      {
        id: "act-linkedin",
        title: "Open LinkedIn Profile",
        subtitle: "Connect with Smruti Ranjan Nayak on LinkedIn",
        category: "Actions",
        keywords: ["linkedin", "network", "connect", "profile"],
        icon: Linkedin,
        onSelect: () =>
          window.open(
            "https://www.linkedin.com/in/smruti-ranjan-nayak-67a733360",
            "_blank"
          ),
      },

      // 4. Tech & Skills Quick Filters
      {
        id: "tech-python",
        title: "Skill: Python & Computer Vision",
        subtitle: "Jump to AI/ML projects built with Python, OpenCV & Keras",
        category: "Tech & Skills",
        keywords: ["python", "opencv", "computer vision", "keras", "tensorflow"],
        icon: Code2,
        onSelect: () => scrollTo("#project-0"),
      },
      {
        id: "tech-nextjs",
        title: "Skill: Next.js & React 19",
        subtitle: "Full-stack web architecture, Turbopack & Tailwind CSS",
        category: "Tech & Skills",
        keywords: ["next.js", "react", "frontend", "turbopack", "tailwind"],
        icon: Code2,
        onSelect: () => scrollTo("#project-4"),
      },
      {
        id: "tech-fastapi",
        title: "Skill: FastAPI & Edge Runtimes",
        subtitle: "Asynchronous REST endpoints & ONNX offline runtime",
        category: "Tech & Skills",
        keywords: ["fastapi", "onnx", "backend", "api", "edge ai"],
        icon: Code2,
        onSelect: () => scrollTo("#project-1"),
      },
      {
        id: "tech-threejs",
        title: "Skill: Three.js & WebGL 3D",
        subtitle: "Interactive 3D solar system, GLSL shaders & camera tracks",
        category: "Tech & Skills",
        keywords: ["three.js", "three", "webgl", "shaders", "solar system", "glsl"],
        icon: Code2,
        onSelect: () => scrollTo("#projects"),
      },
    ];

    return items;
  }, [copiedEmail, scrollTo]);

  // Filter items according to search query
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allItems;

    return allItems.filter((item) => {
      if (item.title.toLowerCase().includes(q)) return true;
      if (item.subtitle?.toLowerCase().includes(q)) return true;
      if (item.category.toLowerCase().includes(q)) return true;
      return item.keywords.some((kw) => kw.includes(q));
    });
  }, [allItems, query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Global Keyboard listener for opening Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
        return;
      }

      // Quick Slash (/) when not typing in an input
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName || ""
        )
      ) {
        e.preventDefault();
        openPalette();
        return;
      }

      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", openPalette);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", openPalette);
    };
  }, [isOpen, openPalette, closePalette]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation inside the palette
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length
      );
      playHoverTick();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length === 0
          ? 0
          : (prev - 1 + filteredItems.length) % filteredItems.length
      );
      playHoverTick();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        playMechanicalClick();
        filteredItems[selectedIndex].onSelect();
        closePalette();
      }
    }
  };

  const executeItem = (item: CommandItem) => {
    playMechanicalClick();
    item.onSelect();
    closePalette();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cosmic Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24 animate-in fade-in duration-200 select-none"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={closePalette}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Futuristic Command Palette Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#030614]/95 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(56,189,248,0.2)] backdrop-blur-2xl transition-all duration-300">
        {/* Subtle Top Starlight Glow */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 via-violet-500/70 to-transparent" />

        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5 sm:px-5">
          <Search size={18} className="text-cyan-400 shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Type a command, project, or skill (e.g. 'Mars', 'Python', 'Resume')..."
            className="w-full bg-transparent font-sans text-sm sm:text-base text-white placeholder:text-slate-500 outline-none"
            aria-autocomplete="list"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
              }}
              className="rounded-md p-1 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          role="listbox"
          className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Compass size={28} className="mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">
                No cosmic signals found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try searching for &quot;Earth&quot;, &quot;SafeSync&quot;, &quot;Rex&quot;, or &quot;Resume&quot;
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/15 via-violet-500/10 to-transparent border-l-2 border-cyan-400 text-white"
                      : "text-slate-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isSelected
                          ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                          : "border-white/10 bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      <Icon size={15} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs sm:text-sm font-semibold text-white">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-violet-600/30 px-1.5 py-0.2 font-mono text-[9px] text-violet-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="truncate text-[11px] text-slate-400 mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider hidden sm:inline">
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight size={13} className="text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-black/40 px-4 py-2.5 font-mono text-[10px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/[0.06] px-1 py-0.2 text-[9px] text-slate-400">↑</kbd>
              <kbd className="rounded border border-white/10 bg-white/[0.06] px-1 py-0.2 text-[9px] text-slate-400">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/[0.06] px-1 py-0.2 text-[9px] text-slate-400">↵</kbd>
              <span>select</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-400/80">
            <Command size={11} />
            <span>COMMAND PALETTE</span>
            <span className="text-slate-600">&bull;</span>
            <span>{isMac ? "⌘K" : "Ctrl+K"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
