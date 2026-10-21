"use client";

import { ExternalLink, Github, Compass } from "lucide-react";
import { projects } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PLANET_NAMES = ["Earth", "Mars", "Jupiter", "Saturn"];

export function ProjectsHeader() {
  return (
    <div className="section-padding pb-0">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary-light uppercase">
              {"02 // CELESTIAL EXHIBITION"}
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
            Four planetary destinations representing flagship systems across industrial AI, offline edge translation, and computer vision.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

export function ProjectDetail({ index }: { index: number }) {
  const project = projects[index];
  if (!project) return null;

  return (
    <div className="flex h-full items-center justify-end px-6 sm:px-12 lg:pr-20 lg:pl-[44%]">
      <div className="glass-card w-full max-w-xl rounded-3xl p-8 sm:p-10 text-left">
        {/* Celestial Sector Tag */}
        <ScrollReveal>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-primary-light" />
              <span className="font-mono text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">
                {PLANET_NAMES[index]} {'//'} SECTOR {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              ORBITAL STAGE
            </span>
          </div>
        </ScrollReveal>

        {/* Title & Github Action */}
        <ScrollReveal delay={0.06}>
          <div className="mt-6">
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

        {/* Description */}
        <ScrollReveal delay={0.12}>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            {project.description}
          </p>
        </ScrollReveal>

        {/* Tech Stack & Live Demo */}
        <ScrollReveal delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
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
      </div>
    </div>
  );
}
