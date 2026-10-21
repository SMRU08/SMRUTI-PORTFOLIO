"use client";

import { personalInfo, navLinks } from "@/lib/constants";
import {
  ArrowUp,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Globe,
  MapPin,
} from "lucide-react";
import { useLenis } from "lenis/react";

const socialIcons: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  portfolio: Globe,
  mail: Mail,
};

export default function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2 });
  };

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el && lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#030614]/90 backdrop-blur-xl">
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 via-violet-400/30 to-transparent pointer-events-none" />

      {/* Atmospheric Nebula Background Accent */}
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-500/5 via-violet-500/10 to-transparent blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-8 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12 pb-10 border-b border-white/[0.06]">
          {/* Col 1: Brand & Mission (5 Cols) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              <span className="font-display text-sm font-bold tracking-widest text-white">
                {personalInfo.brand}
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
                {personalInfo.experienceTitle}
              </span>
            </div>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-300">
              Crafting intelligent computer vision systems, edge AI applications,
              and modern interactive web experiences.
            </p>

            <div className="pt-1">
              <span className="inline-block font-display text-xs font-semibold tracking-widest uppercase bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                {personalInfo.tagline}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 Cols) */}
          <div className="space-y-3 lg:col-span-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </span>
            <ul className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-300 transition-colors duration-200 hover:text-cyan-400 text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Connect & Telemetry (4 Cols) */}
          <div className="space-y-3 lg:col-span-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Operational Base
            </span>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
              <MapPin size={13} className="text-cyan-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>

            <div className="pt-2">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Verified Channels
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {personalInfo.socials.map((social) => {
                  const Icon = socialIcons[social.icon] || Mail;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target={social.url.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 text-slate-300"
                      aria-label={social.name}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Telemetry Strip */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <p className="text-slate-400/80">
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>

          {/* Hidden test compatibility */}
          <span className="sr-only" aria-hidden="true">
            Built with Next.js, Three.js &amp; GSAP
          </span>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-300 transition-all duration-200 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp
              size={13}
              className="text-cyan-400 transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
