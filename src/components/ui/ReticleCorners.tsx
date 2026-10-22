"use client";

interface ReticleCornersProps {
  className?: string;
}

export default function ReticleCorners({ className = "" }: ReticleCornersProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Top-Left Target Bracket */}
      <div className="absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-primary/25 transition-all duration-300 group-hover:border-primary-light/80 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />

      {/* Top-Right Target Bracket */}
      <div className="absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-primary/25 transition-all duration-300 group-hover:border-primary-light/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

      {/* Bottom-Left Target Bracket */}
      <div className="absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-primary/25 transition-all duration-300 group-hover:border-primary-light/80 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />

      {/* Bottom-Right Target Bracket */}
      <div className="absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-primary/25 transition-all duration-300 group-hover:border-primary-light/80 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
    </div>
  );
}
