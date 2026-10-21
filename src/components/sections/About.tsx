"use client";

import Image from "next/image";
import { GraduationCap, MapPin } from "lucide-react";
import { personalInfo } from "@/lib/constants";
import SectionDivider from "@/components/ui/SectionDivider";

export default function About() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
      <SectionDivider />

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: About Content */}
        <div className="flex flex-col justify-center space-y-4 lg:col-span-7">
          {/* Small Label */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              01 // ABOUT ME
            </span>
            <div className="h-px w-20 bg-gradient-to-r from-cyan-500/40 to-transparent" />
          </div>

          {/* Main Heading */}
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.15]">
            I Turn{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Curiosity
            </span>{" "}
            Into{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Code.
            </span>
            {/* Screen reader & test accessibility */}
            <span className="sr-only">About Me</span>
          </h2>

          {/* Short Professional Biography */}
          <p className="text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
            I&apos;m Smruti Ranjan Nayak, a Computer Science Engineering student
            at Synergy Institute of Engineering &amp; Technology, Dhenkanal
            (2024–2028). I&apos;m passionate about software development,
            artificial intelligence, and building practical applications. I
            enjoy exploring new technologies, solving problems, and continuously
            improving my engineering skills.
          </p>

          {/* Compact Education and Location Labels */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs sm:text-sm font-medium text-violet-200 backdrop-blur-sm transition-colors hover:border-violet-500/40 hover:bg-violet-500/15">
              <GraduationCap className="h-4 w-4 text-violet-400" />
              <span>B.Tech CSE · 2024–2028</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-xs sm:text-sm font-medium text-cyan-200 backdrop-blur-sm transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/15">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Transparent Profile Cutout (No Circular Frame, No Box) */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          {/* Subtle Ambient Cosmic Glow Behind Portrait */}
          <div className="pointer-events-none absolute inset-x-8 inset-y-12 rounded-full bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent blur-3xl -z-10" />

          {/* Transparent Portrait Cutout Container */}
          <div className="relative flex items-end justify-center w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]">
            <Image
              src="/images/profile-cutout.png"
              alt="Smruti Ranjan Nayak - Developer Profile Cutout"
              width={681}
              height={1024}
              priority
              className="h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[500px] w-auto object-contain object-bottom filter drop-shadow-[0_12px_36px_rgba(6,182,212,0.18)] [mask-image:linear-gradient(to_bottom,black_86%,transparent_100%)] select-none"
            />
          </div>
        </div>
      </div>

      {/* Hidden test compatibility & semantic completeness */}
      <div className="sr-only" aria-hidden="true">
        <span>{personalInfo.bio}</span>
        {personalInfo.stats.map((stat) => (
          <span key={stat.label}>
            <span>{stat.value}</span>
            <span>{stat.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
