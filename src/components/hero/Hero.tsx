"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";
import { usePreloaderReady } from "@/hooks/usePreloaderReady";

const FinanceGlobe = dynamic(
  () => import("./FinanceGlobe").then((m) => m.FinanceGlobe),
  { ssr: false, loading: () => null },
);

const ROLES = [
  { label: "System Architecture", tag: "ARCHITECTURE" },
  { label: "Team Leadership", tag: "DELIVERY" },
  { label: "Prompt Engineering", tag: "AI" },
  { label: "Financial Analytics", tag: "ANALYTICS" },
];

const STATS = [
  { value: "5", label: "SYSTEMS SHIPPED", detail: "FRIS, RMS, SMS, Billing, and 4 CRMs in production" },
  { value: "18", label: "AIRPORTS", detail: "FRIS live across international and domestic stations" },
  { value: "40%", label: "FASTER REPORTS", detail: "Peak turnaround cut with SQL, Power BI, and Excel" },
];

const META = [
  { key: "ROLE", value: "SYSTEM ANALYST", detail: "Team lead at Bird Group" },
  { key: "STACK", value: "SQL · PBI", detail: "SQL · Python · Power BI · Excel · Prompt engineering" },
  { key: "LOCATION", value: "NEW DELHI", detail: "Bird Group · aviation ground operations" },
];

/* ── Hoverable stat card ── */
function StatPill({
  stat,
  delay,
  ready,
}: {
  stat: (typeof STATS)[number];
  delay: number;
  ready: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="group relative cursor-default"
      initial={{ opacity: 0, y: 10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ delay: ready ? delay : 0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow blob */}
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-xl bg-accent-blue/0 blur-xl"
        animate={hovered ? { backgroundColor: "rgba(79,140,255,0.10)" } : { backgroundColor: "rgba(79,140,255,0)" }}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        className="relative flex flex-col gap-0.5 rounded-xl border border-transparent px-3 py-2 transition-colors duration-300"
        animate={
          hovered
            ? { borderColor: "rgba(79,140,255,0.2)", backgroundColor: "rgba(79,140,255,0.05)" }
            : { borderColor: "rgba(0,0,0,0)", backgroundColor: "rgba(0,0,0,0)" }
        }
      >
        <motion.span
          className="font-display font-semibold text-white"
          style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}
          animate={hovered ? { color: "#7bb3ff" } : { color: "#ffffff" }}
          transition={{ duration: 0.25 }}
        >
          {stat.value}
        </motion.span>
        <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-white/30">{stat.label}</span>

        {/* Detail tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-full z-30 mt-2 w-max max-w-[200px] overflow-hidden rounded-xl border border-accent-blue/20 bg-black/90 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/60 to-transparent" />
              <p className="font-body text-[11px] leading-relaxed text-white/60">{stat.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ── Hoverable meta tag ── */
function MetaTag({ meta }: { meta: (typeof META)[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="relative cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        className="font-sans text-[9px] uppercase tracking-[0.32em] transition-colors duration-250 rounded-lg border px-2.5 py-1.5"
        animate={hovered
          ? { color: "rgba(255,255,255,0.75)", borderColor: "rgba(79,140,255,0.3)", backgroundColor: "rgba(79,140,255,0.06)" }
          : { color: "rgba(255,255,255,0.28)", borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}
        transition={{ duration: 0.2 }}
      >
        {meta.key}: {meta.value}
      </motion.span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[180px] -translate-x-1/2 overflow-hidden rounded-xl border border-accent-blue/20 bg-black/90 px-3 py-2 text-center shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
            <p className="font-body text-[11px] leading-relaxed text-white/55">{meta.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const { lite } = usePerfFlags();
  const ready = usePreloaderReady();

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (lite) return;
    registerGsap();
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        y: -70,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [lite]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative grid min-h-[100svh] grid-cols-1 overflow-hidden md:grid-cols-2"
    >
      {/* ── Text — left column, never overlaps the globe canvas ── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center px-5 pb-20 pt-24 sm:px-8 md:px-12 md:pb-0 lg:px-16 lg:pr-8"
      >
        {/* ── Status row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: ready ? 0.05 : 0, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-wrap items-center gap-4"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-blue" style={{ boxShadow: "0 0 6px #4f8cff" }} />
            <span className="hero-tag">SIGNAL · ACTIVE</span>
          </span>
          <span className="hero-tag-dim">INDEX 001 / PORTFOLIO</span>
        </motion.div>

        {/* ── Horizontal rule ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: ready ? 0.12 : 0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 h-px origin-left bg-gradient-to-r from-accent-blue/60 via-white/15 to-transparent"
        />

        {/* ── Name ── */}
        <h1 className="hero-name leading-none tracking-[-0.04em] text-white">
          {["YASH RAJ", "SINGH TOMAR"].map((line, li) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%", opacity: 0 }}
                animate={ready ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{
                  delay: ready ? 0.18 + li * 0.1 : 0,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* ── Role list — gobold services style ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ delay: ready ? 0.42 : 0, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 space-y-1 sm:mt-10"
        >
          {ROLES.map((role, i) => (
            <motion.div
              key={role.label}
              className="group flex cursor-default items-center gap-3"
              initial={{ opacity: 0, x: -16 }}
              animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ delay: ready ? 0.46 + i * 0.08 : 0, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent-blue/50 transition group-hover:text-accent-blue">
                +
              </span>
              <span className="font-display text-base font-medium text-white/60 transition group-hover:text-white sm:text-lg md:text-xl">
                {role.label.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Animated role badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: ready ? 0.72 : 0, duration: 0.5 }}
          className="mt-8 sm:mt-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/25 bg-accent-blue/8 px-4 py-1.5">
            <span className="h-1 w-1 rounded-full bg-accent-blue animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span
                key={ROLES[roleIdx].tag}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-sans text-[10px] uppercase tracking-[0.35em] text-accent-blue"
              >
                OUTPUT: {ROLES[roleIdx].tag}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: ready ? 0.78 : 0, duration: 0.6 }}
          className="mb-8 mt-10 h-px origin-left bg-gradient-to-r from-white/12 via-white/6 to-transparent sm:mt-12"
        />

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: ready ? 0.85 : 0, duration: 0.55 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link href="#projects" data-cursor="interactive">
            <button className="hero-cta-primary">
              VIEW WORK <span className="ml-2 text-base">↗</span>
            </button>
          </Link>
          <Link href="#contact" data-cursor="interactive">
            <button className="hero-cta-ghost">GET IN TOUCH</button>
          </Link>
        </motion.div>

        {/* ── Stats row — hover to reveal detail ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: ready ? 0.95 : 0, duration: 0.55 }}
          className="mt-12 flex flex-wrap gap-6 sm:mt-16"
        >
          {STATS.map((s, i) => (
            <StatPill key={s.label} stat={s} delay={0.95 + i * 0.06} ready={ready} />
          ))}
        </motion.div>

        {/* ── Bottom meta row — hover to reveal detail ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: ready ? 1.08 : 0, duration: 0.5 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {META.map((m) => (
            <MetaTag key={m.key} meta={m} />
          ))}
        </motion.div>
      </div>

      {/* ── Globe — right column, isolated WebGL canvas ── */}
      <div className="relative isolate min-h-[45vh] md:min-h-[100svh]">
        <FinanceGlobe />
      </div>

      {/* ── Bottom scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: ready ? 1.2 : 0 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.45em] text-white/25">Scroll</span>
        <motion.span
          className="h-10 w-px bg-gradient-to-b from-accent-blue/70 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.2, 0.9, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
