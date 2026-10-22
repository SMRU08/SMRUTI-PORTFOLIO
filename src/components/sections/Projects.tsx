"use client";

import { useState } from "react";
import { ExternalLink, Github, Compass, Layers, FileText } from "lucide-react";
import { projects } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ReticleCorners from "@/components/ui/ReticleCorners";
import { ProjectArchitectureXRay } from "./ProjectInteractiveDemo";

const PLANET_NAMES = ["Earth", "Mars", "Jupiter", "Saturn"];
const PROJECT_TELEMETRY = [
  "⚡ 28ms · PPE Detection Engine",
  "⚡ Edge AI · Offline Translation",
  "⚡ 30 FPS · 68-Pt Landmark Tracker",
  "⚡ 22ms · Emotion Vectorizer",
];

export function ProjectsHeader() {
  return (
    <div className="section-padding pb-0">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary-light uppercase">
              {"02 // FEATURED PROJECTS"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText
            as="h2"
            className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            Featured Projects
          </GradientText>
          <p className="mt-4 max-w-lg text-base text-slate-300">
            A showcase of practical AI, computer vision, and full-stack web applications I&apos;ve built.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

export function ProjectDetail({ index }: { index: number }) {
  const [viewMode, setViewMode] = useState<"overview" | "arch">("overview");
  const project = projects[index];
  if (!project) return null;

  return (
    <div className="flex h-full items-center justify-end px-6 sm:px-12 lg:pr-20 lg:pl-[44%]">
      <div className="glass-card group relative w-full max-w-xl rounded-3xl p-7 sm:p-9 text-left overflow-hidden">
        <ReticleCorners />

        {/* Celestial Sector Tag */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3.5">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-primary-light" />
              <span className="font-mono text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">
                {PLANET_NAMES[index]} {'//'} SECTOR {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.06] px-2.5 py-0.5 font-mono text-[10px] text-primary-light">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span>{PROJECT_TELEMETRY[index] || "ORBITAL STAGE"}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Title & Github Action */}
        <ScrollReveal delay={0.06}>
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {project.title}
              </h3>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1 text-xs font-medium text-slate-200 transition-all hover:border-white/30 hover:bg-white/[0.08]"
                >
                  <Github size={13} />
                  Github repo link
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Mode Tabs (Overview | Architecture Pipeline) */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 text-xs">
          <button
            onClick={() => setViewMode("overview")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition-all cursor-pointer ${
              viewMode === "overview"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText size={11} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setViewMode("arch")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition-all cursor-pointer ${
              viewMode === "arch"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-400 hover:text-violet-300"
            }`}
          >
            <Layers size={11} />
            <span>Architecture Pipeline</span>
          </button>
        </div>

        {/* Tab 1: Standard Overview View */}
        {viewMode === "overview" && (
          <>
            <ScrollReveal delay={0.10}>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                {project.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge group gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25"
                  >
                    <ExternalLink size={13} />
                    Live Demo
                  </a>
                )}
              </div>
            </ScrollReveal>
          </>
        )}

        {/* Tab 2: System Architecture Pipeline */}
        {viewMode === "arch" && (
          <ProjectArchitectureXRay index={index} />
        )}
      </div>
    </div>
  );
}
