"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { personalInfo } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";
import { MapPin, Sparkles } from "lucide-react";

function AnimatedCounter({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(ref.current, {
        y: 25,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 92%",
        },
      });
    },
    { scope: ref }
  );

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-galaxy-darker/60 p-5 text-center transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
    >
      <span className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {value}
      </span>
      <span className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
        {label}
      </span>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/5 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

export default function About() {
  return (
    <section className="section-padding relative">
      <SectionDivider />
      <div className="mx-auto max-w-5xl">
        {/* Section Telemetry Header */}
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary-light uppercase">
              {"01 // BIOGRAPHY"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText
            as="h2"
            className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            About Me
          </GradientText>
        </ScrollReveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Bio Column */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
                {personalInfo.bio}
              </p>
            </ScrollReveal>

            {/* Location & Academic Badges */}
            <ScrollReveal delay={0.25}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="badge gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs text-slate-300">
                  <MapPin size={13} className="text-primary-light" />
                  <span>
                    Based in{" "}
                    <span className="font-medium text-white">
                      {personalInfo.location}
                    </span>
                  </span>
                </div>
                <div className="badge gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs text-slate-300">
                  <Sparkles size={13} className="text-secondary" />
                  <span>Synergy Institute of Engineering & Technology</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3.5">
              {personalInfo.stats.map((stat, i) => (
                <AnimatedCounter
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
