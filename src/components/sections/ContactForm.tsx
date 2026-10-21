"use client";

import { useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import {
  validateContactForm,
  type ContactFieldErrors,
} from "@/lib/contact-validation";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const inputBaseClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-400/20 focus:shadow-[0_0_25px_rgba(56,189,248,0.12)] disabled:cursor-not-allowed disabled:opacity-50";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<ContactFieldErrors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl).entries());
    const result = validateContactForm(data);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        details?: Record<string, string[]>;
      };

      if (!res.ok) {
        if (json.details) setErrors(json.details as ContactFieldErrors);
        setStatus({
          kind: "error",
          message: json.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      formEl.reset();
      setStatus({ kind: "ok" });
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Please try again or email directly.",
      });
    }
  }

  if (status.kind === "ok") {
    return (
      <div
        role="status"
        className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#040816]/80 p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_40px_rgba(56,189,248,0.15)] backdrop-blur-2xl sm:p-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
            <CheckCircle2 className="text-cyan-400" size={28} />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
            Transmission Received
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-300">
            Message sent — thanks! Your inquiry has been routed to my primary inbox and I&apos;ll get back to you promptly.
          </p>
          <button
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
            className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white"
          >
            <span>Send another</span>
            <Sparkles size={13} className="text-cyan-400 transition-transform group-hover:rotate-12" />
          </button>
        </div>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-[#040816]/75 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-500 hover:border-cyan-500/25 sm:p-9">
      {/* Subtle corner crosshairs */}
      <span className="pointer-events-none absolute -top-1.5 -left-1.5 font-mono text-xs font-bold text-cyan-400/30">+</span>
      <span className="pointer-events-none absolute -top-1.5 -right-1.5 font-mono text-xs font-bold text-cyan-400/30">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 font-mono text-xs font-bold text-cyan-400/30">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 font-mono text-xs font-bold text-cyan-400/30">+</span>

      {/* Top telemetry status line */}
      <div className="mb-6 flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-400">
            TRANSMISSION PORTAL
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          TLS ENCRYPTED
        </span>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5 text-left"
        aria-label="Contact form"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-300"
            >
              <span>Name</span>
              <span className="text-cyan-400">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={sending}
              className={inputBaseClass}
              placeholder="Ada Lovelace"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && (
              <p id="contact-name-error" className="mt-1.5 text-xs text-red-400">
                {errors.name[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-300"
            >
              <span>Email</span>
              <span className="text-cyan-400">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={sending}
              className={inputBaseClass}
              placeholder="ada@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email && (
              <p id="contact-email-error" className="mt-1.5 text-xs text-red-400">
                {errors.email[0]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-300"
          >
            <span>Message</span>
            <span className="text-cyan-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={sending}
            className={`${inputBaseClass} resize-y min-h-[120px]`}
            placeholder="Tell me about your project, idea, or just say hi…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-1.5 text-xs text-red-400">
              {errors.message[0]}
            </p>
          )}
        </div>

        {/* Honeypot field for anti-spam */}
        <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-website">Leave this empty</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {status.kind === "error" && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
            <span>{status.message}</span>
          </div>
        )}

        {/* Glowing Futuristic Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={sending}
            className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-primary to-blue-600 px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
          >
            <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <span>Send message</span>
                <Send
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
