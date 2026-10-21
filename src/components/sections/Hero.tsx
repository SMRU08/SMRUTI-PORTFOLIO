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
      const tl = gsap.timeline({ delay: 0.15 });
      const SAFETY_SELECTORS =
        ".hero-heading, .hero-title, .hero-tagline, .hero-desc, .hero-cta-btn, .hero-scroll, .hero-decoration";

      tl.from(".hero-heading", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          ".hero-title",
          {
            y: 18,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-tagline",
          {
            y: 14,
            opacity: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .from(
          ".hero-desc",
          {
            y: 14,
            opacity: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .from(
          ".hero-cta-btn",
          {
            y: 16,
            scale: 0.96,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: 0.1,
          },
          "-=0.3"
        )
        .from(
          ".hero-scroll",
          {
            y: -6,
            opacity: 0,
            duration: 0.55,
          },
          "-=0.2"
        )
        .from(
          ".hero-decoration",
          {
            scale: 0.6,
            opacity: 0,
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

  return (
    <section
      ref={containerRef}
      className="relative flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-6 text-center select-none overflow-hidden"
    >
      {/* Deep Space Vignette Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#03050c_85%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#03050c]/50 via-transparent to-[#03050c]" />

      {/* Atmospheric Nebula Wisps */}
      <div className="hero-decoration pointer-events-none absolute left-[12%] top-[20%] h-52 w-52 rounded-full bg-violet-600/10 blur-[110px]" />
      <div className="hero-decoration pointer-events-none absolute right-[14%] top-[25%] h-44 w-44 rounded-full bg-cyan-500/10 blur-[95px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
        {/* 1. Main Heading: Smruti Ranjan Nayak */}
        <h1 className="hero-heading font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] drop-shadow-[0_4px_28px_rgba(255,255,255,0.12)]">
          <span className="bg-gradient-to-b from-white via-slate-100 to-cyan-100/90 bg-clip-text text-transparent">
            {personalInfo.name}
          </span>
        </h1>

        {/* 2. Professional Title */}
        <div className="hero-title mt-3.5 sm:mt-4 flex flex-col items-center gap-2">
          <p className="font-mono text-xs sm:text-sm md:text-base font-semibold tracking-wider text-cyan-400 uppercase">
            {personalInfo.title}
          </p>
        </div>

        {/* 3. Refined Tagline */}
        <div className="hero-tagline mt-3 sm:mt-4">
          <span className="inline-block font-display text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            Learn · Build · Evolve
          </span>
        </div>

        {/* 4. Supporting Description */}
        <p className="hero-desc mx-auto mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 font-normal">
          Crafting intelligent computer vision systems, edge AI applications,
          and modern interactive web experiences.
        </p>

        {/* 5. CTA Buttons */}
        <div className="hero-cta-btn mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
          <MagneticButton
            onClick={scrollToProjects}
            className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-primary hover:bg-primary-light text-white font-display text-xs sm:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all duration-300"
          >
            <span>View My Work</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </MagneticButton>

          <MagneticButton
            onClick={scrollToContact}
            className="h-11 sm:h-12 px-6 sm:px-8 rounded-full border border-white/15 bg-white/[0.04] text-slate-200 hover:border-white/30 hover:bg-white/[0.09] hover:text-white font-display text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 inline-flex items-center"
          >
            <span>Get in Touch</span>
          </MagneticButton>
        </div>

        {/* 6. Scroll to Explore Indicator */}
        <div
          onClick={scrollToProjects}
          className="hero-scroll mt-8 sm:mt-10 lg:mt-12 flex flex-col items-center gap-1.5 opacity-70 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
        >
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-cyan-400" />
          </motion.div>
        </div>
      </div>

      {/* Accessibility & semantic compatibility */}
      <div className="sr-only" aria-hidden="true">
        <span>Available for work</span>
        <span>{personalInfo.subtitle}</span>
      </div>
    </section>
  );
}
