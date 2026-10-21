// Web Audio API synthesizer for tactical UI feedback
// Zero external assets, 100% synthesized in-memory, muted by default.

let audioCtx: AudioContext | null = null;
let soundEnabled: boolean | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (soundEnabled === null) {
    try {
      soundEnabled = localStorage.getItem("portfolio_sound_enabled") === "true";
    } catch {
      soundEnabled = false;
    }
  }
  return soundEnabled;
}

export function playSwitchTone(enabled: boolean): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;

    osc.type = "sine";
    if (enabled) {
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(940, t + 0.05);
    } else {
      osc.frequency.setValueAtTime(780, t);
      osc.frequency.exponentialRampToValueAtTime(380, t + 0.05);
    }

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.065);
  } catch {
    // Audio failures ignored safely
  }
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("portfolio_sound_enabled", enabled ? "true" : "false");
    } catch {
      // Ignore localStorage permission errors
    }
    window.dispatchEvent(new CustomEvent("portfolio-sound-changed", { detail: { enabled } }));
    playSwitchTone(enabled);
  }
}

export function playMechanicalClick(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const t = ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.018);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.022);
  } catch {
    // Audio failures ignored safely
  }
}

export function playHoverTick(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const t = ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(1500, t);
    osc.frequency.exponentialRampToValueAtTime(750, t + 0.008);

    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.012);
  } catch {
    // Audio failures ignored safely
  }
}
