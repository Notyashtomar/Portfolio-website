"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { usePerfFlags } from "@/components/providers/Providers";
import { easeOut } from "@/lib/motion";

const CARDS = [
  { id: "fa", label: "Financial Analytics", x: 18, y: 12, delay: 0 },
  { id: "pbi", label: "Power BI", x: 62, y: 8, delay: 0.08 },
  { id: "sql", label: "SQL", x: 78, y: 32, delay: 0.16 },
  { id: "excel", label: "Excel", x: 12, y: 42, delay: 0.24 },
  { id: "mis", label: "MIS Reporting", x: 48, y: 48, delay: 0.32 },
  { id: "auto", label: "Automation", x: 72, y: 68, delay: 0.4 },
  { id: "fc", label: "Forecasting", x: 22, y: 72, delay: 0.48 },
  { id: "viz", label: "Data Visualization", x: 52, y: 88, delay: 0.56 },
] as const;

const LINKS: Array<[string, string]> = [
  ["fa", "pbi"],
  ["fa", "excel"],
  ["pbi", "sql"],
  ["excel", "mis"],
  ["mis", "sql"],
  ["mis", "auto"],
  ["excel", "fc"],
  ["auto", "viz"],
  ["fc", "viz"],
  ["sql", "auto"],
];

type Props = {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
};

export function HeroWorkspace({ mouseX, mouseY }: Props) {
  const { lite } = usePerfFlags();
  const ref = useRef<HTMLDivElement>(null);

  const parallaxX = useSpring(
    useTransform(mouseX, [0, 1], [-18, 18]),
    { stiffness: 80, damping: 22, mass: 0.6 },
  );
  const parallaxY = useSpring(
    useTransform(mouseY, [0, 1], [-14, 14]),
    { stiffness: 80, damping: 22, mass: 0.6 },
  );
  const deepX = useSpring(
    useTransform(mouseX, [0, 1], [-28, 28]),
    { stiffness: 60, damping: 24, mass: 0.8 },
  );
  const deepY = useSpring(
    useTransform(mouseY, [0, 1], [-22, 22]),
    { stiffness: 60, damping: 24, mass: 0.8 },
  );

  const cardMap = useMemo(() => {
    const map = new Map<string, (typeof CARDS)[number]>();
    CARDS.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: lite ? 8 : 16 }, (_, i) => ({
        id: i,
        left: 6 + ((i * 41) % 88),
        top: 8 + ((i * 29) % 84),
        size: 1.5 + (i % 3),
        duration: 4 + (i % 5) * 0.6,
        delay: (i % 6) * 0.35,
      })),
    [lite],
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay: 1.15, duration: 1.1, ease: easeOut }}
      className="relative aspect-square w-full max-w-[560px] lg:max-w-none"
    >
      {/* Soft mesh glow layers */}
      <motion.div
        style={lite ? undefined : { x: deepX, y: deepY }}
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.22),transparent_62%)] blur-2xl"
      />
      <motion.div
        className="pointer-events-none absolute right-[5%] top-[18%] h-[45%] w-[45%] rounded-full bg-accent-violet/20 blur-3xl"
        animate={lite ? undefined : { opacity: [0.25, 0.5, 0.25], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[10%] left-[8%] h-[40%] w-[40%] rounded-full bg-accent-blue/15 blur-3xl"
        animate={lite ? undefined : { opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbit rings */}
      {!lite ? (
        <>
          <motion.div
            className="pointer-events-none absolute inset-[6%] rounded-full border border-white/[0.06]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="pointer-events-none absolute inset-[18%] rounded-full border border-dashed border-accent-blue/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
        </>
      ) : null}

      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(79,140,255,0.55)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.4)" />
          </linearGradient>
        </defs>
        {LINKS.map(([a, b], i) => {
          const from = cardMap.get(a)!;
          const to = cardMap.get(b)!;
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={from.x + 8}
              y1={from.y + 4}
              x2={to.x + 8}
              y2={to.y + 4}
              stroke="url(#hero-line)"
              strokeWidth="0.18"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{
                delay: 1.4 + i * 0.05,
                duration: 0.9,
                ease: easeOut,
              }}
            />
          );
        })}
      </svg>

      {/* Particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0.15, 0.75, 0.15],
            y: [0, -12, 0],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating glass cards */}
      <motion.div
        style={lite ? undefined : { x: parallaxX, y: parallaxY }}
        className="absolute inset-0"
      >
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: lite ? 0 : [0, i % 2 === 0 ? -10 : 8, 0],
            }}
            transition={{
              opacity: { delay: 1.25 + card.delay, duration: 0.6, ease: easeOut },
              scale: { delay: 1.25 + card.delay, duration: 0.7, ease: easeOut },
              y: lite
                ? { duration: 0 }
                : {
                    delay: 2 + card.delay,
                    duration: 4.5 + (i % 4) * 0.55,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${card.x}%`, top: `${card.y}%` }}
          >
            <div className="premium-glass rounded-2xl border border-white/10 px-3.5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-4 sm:py-3">
              <p className="font-sans whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-white/85 sm:text-[10px] sm:tracking-[0.2em]">
                {card.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Center pulse */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue shadow-[0_0_24px_rgba(79,140,255,0.9)]"
        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
