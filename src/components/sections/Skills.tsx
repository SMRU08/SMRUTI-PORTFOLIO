"use client";

import { motion, type Variants } from "framer-motion";
import { Code2, Database, Brain, Sparkles, Cpu } from "lucide-react";
import { skillCategories, currentlyLearning } from "@/lib/constants";
import GradientText from "@/components/ui/GradientText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";

const categoryIcons: Record<string, React.ReactNode> = {
  "AI, Machine Learning & Vision": <Brain size={20} />,
  "Frontend & Mobile": <Code2 size={20} />,
  "Languages & Core Tools": <Database size={20} />,
};

const categoryGradients: Record<string, string> = {
  "AI, Machine Learning & Vision": "from-primary/30 to-transparent",
  "Frontend & Mobile": "from-secondary/30 to-transparent",
  "Languages & Core Tools": "from-amber-400/30 to-transparent",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function Skills() {
  return (
    <section className="section-padding relative">
      <SectionDivider />
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary-light uppercase">
              04 // CAPABILITIES & STACK
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <GradientText
            as="h2"
            className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            Skills & Technologies
          </GradientText>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Engineered proficiency across deep learning architectures, computer vision pipelines, full-stack reactive interfaces, and core computer science fundamentals.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {skillCategories.map((category, catIdx) => {
            const grad =
              categoryGradients[category.name] || "from-primary/30 to-transparent";
            return (
              <ScrollReveal key={category.name} delay={catIdx * 0.1}>
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-galaxy-darker/60 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.02]">
                  {/* Subtle top border illumination */}
                  <div
                    className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${grad} opacity-60 transition-opacity group-hover:opacity-100`}
                  />

                  <div>
                    {/* Category Header */}
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-slate-200">
                        {categoryIcons[category.name] || <Cpu size={18} />}
                      </div>
                      <h3 className="font-display text-base font-bold text-white">
                        {category.name}
                      </h3>
                    </div>

                    {/* Skill Tags */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex flex-wrap gap-2"
                    >
                      {category.skills.map((skill) => (
                        <motion.span
                          key={skill.name}
                          variants={badgeVariants}
                          whileHover={{ scale: 1.04 }}
                          className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-primary/40 hover:text-white"
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Currently Exploring & Expanding */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-galaxy-darker/50 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-secondary" />
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Currently Exploring & Expanding:
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentlyLearning.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-slate-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
