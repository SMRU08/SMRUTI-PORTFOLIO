"use client";

import { personalInfo, navLinks } from "@/lib/constants";
import { ArrowUp, Github, Linkedin, Instagram, Mail, Globe } from "lucide-react";
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
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
  };

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el && lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    }
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#030614]/90 backdrop-blur-xl">
      {/* Subtle Ambient Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 via-violet-400/30 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8">
        {/* Main Simple Row */}
        <div className="flex flex-col items-center justify-between gap-6 pb-8 border-b border-white/[0.06] md:flex-row">
          {/* Brand & Title */}
          <div className="flex flex-col items-center gap-1.5 text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              <span className="font-display text-sm font-bold tracking-widest text-white">
                {personalInfo.brand}
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="font-mono text-xs text-cyan-400">
                {personalInfo.title}
              </span>
            </div>
            <p className="font-display text-xs tracking-wider text-slate-400 uppercase">
              {personalInfo.tagline}
            </p>
          </div>

          {/* Simple Navigation Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="transition-colors duration-200 hover:text-cyan-400 cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            {personalInfo.socials.map((social) => {
              const Icon = socialIcons[social.icon] || Mail;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                  aria-label={social.name}
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Simple Bottom Row */}
        <div className="pt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>

          <p className="text-slate-400/90 font-mono text-[11px]">
            Built with Next.js, Three.js &amp; GSAP
          </p>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-300 transition-all duration-200 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp
              size={12}
              className="text-cyan-400 transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
