"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";

function NavItem({
  link,
  isActive,
  onClick,
}: {
  link: { label: string; href: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Viscous fluid physics for smooth liquid cursor tracking
  const liquidX = useSpring(mouseX, { stiffness: 280, damping: 24 });
  const liquidY = useSpring(mouseY, { stiffness: 280, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Navigate to ${link.label} section`}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative overflow-hidden rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors duration-200",
        isActive ? "text-white" : "text-slate-400 hover:text-white"
      )}
    >
      {/* Existing Active Highlight Pill */}
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full border border-white/[0.12] bg-white/[0.08] shadow-sm"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 32,
          }}
        />
      )}

      {/* Fluid Liquid Cursor Hover Animation (strictly clipped to this item) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full"
          >
            {/* Primary Liquid Glow Blob */}
            <motion.span
              style={{
                left: liquidX,
                top: liquidY,
              }}
              className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.36)_0%,rgba(139,92,246,0.26)_45%,rgba(59,130,246,0.14)_70%,transparent_100%)] blur-[4px]"
            />
            {/* Viscous Liquid Core Highlight */}
            <motion.span
              style={{
                left: liquidX,
                top: liquidY,
              }}
              className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.42)_0%,rgba(168,85,247,0.22)_60%,transparent_100%)] blur-[2px]"
            />
            {/* Subtle Liquid Perimeter Border Sheen */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/25 bg-gradient-to-r from-cyan-500/[0.08] via-violet-500/[0.08] to-blue-500/[0.08]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisp Foreground Label */}
      <span className="relative z-10 select-none">{link.label}</span>
    </button>
  );
}

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
          {/* Brand Mark (untouched, no liquid effect) */}
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

          {/* Desktop Nav Items with Liquid Cursor Hover Animation */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <NavItem
                    link={link}
                    isActive={isActive}
                    onClick={() => scrollTo(link.href)}
                  />
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
