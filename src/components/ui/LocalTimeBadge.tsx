"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function LocalTimeBadge({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string>("");
  const [isDay, setIsDay] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(istString);

      const istHours = parseInt(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          hour12: false,
        }),
        10
      );
      setIsDay(istHours >= 6 && istHours < 18);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-slate-400 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>IST</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-2.5 py-0.5 font-mono text-[10px] text-cyan-200 backdrop-blur-sm ${className}`}
      title={`Current local time in Dhenkanal, India (IST): ${time}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      {isDay ? (
        <Sun size={11} className="text-amber-400 shrink-0" />
      ) : (
        <Moon size={11} className="text-cyan-300 shrink-0" />
      )}
      <span className="tracking-wide font-medium">{time} IST</span>
    </span>
  );
}
