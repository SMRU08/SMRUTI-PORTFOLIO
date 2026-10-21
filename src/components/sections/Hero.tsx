"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { personalInfo } from "@/lib/constants";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLenis } from "lenis/react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });
      const SAFETY_SELECTORS =
        ".hero-badge, .hero-title, .hero-subtitle, .hero-cta-btn, .hero-scroll, .hero-decoration";

      tl.from(".hero-badge", {
        scale: 0.85,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".hero-title",
          {
            y: 35,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.45"
        )
        .from(
          ".hero-subtitle",
          {
            y: 25,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-cta-btn",
          {
            y: 20,
            scale: 0.95,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: 0.1,
          },
          "-=0.3"
        )
        .from(
          ".hero-scroll",
          {
            y: -8,
            duration: 0.6,
          },
          "-=0.2"
        )
        .from(
          ".hero-decoration",
          {
            scale: 0.6,
            duration: 1.0,
            ease: "power2.out",
            stagger: 0.12,
          },
          "-=0.6"
        );

      const safetyId = window.setTimeout(() => {
        if (
          typeof tl?.isActive === "function" &&
          !tl.isActive() &&
          typeof tl?.progress === "function" &&
          tl.progress() >= 0.99
        ) {
          return;
        }
        if (typeof gsap?.set === "function") {
          gsap.set(SAFETY_SELECTORS, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            skewY: 0,
            clearProps: "transform",
          });
        }
      }, 5000);

      return () => window.clearTimeout(safetyId);
    },
    { scope: containerRef }
  );

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el && lenis) lenis.scrollTo(el, { offset: -80 });
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el && lenis) lenis.scrollTo(el, { offset: -80 });
  };

  const nameWords = personalInfo.name.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative flex h-full flex-col items-center justify-center px-6 text-center select-none"
    >
      {/* Deep Space Vignette Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#03050c_85%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#03050c]/50 via-transparent to-[#03050c]" />

      {/* Atmospheric Nebula Wisps */}
      <div className="hero-decoration pointer-events-none absolute left-[12%] top-[22%] h-48 w-48 rounded-full bg-primary/10 blur-[100px]" />
      <div className="hero-decoration pointer-events-none absolute right-[15%] top-[28%] h-40 w-40 rounded-full bg-secondary/10 blur-[90px]" />

      <div className="relative z-10 max-w-5xl">
        {/* Status & Telemetry Badge */}
        <div className="hero-badge badge mb-8 gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-md shadow-lg shadow-black/40">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-slate-300 uppercase">
            {personalInfo.brand} {'//'} {personalInfo.experienceTitle}
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="text-xs font-medium text-slate-400">
            Available for work
          </span>
        </div>

        {/* Cinematic Headline with Fluid Split Reveal */}
        <h1 className="overflow-hidden font-display text-5xl font-bold leading-[1.08] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
          {nameWords.map((word, i) => (
            <span key={i} className="hero-name-line inline-block">
              <span className="hero-name">{word}</span>
              {i < nameWords.length - 1 && "\u00A0"}
            </span>
          ))}
        </h1>

        {/* Title with Fine Telemetry Rule */}
        <div className="hero-title mt-6 flex flex-col items-center gap-3">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <p className="font-display text-lg font-medium tracking-wide text-slate-200 sm:text-xl md:text-2xl">
            {personalInfo.title}
          </p>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {personalInfo.subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <div className="hero-cta-btn">
            <MagneticButton onClick={scrollToProjects}>
              View My Work
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </MagneticButton>
          </div>
          <div className="hero-cta-btn">
            <MagneticButton
              onClick={scrollToContact}
              className="border border-white/[0.1] bg-white/[0.02] text-white hover:bg-white/[0.08]"
            >
              Get in Touch
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Orbital Scroll Telemetry Indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100">
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-400">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </div>
    </section>
  );
}
