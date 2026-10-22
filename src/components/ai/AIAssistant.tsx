"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { personalInfo, education, internship, certifications, skillCategories } from "@/lib/constants";
import { useLenis } from "lenis/react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  actions?: Array<{ label: string; action: string; href?: string }>;
  timestamp: string;
}

// Starter conversation suggestions
const SUGGESTED_PROMPTS = [
  "Tell me about SIH 2026 JANBHASHA",
  "How does SafeSync AI safety work?",
  "What is Smruti's tech stack?",
  "Tell me about education & CGPA",
  "How can I contact Smruti?",
];

// Pre-computed intelligent knowledge base answering engine
function queryKnowledgeBase(query: string): {
  text: string;
  actions?: Array<{ label: string; action: string; href?: string }>;
} {
  const q = query.toLowerCase().trim();

  // 1. SIH 2026 / JANBHASHA
  if (
    q.includes("janbhasha") ||
    q.includes("sih") ||
    q.includes("vernacular") ||
    q.includes("smart india")
  ) {
    return {
      text: `**JANBHASHA (जनभाषा)** is an offline edge AI learning and translation app built for the **Smart India Hackathon (SIH 2026)**!\n\nIt enables primary school students to learn curriculum lessons in their native regional languages on low-cost Android tablets without needing internet access.\n\n• **Stack:** React Native, TypeScript, Python, ONNX Runtime, Kotlin, Edge AI.\n• **Highlight:** 100% offline edge neural inference.`,
      actions: [
        { label: "View GitHub Repo", action: "link", href: "https://github.com/SMRU08/JANBHASHA" },
        { label: "Jump to Projects", action: "scroll", href: "#project-1" },
      ],
    };
  }

  // 2. SafeSync / Workplace Safety AI
  if (
    q.includes("safesync") ||
    q.includes("safety") ||
    q.includes("ppe") ||
    q.includes("bput") ||
    q.includes("hazard")
  ) {
    return {
      text: `**SafeSync** is an AI-powered workplace safety system developed for the **BPUT Hackathon**!\n\nIt performs real-time camera inspection to detect PPE compliance (hardhats, safety vests), monitors industrial danger zones and fire hazards, and triggers instant alerts on an interactive web dashboard.\n\n• **Stack:** Python, FastAPI, React, TypeScript, Vite, Computer Vision (YOLO/OpenCV).\n• **Status:** Live demo operational on Vercel.`,
      actions: [
        { label: "Open Live Demo ↗", action: "link", href: "https://safesync-xerses.vercel.app" },
        { label: "View GitHub Code", action: "link", href: "https://github.com/SMRU08/SafeSync" },
        { label: "Jump to SafeSync", action: "scroll", href: "#project-0" },
      ],
    };
  }

  // 3. Face Recognition Attendance System
  if (
    q.includes("face recognition") ||
    q.includes("attendance") ||
    q.includes("cttc project")
  ) {
    return {
      text: `**Face Recognition Attendance System** uses live camera video to detect and verify human faces in real time.\n\nIt eliminates proxy attendance, registers attendance records automatically, and provides high-speed verification.\n\n• **Stack:** Python, OpenCV, Machine Learning, Keras, Computer Vision.`,
      actions: [
        { label: "Jump to Project", action: "scroll", href: "#project-2" },
      ],
    };
  }

  // 4. Real-Time Emotion Detection
  if (
    q.includes("emotion") ||
    q.includes("expression") ||
    q.includes("facial expression")
  ) {
    return {
      text: `**Real-Time Emotion Detection** analyzes live camera video to recognize human faces and classify facial expressions and emotions (Happy, Sad, Angry, Surprised, Neutral) instantaneously.\n\n• **Stack:** Python, OpenCV, NumPy, TensorFlow, Keras, Computer Vision.`,
      actions: [
        { label: "Jump to Project", action: "scroll", href: "#project-3" },
      ],
    };
  }

  // 5. Skills & Tech Stack
  if (
    q.includes("skill") ||
    q.includes("stack") ||
    q.includes("tech") ||
    q.includes("language") ||
    q.includes("tools") ||
    q.includes("python") ||
    q.includes("react")
  ) {
    const aiSkills = skillCategories[0]?.skills.map((s) => s.name).join(", ");
    const feSkills = skillCategories[1]?.skills.map((s) => s.name).join(", ");
    const coreSkills = skillCategories[2]?.skills.map((s) => s.name).join(", ");

    return {
      text: `Here is Smruti's core technical skillset:\n\n• **AI, ML & Vision:** ${aiSkills}\n• **Frontend & Interactive:** ${feSkills}\n• **Languages & Backend:** ${coreSkills}\n\nSmruti focuses on pairing computer vision and edge models with high-performance web interfaces.`,
      actions: [
        { label: "Explore Skills Section", action: "scroll", href: "#skills" },
      ],
    };
  }

  // 6. Education & CGPA
  if (
    q.includes("education") ||
    q.includes("cgpa") ||
    q.includes("college") ||
    q.includes("synergy") ||
    q.includes("degree") ||
    q.includes("university") ||
    q.includes("school")
  ) {
    const primary = education[0];
    return {
      text: `**Academic Background:**\n\n• **Degree:** ${primary?.degree}\n• **Institution:** ${primary?.institution}\n• **Duration:** ${primary?.period}\n• **Academic Score:** ${primary?.grade}\n\nSmruti pairs strong academic fundamentals with practical hackathon implementations.`,
      actions: [
        { label: "View About Section", action: "scroll", href: "#about" },
        { label: "Download Resume", action: "link", href: personalInfo.cvUrl },
      ],
    };
  }

  // 7. Certifications
  if (
    q.includes("certificate") ||
    q.includes("certification") ||
    q.includes("coursera") ||
    q.includes("ibm") ||
    q.includes("google")
  ) {
    const topCerts = certifications.slice(0, 5).map((c) => `• **${c.title}** (${c.issuer})`).join("\n");
    return {
      text: `Smruti holds **${certifications.length} verified technical certifications**, including:\n\n${topCerts}\n\nCovers Machine Learning Project Management, Cybersecurity, Big Data, and Deep Learning.`,
      actions: [
        { label: "View All Credentials", action: "scroll", href: "#more-projects" },
      ],
    };
  }

  // 8. Internship / Experience
  if (
    q.includes("internship") ||
    q.includes("experience") ||
    q.includes("cttc") ||
    q.includes("work")
  ) {
    return {
      text: `**Internship Experience:**\n\n• **Role:** ${internship.role}\n• **Organization:** ${internship.company}\n• **Duration:** ${internship.period}\n• **Topics:** ${internship.topics.join(", ")}\n• **Project:** ${internship.finalProject}`,
      actions: [
        { label: "Jump to Experience", action: "scroll", href: "#more-projects" },
      ],
    };
  }

  // 9. Contact / Hire / Opportunities
  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("location") ||
    q.includes("message")
  ) {
    return {
      text: `Smruti is **available for AI/ML, Full-Stack, and Software Engineering roles**!\n\n• **Email:** ${personalInfo.email}\n• **Location:** ${personalInfo.location}\n• **GitHub:** github.com/SMRU08\n• **LinkedIn:** linkedin.com/in/smruti-ranjan-nayak-67a733360`,
      actions: [
        { label: "Send Email", action: "link", href: `mailto:${personalInfo.email}` },
        { label: "Go to Contact Form", action: "scroll", href: "#contact" },
        { label: "Download CV (PDF)", action: "link", href: personalInfo.cvUrl },
      ],
    };
  }

  // 10. Greetings & Identity
  if (
    q.includes("rex") ||
    q.includes("hi") ||
    q.includes("hello") ||
    q.includes("hey") ||
    q.includes("who are you") ||
    q.includes("who is smruti")
  ) {
    return {
      text: `Greetings! I am **REX**, Smruti's autonomous portfolio agent 🤖⚡\n\nI can answer questions regarding Smruti's computer vision projects (*SafeSync*, *JANBHASHA*), hackathons, ML skills, certifications, and availability for software roles.\n\nHow can I help you today?`,
      actions: [
        { label: "Explore Projects", action: "scroll", href: "#projects" },
        { label: "View Skills", action: "scroll", href: "#skills" },
      ],
    };
  }

  // 11. Fallback Intelligent Search
  return {
    text: `Thanks for asking! Smruti is a computer science engineer specializing in **Computer Vision**, **Edge AI**, and **Modern Web Systems**.\n\nFeel free to ask me about SafeSync, SIH 2026, tech stack, or download his resume below.`,
    actions: [
      { label: "View Featured Projects", action: "scroll", href: "#projects" },
      { label: "Contact Smruti", action: "scroll", href: "#contact" },
      { label: "Download Resume", action: "link", href: personalInfo.cvUrl },
    ],
  };
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Greetings! I'm **REX**, Smruti's autonomous portfolio agent 🤖⚡\n\nAsk me anything about Smruti's AI/ML projects (*SafeSync*, *JANBHASHA*), hackathons, or tech stack!`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const msgCounter = useRef(1);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Auto-scroll chat to bottom
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Handle action triggers (scroll or external link)
  const handleAction = (act: { action: string; href?: string }) => {
    if (act.action === "scroll" && act.href) {
      const el = document.querySelector(act.href);
      if (el && lenis) {
        lenis.scrollTo(el as HTMLElement, { offset: -70 });
        if (window.innerWidth < 768) {
          setIsOpen(false);
        }
      }
    } else if (act.action === "link" && act.href) {
      window.open(act.href, "_blank", "noopener,noreferrer");
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    msgCounter.current += 1;
    const userMsgId = `user-${msgCounter.current}`;
    const userMessage: Message = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Realistic typewriter delay
    setTimeout(() => {
      msgCounter.current += 1;
      const response = queryKnowledgeBase(text);
      const aiMessage: Message = {
        id: `ai-${msgCounter.current}`,
        sender: "ai",
        text: response.text,
        actions: response.actions,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleClear = () => {
    msgCounter.current += 1;
    setMessages([
      {
        id: `welcome-${msgCounter.current}`,
        sender: "ai",
        text: `Chat reset! I'm REX. How can I assist you with Smruti's portfolio?`,
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* 1. Floating Cosmic Trigger Pill Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-[#030614]/90 px-4 py-2.5 shadow-[0_4px_24px_rgba(129,84,255,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan-300 hover:shadow-[0_4px_30px_rgba(56,189,248,0.45)] cursor-pointer active:scale-95"
            aria-label="Open REX AI Assistant"
          >
            {/* Pulsing Starlight Beacon */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>

            <Sparkles size={15} className="text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-display text-xs font-semibold tracking-wider text-white">
              Ask REX
            </span>
            <span className="rounded-full bg-violet-600/30 px-2 py-0.5 font-mono text-[10px] text-violet-300">
              AI
            </span>
          </button>
        )}
      </div>

      {/* 2. Chat Drawer / Floating Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[560px] max-h-[90vh] w-[92vw] max-w-[410px] flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#030614]/95 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 sm:bottom-6 sm:right-6">
          {/* Ambient Cosmic Header Glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 via-violet-500/50 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400">
                <Bot size={17} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-bold text-white">
                    REX
                  </span>
                  <span className="rounded bg-violet-500/20 px-1 py-0.2 font-mono text-[9px] text-violet-300 uppercase">
                    AI Agent
                  </span>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="font-mono text-[10px] text-slate-400">
                  Smruti&apos;s Portfolio Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white cursor-pointer"
                title="Close REX chat"
                aria-label="Close REX chat"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs select-text">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "rounded-br-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                      : "rounded-bl-sm border border-white/[0.08] bg-white/[0.04] text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Contextual Action Buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1 border-t border-white/[0.08]">
                      {m.actions.map((act) => (
                        <button
                          key={act.label}
                          onClick={() => handleAction(act)}
                          className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300 transition-all hover:border-cyan-300 hover:bg-cyan-400/20 cursor-pointer active:scale-95"
                        >
                          <span>{act.label}</span>
                          <ExternalLink size={10} className="shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 w-16">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Starter Prompts (if chat is fresh) */}
          {messages.length <= 3 && !isTyping && (
            <div className="px-3 pb-2">
              <span className="block font-mono text-[10px] text-slate-400 mb-1.5 px-1 uppercase tracking-wider">
                Suggested prompts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/[0.08] hover:text-cyan-200 text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="border-t border-white/[0.08] bg-[#030614]/80 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask REX about SafeSync, SIH, skills..."
                className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Send message to REX"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
