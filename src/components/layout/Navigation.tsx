"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const lenis = useLenis();

  // Scroll progress bar with smooth spring damping
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 220) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el && lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    }
  };

  return (
    <>
      {/* Cinematic Top Telemetry Line */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-secondary to-primary-light"
        style={{ scaleX }}
      />

      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-3 py-1.5 transition-all duration-500",
          isScrolled
            ? "glass shadow-2xl shadow-black/60 border border-white/[0.08]"
            : "bg-galaxy-darker/40 backdrop-blur-md border border-white/[0.05]"
        )}
      >
        {/* Desktop Navigation */}
        <div className="flex items-center gap-1">
          {/* Brand Mark */}
          <div className="hidden items-center gap-2 pl-3 pr-2 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-display text-xs font-bold tracking-widest text-white/90">
              {personalInfo.brand}
            </span>
            <span className="mx-1 h-3 w-px bg-white/10" />
          </div>

          <ul className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    aria-label={`Navigate to ${link.label} section`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.12] shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center justify-between gap-3 px-1 md:hidden">
            <span className="font-display text-xs font-bold tracking-widest text-white/90">
              {personalInfo.brand}
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2 }}
              id="mobile-nav-menu"
              className="glass-card absolute top-full left-1/2 mt-3 -translate-x-1/2 rounded-2xl p-2.5 shadow-2xl"
            >
              <ul className="flex min-w-[200px] flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => scrollTo(link.href)}
                        className={cn(
                          "w-full rounded-xl px-4 py-2.5 text-left text-xs font-medium tracking-wide transition-all",
                          isActive
                            ? "bg-white/10 text-white font-semibold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {link.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
