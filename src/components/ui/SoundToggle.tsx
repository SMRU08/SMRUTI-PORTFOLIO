"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  isSoundEnabled,
  setSoundEnabled,
  playMechanicalClick,
  playHoverTick,
} from "@/lib/sound";

interface SoundToggleProps {
  className?: string;
  compact?: boolean;
}

function subscribe(callback: () => void) {
  window.addEventListener("portfolio-sound-changed", callback);
  return () => window.removeEventListener("portfolio-sound-changed", callback);
}

function getSnapshot(): boolean {
  return isSoundEnabled();
}

function getServerSnapshot(): boolean {
  return false;
}

export default function SoundToggle({ className = "", compact = false }: SoundToggleProps) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input[type='submit']")) {
        playMechanicalClick();
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a")) {
        playHoverTick();
      }
    };

    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [enabled]);

  const toggleSound = () => {
    setSoundEnabled(!enabled);
  };

  return (
    <button
      onClick={toggleSound}
      type="button"
      aria-label={enabled ? "Mute interface sound effects" : "Enable tactical interface sound effects"}
      aria-pressed={enabled}
      title={enabled ? "Sound: ON (Tactical clicks active)" : "Sound: OFF (Click to enable audio feedback)"}
      className={`group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
        enabled
          ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
      } ${className}`}
    >
      {enabled ? (
        <Volume2 size={12} className="text-cyan-400 animate-pulse" />
      ) : (
        <VolumeX size={12} className="text-slate-400 group-hover:text-slate-200" />
      )}
      {!compact && (
        <span className="select-none">
          {enabled ? "AUDIO ON" : "AUDIO OFF"}
        </span>
      )}
    </button>
  );
}
