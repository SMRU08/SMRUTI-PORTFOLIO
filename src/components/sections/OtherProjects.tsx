"use client";

import {
  ExternalLink,
  Github,
  GraduationCap,
  Award,
  Briefcase,
  Layers,
} from "lucide-react";
import {
  otherProjects,
  education,
  certifications,
  internship,
} from "@/lib/constants";
import GlassCard from "@/components/ui/GlassCard";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function OtherProjects() {
  return (
    <div className="section-padding">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary-light uppercase">
              03 // REPERTORY & CREDENTIALS
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText
            as="h2"
            className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            More Projects & Experience
          </GradientText>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            A comprehensive record of hackathon developments, client architectures, academic achievements, and industry certifications.
          </p>
        </ScrollReveal>

        {/* Practical Projects Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.05}>
              <GlassCard className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono tracking-wider uppercase">
                      ARCHIVE // {String(i + 1).padStart(2, "0")}
                    </span>
                    <Layers size={14} className="text-primary-light opacity-60" />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-white">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.08]"
                      >
                        <Github size={12} />
                        Github repo link
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-primary"
                      >
                        <ExternalLink size={12} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Education & Academic Journey */}
        <div className="mt-20">
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-3">
              <GraduationCap className="text-primary-light" size={22} />
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                Education & Academic Milestones
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Formal engineering foundation in Computer Science & Applied Mathematics.
            </p>
          </ScrollReveal>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {education.map((edu, idx) => (
              <ScrollReveal key={edu.degree} delay={idx * 0.08}>
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-galaxy-darker/60 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.02]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold text-primary-light">
                        {edu.period}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                        {edu.grade}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-white">
                      {edu.degree}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {edu.institution}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Internship Highlight Banner */}
          <ScrollReveal delay={0.15}>
            <div className="mt-6 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-galaxy-dark/40 to-galaxy-darker/60 p-6 backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary-light">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-light">
                        CTTC BHUBANESWAR // {internship.period}
                      </span>
                    </div>
                    <h4 className="mt-1 font-display text-base font-bold text-white">
                      {internship.role}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-300">
                      {internship.company} — Capstone:{" "}
                      <span className="font-semibold text-white">
                        {internship.finalProject}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:max-w-xs">
                  {internship.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Certifications Section */}
        <div className="mt-20">
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-3">
              <Award className="text-secondary" size={22} />
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                Professional Certifications
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Verified certifications across Machine Learning, Big Data, and Cybersecurity from Coursera, Google, IBM, UMich & UC San Diego.
            </p>
          </ScrollReveal>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, idx) => (
              <ScrollReveal key={cert.title} delay={idx * 0.035}>
                <div className="group flex h-full flex-col justify-between rounded-xl border border-white/[0.07] bg-galaxy-darker/50 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-medium text-slate-400">
                        {cert.issuer}
                      </span>
                      <span className="text-slate-400">{cert.date}</span>
                    </div>
                    <h4 className="mt-2 text-sm font-medium text-white transition-colors group-hover:text-primary-light">
                      {cert.title}
                    </h4>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
