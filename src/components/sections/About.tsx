"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { focusAreas, profile } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const stats = [
  { value: 2, suffix: "+", label: "Years experience" },
  { value: 35, suffix: "%", label: "Faster reporting" },
  { value: 40, suffix: "%", label: "Process efficiency" },
];

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
          <SplitReveal
            text={profile.summary}
            as="p"
            mode="words"
            className="font-body max-w-2xl text-[0.95rem] leading-[1.85] text-muted sm:text-base md:text-lg md:leading-[1.9]"
            stagger={0.02}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <PremiumCard key={stat.label} tilt={3} className="!p-5 sm:!p-6 md:!p-8">
                <p className="font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-sans mt-2 text-[10px] uppercase tracking-[0.22em] text-muted sm:mt-3 sm:text-[11px] sm:tracking-[0.28em]">
                  {stat.label}
                </p>
              </PremiumCard>
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
