"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { focusAreas, profile } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: 2,
    suffix: "+",
    label: "Years experience",
    detail: "Across Bird, Wistful, and SLA — building financial models, automating MIS, and running end-to-end data pipelines.",
  },
  {
    value: 35,
    suffix: "%",
    label: "Faster reporting",
    detail: "Cut monthly report turnaround at Wistful by automating data extraction and dashboard refresh cycles.",
  },
  {
    value: 40,
    suffix: "%",
    label: "Process efficiency",
    detail: "Streamlined SQL-based data extraction at SLA, eliminating manual steps and reducing error rates across finance workflows.",
  },
];

function StatCard({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const expanded = open;

  return (
    <motion.div
      data-cursor="interactive"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.1, ...springSoft }}
      onMouseEnter={() => canHover && setOpen(true)}
      onMouseLeave={() => canHover && setOpen(false)}
      onClick={() => !canHover && setOpen((v) => !v)}
      className={cn(
        "group interactive-card relative cursor-default overflow-hidden rounded-[20px] border p-5 transition-all duration-300 sm:p-6 md:p-8",
        expanded
          ? "border-accent-blue/45 bg-[#040d1e] shadow-[0_20px_60px_rgba(79,140,255,0.18)]"
          : "border-white/8 bg-white/[0.025]",
      )}
    >
      {/* Glow blob */}
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-blue/25 blur-3xl transition-opacity duration-300",
          expanded ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Top shine line */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent transition-opacity duration-300",
          expanded ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative z-10">
        <p className="font-display text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
        </p>
        <p className="font-sans mt-2 text-[10px] uppercase tracking-[0.28em] text-muted sm:mt-3">
          {stat.label}
        </p>

        {/* Revealed detail */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,margin] duration-300 ease-out",
            expanded ? "mt-4 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className={cn(
                "font-body text-xs leading-[1.75] text-white/55 transition-opacity duration-300",
                expanded ? "opacity-100" : "opacity-0",
              )}
            >
              {stat.detail}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FocusCard({
  area,
  index,
}: {
  area: (typeof focusAreas)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const expanded = !canHover || open;

  return (
    <motion.article
      data-cursor="interactive"
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={canHover ? { scale: 1.02, y: -2 } : undefined}
      transition={springSoft}
      onMouseEnter={() => canHover && setOpen(true)}
      onMouseLeave={() => canHover && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => {
        if (!canHover) setOpen((v) => !v);
      }}
      className={cn(
        "group interactive-card relative flex min-h-[160px] flex-col overflow-hidden rounded-[24px] border bg-white/[0.025] p-5 outline-none sm:min-h-[180px] sm:rounded-[28px] sm:p-6 md:p-8",
        expanded
          ? "border-accent-violet/40 bg-white/[0.05] shadow-[0_20px_60px_rgba(139,92,246,0.18)]"
          : "border-white/8",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full bg-accent-violet/30 blur-3xl transition-opacity duration-300",
          expanded ? "opacity-100" : "opacity-0",
        )}
      />

      <span
        className={cn(
          "relative z-10 font-sans text-[10px] uppercase tracking-[0.28em] transition-colors duration-300 sm:tracking-[0.35em]",
          expanded ? "text-accent-violet" : "text-accent-violet/70",
        )}
      >
        0{index + 1}
      </span>

      <div className="relative z-10 mt-auto pt-8">
        <p className="font-display text-xl leading-tight text-white sm:text-2xl md:text-3xl">
          {area.title}
        </p>

        <div
          className={cn(
            "grid transition-[grid-template-rows,margin] duration-300 ease-out",
            expanded ? "mt-3 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className={cn(
                "font-body text-sm leading-[1.7] text-white/65 transition-opacity duration-300",
                expanded ? "opacity-100" : "opacity-0",
              )}
            >
              {area.description}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Finance × data-science signal console — fills the empty space beneath the summary ── */
const SIGNALS = [
  { label: "Revenue Trend", value: "+18.4%", points: [30, 40, 36, 52, 46, 60, 55, 68, 64, 82], color: "#34d399" },
  { label: "Cost Variance", value: "-6.2%", points: [72, 65, 68, 55, 60, 47, 52, 39, 44, 30], color: "#f87171" },
  { label: "Forecast Accuracy", value: "96.7%", points: [38, 46, 51, 57, 62, 70, 75, 82, 88, 95], color: "#4f8cff" },
];

function Sparkline({ points, color, gradId }: { points: number[]; color: string; gradId: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const w = 140;
  const h = 40;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - ((p - min) / range) * h).toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const lastY = h - ((points[points.length - 1] - min) / range) * h;

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="h-10 w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${gradId})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.55, duration: 0.6 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      {inView && (
        <motion.circle
          cx={w}
          cy={lastY}
          r="2.5"
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.6, 1] }}
          transition={{ delay: 1.05, duration: 0.5 }}
        />
      )}
    </svg>
  );
}

function SignalCard({ signal, index }: { signal: (typeof SIGNALS)[number]; index: number }) {
  return (
    <motion.div
      data-cursor="interactive"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ borderColor: `${signal.color}40`, y: -2 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-4"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ background: signal.color }}
      />
      <div className="relative z-10 flex items-center justify-between gap-2">
        <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-white/35">{signal.label}</p>
        <span className="font-display shrink-0 text-sm font-semibold" style={{ color: signal.color }}>
          {signal.value}
        </span>
      </div>
      <div className="relative z-10 mt-3">
        <Sparkline points={signal.points} color={signal.color} gradId={`about-spark-${index}`} />
      </div>
    </motion.div>
  );
}

/** Rotating terminal line — types out finance & data-science snippets, then deletes and cycles. */
const CONSOLE_LINES = [
  "DCF = Σ CFₜ ÷ (1 + r)ᵗ",
  "SELECT region, SUM(revenue) FROM sales GROUP BY region;",
  "df.groupby('quarter')['ebitda'].agg(['mean','std'])",
  "NPV > 0  →  ACCEPT PROJECT",
  "=INDEX(MATCH(lookup_value, range, 0))",
  "R² = 0.94   RMSE = 1.2%",
  "Working Capital = Current Assets − Current Liabilities",
];

function ConsoleTicker() {
  const [lineIdx, setLineIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const full = CONSOLE_LINES[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (display.length < full.length) {
        timeout = setTimeout(() => setDisplay(full.slice(0, display.length + 1)), 32);
      } else {
        timeout = setTimeout(() => setPhase("holding"), 1500);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 800);
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(full.slice(0, display.length - 1)), 14);
      } else {
        setPhase("typing");
        setLineIdx((i) => (i + 1) % CONSOLE_LINES.length);
      }
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, phase, lineIdx]);

  return (
    <div className="flex min-h-[1.5em] items-center gap-2 overflow-hidden font-mono text-[12px] sm:text-[13px]">
      <span className="shrink-0 text-accent-blue/60">$</span>
      <span className="truncate text-white/55">{display}</span>
      <motion.span
        className="inline-block h-3.5 w-[2px] shrink-0 bg-accent-blue/70"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
      />
    </div>
  );
}

function DataConsole() {
  return (
    <div className="mt-10 sm:mt-14 lg:mt-16">
      <div className="mb-6 flex items-center gap-3">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-accent-blue"
          style={{ boxShadow: "0 0 6px #4f8cff" }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-white/35">Data Signal</p>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SIGNALS.map((signal, i) => (
          <SignalCard key={signal.label} signal={signal} index={i} />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/8 bg-[#05070d] px-4 py-3">
        <ConsoleTicker />
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative px-4 py-16 sm:px-6 sm:py-28 md:px-12 md:py-40 lg:px-16 lg:py-44">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-10 sm:mb-16 md:mb-24">
          <p className="font-sans mb-5 text-[10px] uppercase tracking-[0.32em] text-accent-blue/80 sm:mb-6 sm:text-[11px] sm:tracking-[0.45em]">
            Who I am
          </p>
          <SplitReveal
            text="Clarity from complex data."
            as="h2"
            mode="words"
            className="max-w-4xl text-[clamp(2rem,6vw,5.5rem)] font-semibold leading-[1.05] text-white"
          />
        </div>

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <div>
            <SplitReveal
              text={profile.summary}
              as="p"
              mode="words"
              className="font-body max-w-2xl text-[0.95rem] leading-[1.85] text-muted sm:text-base md:text-lg md:leading-[1.9]"
              stagger={0.02}
            />
            <DataConsole />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:mt-20 lg:grid-cols-3">
          {focusAreas.map((area, i) => (
            <FocusCard key={area.title} area={area} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
