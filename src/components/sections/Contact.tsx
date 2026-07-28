"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Download, Mail, Phone, ExternalLink, ArrowRight } from "lucide-react";
import { profile } from "@/data/resume";

/* ── Animated terminal clock ── */
function TerminalClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono tabular-nums text-accent-blue/70">{time}</span>
  );
}

/* ── Animated background data streams ── */
function DataStreams() {
  const cols = [12, 25, 38, 55, 68, 82];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {cols.map((left, i) => (
        <motion.div
          key={left}
          className="absolute top-0 w-px"
          style={{ left: `${left}%`, height: "100%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.06, 0.12, 0.06, 0] }}
          transition={{ delay: i * 0.4, duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(to bottom, transparent, rgba(79,140,255,0.35) ${20 + i * 5}%, rgba(139,92,246,0.2) ${50 + i * 4}%, transparent)`,
            }}
          />
        </motion.div>
      ))}
      {/* Horizontal scan lines */}
      {[0, 1, 2].map((k) => (
        <motion.div
          key={k}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/10 to-transparent"
          initial={{ top: "10%" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 8 + k * 2, delay: k * 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── Magnetic link ── */
function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 20 });
  const sy = useSpring(y, { stiffness: 280, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
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

/* ── Blinking cursor ── */
function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      className="inline-block w-0.5 h-4 bg-accent-blue align-middle ml-0.5"
    />
  );
}

/* ── Status badge ── */
function StatusBadge({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-accent-blue"}`}
        animate={active ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/35">{label}</span>
      <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/70">{value}</span>
    </div>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "visitor"}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(79,140,255,0.07),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.07),transparent_55%)]" />
      <DataStreams />

      <div className="relative mx-auto max-w-[90rem]">
        {/* System header bar */}
        <motion.div
          className="mb-10 flex items-center justify-between border border-white/8 rounded-xl px-4 py-3 bg-white/[0.02] sm:mb-14"
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-6">
            <span className="section-num">05 / CONTACT</span>
            <StatusBadge label="Signal" value="Active" active />
            <StatusBadge label="Status" value="Open to work" active />
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/30">SYS · </span>
            <TerminalClock />
          </div>
        </motion.div>

        {/* Big headline */}
        <motion.h2
          className="mb-12 max-w-4xl text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] text-white sm:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&apos;s build the next
          <br />
          <span className="text-accent-blue">decision system.</span>
          <Cursor />
        </motion.h2>

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* ── Left: contact channels ── */}
          <div className="space-y-4">
            {/* Email */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#05070d] p-5 transition-colors hover:border-accent-blue/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <MagneticLink
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-blue/20 bg-accent-blue/10 text-accent-blue transition group-hover:border-accent-blue/50 group-hover:bg-accent-blue/20">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="font-sans block text-[9px] uppercase tracking-[0.28em] text-muted mb-1">
                    Email
                  </span>
                  <span className="font-body text-white group-hover:text-accent-blue transition-colors">
                    {profile.email}
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition group-hover:text-accent-blue group-hover:translate-x-1" />
              </MagneticLink>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#05070d] p-5 transition-colors hover:border-accent-violet/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.07 }}
            >
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet/50 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <MagneticLink
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-violet/20 bg-accent-violet/10 text-accent-violet transition group-hover:border-accent-violet/50 group-hover:bg-accent-violet/20">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="font-sans block text-[9px] uppercase tracking-[0.28em] text-muted mb-1">
                    Phone
                  </span>
                  <span className="font-body text-white group-hover:text-accent-violet transition-colors">
                    {profile.phone}
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition group-hover:text-accent-violet group-hover:translate-x-1" />
              </MagneticLink>
            </motion.div>

            {/* LinkedIn */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#05070d] p-5 transition-colors hover:border-[#0ea5e9]/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
            >
              <MagneticLink
                href={profile.linkedin}
                className="flex items-center gap-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#0ea5e9]/20 bg-[#0ea5e9]/10 text-[#0ea5e9] transition group-hover:border-[#0ea5e9]/50">
                  <ExternalLink className="h-5 w-5" />
                </span>
                <span>
                  <span className="font-sans block text-[9px] uppercase tracking-[0.28em] text-muted mb-1">
                    LinkedIn
                  </span>
                  <span className="font-body text-white group-hover:text-[#0ea5e9] transition-colors">
                    yashraj-s-tomar200114
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition group-hover:text-[#0ea5e9] group-hover:translate-x-1" />
              </MagneticLink>
            </motion.div>

            {/* Download resume */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.21 }}
            >
              <MagneticLink
                href={profile.resumeFile}
                className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white px-6 py-4 font-sans text-sm font-medium tracking-wide text-black transition hover:border-white hover:shadow-[0_0_50px_rgba(255,255,255,0.18)]"
              >
                <Download className="h-4 w-4 transition group-hover:-translate-y-0.5" />
                Download Resume
              </MagneticLink>
            </motion.div>

            {/* Availability block */}
            <motion.div
              className="rounded-2xl border border-white/6 bg-[#05070d] p-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28 }}
            >
              <p className="font-sans text-[9px] uppercase tracking-[0.32em] text-white/30 mb-3">
                Availability · Current
              </p>
              <div className="space-y-2">
                <StatusBadge label="Full-time" value="Open" active />
                <StatusBadge label="Freelance" value="Open" active />
                <StatusBadge label="Location" value="New Delhi / Remote" />
              </div>
            </motion.div>
          </div>

          {/* ── Right: terminal form ── */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#05070d]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">
                contact.sh — bash
              </span>
            </div>

            <div className="p-5 sm:p-8">
              {/* Prompt line */}
              <div className="mb-6 font-mono text-[11px] text-white/30">
                <span className="text-emerald-400">~/portfolio</span>
                <span className="text-white/50"> $ </span>
                <span className="text-accent-blue">send_message</span>
                <span className="text-white/40"> --to yashtomar142001</span>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {/* Name */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="font-mono mb-2 block text-[10px] text-white/35"
                  >
                    <span className="text-accent-blue"># </span>--name
                    {focused === "name" && <Cursor />}
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    className="font-body w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white outline-none transition focus:border-accent-blue/50 focus:shadow-[0_0_24px_rgba(79,140,255,0.12)] placeholder:text-white/20"
                    placeholder="Your name"
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="font-mono mb-2 block text-[10px] text-white/35"
                  >
                    <span className="text-accent-blue"># </span>--message
                    {focused === "message" && <Cursor />}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    className="font-body w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white outline-none transition focus:border-accent-blue/50 focus:shadow-[0_0_24px_rgba(79,140,255,0.12)] placeholder:text-white/20"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  data-cursor="interactive"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full overflow-hidden rounded-xl bg-accent-blue px-6 py-4 font-sans text-sm font-semibold tracking-wide text-white transition hover:bg-accent-blue/90"
                >
                  {/* Shimmer */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/15"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                  />
                  <AnimatePresence mode="wait">
                    {sent ? (
                      <motion.span
                        key="sent"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 0.5 }}>✓</motion.span>
                        Opening mail client…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        Execute · Send Message
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Footer prompt */}
                <p className="font-mono text-[9px] text-white/20">
                  <span className="text-emerald-400">✓</span> Encryption: TLS 1.3 · Routed via mailto protocol
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
