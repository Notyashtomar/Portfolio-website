"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience, focusAreas, profile } from "@/data/resume";
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

/* ── Interactive career timeline — fills the empty space beneath the summary ── */
function CareerPulse() {
  const [active, setActive] = useState<string | null>(experience[0]?.id ?? null);
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mt-10 sm:mt-14 lg:mt-16">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #34d399" }} />
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-white/35">Career Log</p>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div ref={railRef} className="relative pl-6">
        {/* Vertical rail */}
        <motion.div
          className="absolute left-[3px] top-1 w-px bg-gradient-to-b from-accent-blue/50 via-white/12 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top", height: "calc(100% - 4px)" }}
        />

        <div className="space-y-1">
          {experience.map((job, i) => {
            const isActive  = active === job.id;
            const isCurrent = job.period.toLowerCase().includes("present");

            return (
              <motion.div
                key={job.id}
                data-cursor="interactive"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActive(job.id)}
                onClick={() => setActive(isActive ? null : job.id)}
                className="group relative cursor-pointer py-3"
              >
                {/* Dot */}
                <span
                  className="absolute -left-6 top-4 flex h-2 w-2 -translate-x-1/2 items-center justify-center rounded-full transition-colors duration-300"
                  style={{
                    background: isActive ? "#4f8cff" : isCurrent ? "#34d399" : "rgba(255,255,255,0.25)",
                    boxShadow: isActive ? "0 0 10px rgba(79,140,255,0.8)" : isCurrent ? "0 0 8px rgba(52,211,153,0.7)" : "none",
                  }}
                >
                  {isCurrent && (
                    <motion.span
                      className="absolute inline-block h-2 w-2 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </span>

                {/* Header row */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="font-display text-base font-semibold transition-colors duration-300 sm:text-lg"
                      style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.75)" }}
                    >
                      {job.company}
                    </span>
                    {isCurrent && (
                      <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-emerald-400/80">
                        · live
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/25">
                    {job.period}
                  </span>
                </div>
                <p className="font-body mt-0.5 text-xs text-accent-blue/60">{job.role} · {job.location}</p>

                {/* Expandable highlight */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="font-body mt-3 max-w-md text-[13px] leading-[1.75] text-white/50">
                        {job.highlights[0]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
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
            <CareerPulse />
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
