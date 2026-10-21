"use client";

import {
  Github,
  Linkedin,
  Mail,
  Download,
  Instagram,
  Globe,
  MapPin,
  FileText,
  Radio,
} from "lucide-react";
import { personalInfo } from "@/lib/constants";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactForm from "./ContactForm";

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  portfolio: Globe,
  mail: Mail,
};

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-32 md:pb-20 xl:px-16"
    >
      <SectionDivider />

      {/* Atmospheric Nebula Glow & Star Dust */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-cyan-500/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/[0.04] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Asymmetrical Two-Column Futuristic Layout */}
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Direct Inquiries & Telemetry Info Cards (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* 1. Contact Introduction & 2. Available for Work Status */}
            <div>
              {/* Telemetry Tag */}
              <ScrollReveal>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.04] px-3.5 py-1.5 backdrop-blur-md">
                  <Radio size={13} className="text-cyan-400 animate-pulse" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                    {"05 // GET IN TOUCH"}
                  </span>
                </div>
              </ScrollReveal>

              {/* Heading */}
              <ScrollReveal delay={0.05}>
                <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.12]">
                  Get in Touch &mdash;{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-primary-light to-cyan-300">
                    Let&apos;s Work Together
                  </span>
                </h2>
              </ScrollReveal>

              {/* Short Introduction */}
              <ScrollReveal delay={0.1}>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
                  Have an exciting project, an internship opportunity, or a question? Feel free to send a message or reach out directly.
                </p>
              </ScrollReveal>

              {/* Status Badge */}
              <ScrollReveal delay={0.12}>
                <div className="mt-4 flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
                    Available for work &bull; Dhenkanal, India
                  </span>
                </div>
              </ScrollReveal>
            </div>

            {/* Info Cards with consistent spacing */}
            <div className="space-y-3.5">
              {/* 3. Primary Direct Channel — email card */}
              <ScrollReveal delay={0.15}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-4.5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/35 hover:bg-white/[0.04] hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-400 transition-colors group-hover:border-cyan-400/50 group-hover:bg-cyan-400/20">
                      <Mail size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Direct Email
                      </span>
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="mt-0.5 block truncate font-mono text-sm font-semibold text-white transition-colors hover:text-cyan-300"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* 4. Operational Base — location card */}
              <ScrollReveal delay={0.18}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-4.5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/35 hover:bg-white/[0.04] hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-400 transition-colors group-hover:border-sky-400/50 group-hover:bg-sky-400/20">
                      <MapPin size={17} />
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Location
                      </span>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        {personalInfo.location}
                      </p>
                      <span className="mt-0.5 block font-mono text-[10px] text-slate-400">
                        Odisha, India
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* 5. Documented Dossier — CV/PDF card */}
              <ScrollReveal delay={0.21}>
                <a
                  href={personalInfo.cvUrl || "/Smruti_Ranjan_Nayak_CV.pdf"}
                  download
                  className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-4.5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/35 hover:bg-white/[0.04] hover:shadow-[0_0_25px_rgba(56,189,248,0.12)]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-400 transition-colors group-hover:border-cyan-400/50 group-hover:bg-cyan-400/20">
                      <FileText size={17} />
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Resume
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-white transition-colors group-hover:text-cyan-300">
                        Curriculum Vitae (PDF)
                      </span>
                    </div>
                  </div>
                  <Download
                    size={15}
                    className="text-slate-400 transition-all duration-200 group-hover:translate-y-0.5 group-hover:text-cyan-300"
                  />
                </a>
              </ScrollReveal>

              {/* 6. Connected Networks card */}
              <ScrollReveal delay={0.24}>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-4.5 backdrop-blur-xl">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Social Profiles
                  </span>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                    {personalInfo.socials.map((social) => {
                      const Icon = iconMap[social.icon] || Mail;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target={
                            social.url.startsWith("mailto")
                              ? undefined
                              : "_blank"
                          }
                          rel="noopener noreferrer"
                          className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                          aria-label={social.name}
                        >
                          <Icon
                            size={15}
                            className="text-slate-300 transition-colors group-hover:text-cyan-300"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Column: Premium Glassmorphism Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.15}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
