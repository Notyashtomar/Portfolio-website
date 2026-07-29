"use client";

import {
  FormEvent, useCallback, useEffect, useRef, useState,
} from "react";
import {
  AnimatePresence, motion,
  useMotionValue, useSpring, useTransform,
} from "framer-motion";
import { Download, ArrowRight, Send } from "lucide-react";
import { profile } from "@/data/resume";

/* ── Brand icons (inline SVG, currentColor-driven) ── */
function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M4 6.5 12 13l8-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01a1.1 1.1 0 0 0-.79.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.63.72.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12c0 1.75.46 3.44 1.32 4.93L2 22l5.19-1.3A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm0 18.22a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.78.83-3.04-.2-.31A8.21 8.21 0 1 1 20.21 12 8.22 8.22 0 0 1 12 20.22Z"
      />
    </svg>
  );
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.11 20.45H3.56V9h3.55v11.45Z" />
    </svg>
  );
}
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════ */

/** Scrambles text on mount, character by character. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
function ScrambleText({ text, trigger, className }: { text: string; trigger: boolean; className?: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const total = 28;
    const id = setInterval(() => {
      frame++;
      setOut(
        text.split("").map((ch, i) => {
          if (ch === " " || ch === "\n") return ch;
          if (frame / total > i / text.length) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join(""),
      );
      if (frame >= total) clearInterval(id);
    }, 88);
    return () => clearInterval(id);
  }, [text, trigger]);
  return <span className={className}>{out}</span>;
}

/** Live clock. */
function TerminalClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () => setT(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums text-accent-blue/55">{t}</span>;
}

/** Animated dot‑grid background. */
function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(79,140,255,0.8) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/** Pulsing radial ring that emanates from center. */
function PulseRing({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-accent-blue/12"
      style={{ translateX: "-50%", translateY: "-50%" }}
      initial={{ width: 100, height: 100, opacity: 0.6 }}
      animate={{ width: 900, height: 900, opacity: 0 }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/** Signal-strength bars (0–1). */
function SignalMeter({ strength }: { strength: number }) {
  const bars = 5;
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 18 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 5 + (i / (bars - 1)) * 13;
        const lit = strength >= (i + 1) / bars;
        const col = i < 2 ? "#ef4444" : i < 4 ? "#f59e0b" : "#22c55e";
        return (
          <motion.div
            key={i}
            className="w-[4px] rounded-sm"
            style={{ height: h }}
            animate={{ backgroundColor: lit ? col : "rgba(255,255,255,0.1)", opacity: lit ? 1 : 0.28 }}
            transition={{ duration: 0.25 }}
          />
        );
      })}
    </div>
  );
}

/** 3-D tilt wrapper — follows cursor. */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 22 });
  const sry = useSpring(ry, { stiffness: 150, damping: 22 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    ry.set(nx * 14);
    rx.set(-ny * 10);
  }, [rx, ry]);
  const onLeave = useCallback(() => { rx.set(0); ry.set(0); }, [rx, ry]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Status badge with pulsing dot. */
function StatusBadge({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-accent-blue"}`}
        animate={active ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/30">{label}</span>
      <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/65">{value}</span>
    </div>
  );
}

/** Magnetic link that physically shifts toward the cursor. */
function MagLink({ href, children, className, external }: { href: string; children: React.ReactNode; className?: string; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 22 });
  const sy = useSpring(y, { stiffness: 300, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      data-cursor="interactive"
    >
      {children}
    </motion.a>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export function Contact() {
  const sectionRef   = useRef<HTMLElement>(null);
  const [inView, setInView]   = useState(false);
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [nameVal, setNameVal] = useState("");
  const [msgVal, setMsgVal]   = useState("");

  /* Signal strength: increases as user fills the form */
  const formStrength = Math.min(1,
    (nameVal.length > 0 ? 0.3 : 0) +
    (nameVal.length > 3 ? 0.2 : 0) +
    (msgVal.length > 0 ? 0.2 : 0) +
    (msgVal.length > 20 ? 0.3 : 0),
  );

  /* Trigger scramble once in view */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.2 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data   = new FormData(e.currentTarget);
    const name   = String(data.get("name") || "");
    const message = String(data.get("message") || "");
    const sub    = encodeURIComponent(`Portfolio inquiry from ${name || "visitor"}`);
    const body   = encodeURIComponent(message);
    setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${sub}&body=${body}`;
      setSending(false);
      setSent(true);
    }, 1400);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      {/* ── Background layers ── */}
      <DotGrid />
      <PulseRing delay={0} />
      <PulseRing delay={2} />
      <PulseRing delay={4} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_80%,rgba(79,140,255,0.07),transparent)]" />

      <div className="relative mx-auto max-w-[90rem]">

        {/* ── System bar ── */}
        <motion.div
          className="mb-10 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 sm:mb-14"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="section-num">05 / CONTACT</span>
            <StatusBadge label="Signal"  value="Active"       active />
            <StatusBadge label="Status"  value="Open to work" active />
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/25">SYS · </span>
            <TerminalClock />
          </div>
        </motion.div>

        {/* ── Scramble headline ── */}
        <div className="mb-14 sm:mb-20">
          <motion.h2
            className="max-w-5xl text-[clamp(2.2rem,6.5vw,5.5rem)] font-semibold leading-[1.03] text-white"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <ScrambleText text="Let's build the next" trigger={inView} />
            <br />
            <span className="text-accent-blue">
              <ScrambleText text="decision system." trigger={inView} />
            </span>
          </motion.h2>
          {/* Underline scan */}
          <motion.div
            className="mt-4 h-px bg-gradient-to-r from-accent-blue/60 via-accent-violet/40 to-transparent"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* ── Two columns ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">

          {/* LEFT — Contact channels + status */}
          <div className="space-y-4">

            {/* Email */}
            {[
              { href: `mailto:${profile.email}`, icon: <GmailIcon className="h-5 w-5" />, label: "Email", value: profile.email, color: "#ea4335", external: false },
              { href: `tel:${profile.phone.replace(/\s/g,"")}`, icon: <PhoneIcon className="h-5 w-5" />, label: "Phone", value: profile.phone, color: "#8b5cf6", external: false },
              { href: `https://wa.me/919311973552?text=${encodeURIComponent("Hi Yash, I came across your portfolio and would like to connect!")}`, icon: <WhatsAppIcon className="h-5 w-5" />, label: "WhatsApp", value: "+91 93119 73552", color: "#25d366", external: true },
              { href: profile.linkedin, icon: <LinkedInIcon className="h-5 w-5" />, label: "LinkedIn", value: "yashraj-s-tomar200114", color: "#0a66c2", external: true },
            ].map(({ href, icon, label, value, color, external }, i) => (
              <motion.div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#05070d]"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ borderColor: `${color}40` }}
              >
                {/* Animated top glow on hover */}
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                />
                <MagLink href={href} external={external} className="flex items-center gap-4 p-5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
                    style={{
                      borderColor: `${color}25`,
                      backgroundColor: `${color}10`,
                      color: color,
                    }}
                  >
                    {icon}
                  </span>
                  <span>
                    <span className="font-sans block text-[9px] uppercase tracking-[0.28em] text-muted mb-1">{label}</span>
                    <span className="font-body text-white/80 transition-colors duration-300 group-hover:text-white">{value}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-white/15 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60" />
                </MagLink>
              </motion.div>
            ))}

            {/* Download resume */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.55 }}
            >
              <MagLink
                href={profile.resumeFile}
                className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-white/15 bg-white px-6 py-4 font-sans text-sm font-semibold tracking-wide text-black transition hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-15deg] bg-gradient-to-r from-transparent via-black/8 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                />
                <Download className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                Download Resume
              </MagLink>
            </motion.div>

            {/* Availability widget */}
            <motion.div
              className="rounded-2xl border border-white/6 bg-[#05070d] p-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <p className="font-sans text-[9px] uppercase tracking-[0.32em] text-white/25 mb-4">
                System · Availability
              </p>
              <div className="space-y-2.5">
                <StatusBadge label="Full-time"   value="Open"              active />
                <StatusBadge label="Freelance"   value="Open"              active />
                <StatusBadge label="Location"    value="New Delhi / Remote"       />
                <StatusBadge label="Timezone"    value="IST (UTC+5:30)"          />
              </div>

              {/* Uptime bar */}
              <div className="mt-4">
                <div className="flex justify-between mb-1.5">
                  <span className="font-sans text-[8px] uppercase tracking-[0.28em] text-white/20">Response Rate</span>
                  <span className="font-sans text-[8px] text-emerald-400/80">100%</span>
                </div>
                <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-accent-blue"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Terminal form with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#05070d]">
              {/* Holographic shimmer border */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(135deg, rgba(79,140,255,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(255,61,154,0.08) 100%)",
                }}
              />

              {/* Terminal title bar */}
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
                <div className="flex items-center gap-2">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <motion.span
                      key={c}
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: c }}
                      whileHover={{ scale: 1.3 }}
                    />
                  ))}
                  <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
                    contact.sh — bash
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <SignalMeter strength={formStrength} />
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {/* Animated typewriter prompt */}
                <motion.div
                  className="mb-6 font-mono text-[11px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TypewriterLine />
                </motion.div>

                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Name field */}
                  <ScanField
                    id="name"
                    label="--name"
                    placeholder="Your full name"
                    type="input"
                    value={nameVal}
                    onChange={setNameVal}
                    focused={focused === "name"}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                  />

                  {/* Message field */}
                  <ScanField
                    id="message"
                    label="--message"
                    placeholder="Tell me about your project or opportunity..."
                    type="textarea"
                    value={msgVal}
                    onChange={setMsgVal}
                    focused={focused === "message"}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    maxLength={400}
                  />

                  {/* Submit button */}
                  <MorphButton sending={sending} sent={sent} />

                  {/* Footer */}
                  <p className="font-mono text-[9px] text-white/18">
                    <span className="text-emerald-400">✓</span> Encryption: TLS 1.3 · Routed via mailto protocol
                  </p>
                </form>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */

/** Types out the terminal prompt char by char. */
function TypewriterLine() {
  const full = "~/portfolio $ send_message --to yashtomar142001";
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(id);
    }, 95);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-white/30">
      <span className="text-emerald-400">~/portfolio</span>
      <span className="text-white/45"> $ </span>
      <span className="text-accent-blue">
        {text.includes("$") ? text.split("$ ")[1]?.split(" --")[0] : ""}
      </span>
      <span className="text-white/40">
        {text.includes("--") ? " " + text.split("--").slice(1).map((s) => "--" + s).join("") : ""}
      </span>
      <motion.span
        className="inline-block w-[7px] h-[13px] bg-accent-blue/80 ml-0.5 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      />
    </span>
  );
}

/** Input/textarea with animated scan line on focus + character counter ring. */
function ScanField({
  id, label, placeholder, type, value, onChange,
  focused, onFocus, onBlur, rows, maxLength,
}: {
  id: string; label: string; placeholder: string;
  type: "input" | "textarea"; value: string;
  onChange: (v: string) => void; focused: boolean;
  onFocus: () => void; onBlur: () => void;
  rows?: number; maxLength?: number;
}) {
  const pct = maxLength ? value.length / maxLength : 0;
  const r = 10, circ = 2 * Math.PI * r;

  return (
    <div className="relative">
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="font-mono text-[10px] text-white/30">
          <span className="text-accent-blue"># </span>{label}
          <AnimatePresence>
            {focused && (
              <motion.span
                key="cursor"
                className="ml-0.5 inline-block h-[11px] w-[5px] bg-accent-blue/80 align-middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
              />
            )}
          </AnimatePresence>
        </label>
        {maxLength && (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8px] text-white/20 tabular-nums">
              {value.length}/{maxLength}
            </span>
            <svg width="24" height="24" className="-rotate-90">
              <circle cx="12" cy="12" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <motion.circle
                cx="12" cy="12" r={r}
                fill="none"
                stroke={pct > 0.85 ? "#ef4444" : "#4f8cff"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ * (1 - pct) }}
                transition={{ duration: 0.2 }}
              />
            </svg>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-colors duration-300"
        style={{ borderColor: focused ? "rgba(79,140,255,0.45)" : undefined,
                 boxShadow: focused ? "0 0 28px rgba(79,140,255,0.10)" : undefined }}
      >
        {/* Animated scan line */}
        <AnimatePresence>
          {focused && (
            <motion.div
              className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent"
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "100%", "0%"] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {type === "input" ? (
          <input
            id={id}
            name={id}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/18 font-body"
          />
        ) : (
          <textarea
            id={id}
            name={id}
            required
            rows={rows ?? 5}
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/18 font-body"
          />
        )}
      </div>
    </div>
  );
}

/** Submit button that morphs: idle → sending → sent. */
function MorphButton({ sending, sent }: { sending: boolean; sent: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={sending || sent}
      data-cursor="interactive"
      whileHover={!sending && !sent ? { scale: 1.02 } : {}}
      whileTap={!sending && !sent ? { scale: 0.97 } : {}}
      className="relative w-full overflow-hidden rounded-xl px-6 py-4 font-sans text-sm font-semibold tracking-wide text-white"
      animate={{
        backgroundColor: sent
          ? "#22c55e"
          : sending
          ? "#1d4ed8"
          : "#4f8cff",
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Shimmer sweep */}
      {!sent && (
        <motion.div
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/15"
          animate={{ x: ["-100%", "220%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
        />
      )}

      {/* Sending: progress bar */}
      {sending && (
        <motion.div
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-white/40"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />
      )}

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.span
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 0.5 }}>✓</motion.span>
            Message Transmitted
          </motion.span>
        ) : sending ? (
          <motion.span
            key="sending"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
              ⟳
            </motion.span>
            Transmitting…
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            Execute · Send Message
            <Send className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
