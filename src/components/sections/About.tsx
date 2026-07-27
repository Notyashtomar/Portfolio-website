"use client";

import { motion } from "framer-motion";
import { focusAreas, profile } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

const stats = [
  { value: 2, suffix: "+", label: "Years experience" },
  { value: 35, suffix: "%", label: "Faster reporting" },
  { value: 40, suffix: "%", label: "Process efficiency" },
];

export function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-12 sm:mb-20 md:mb-28">
          <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-blue/80">
            Who I am
          </p>
          <SplitReveal
            text="Clarity from complex data."
            as="h2"
            mode="words"
            className="max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.02] text-white"
          />
        </div>

        <div className="grid gap-10 sm:gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <SplitReveal
            text={profile.summary}
            as="p"
            mode="words"
            className="font-body max-w-2xl text-base leading-[1.9] text-muted md:text-lg"
            stagger={0.02}
          />

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <PremiumCard key={stat.label} tilt={3}>
                <p className="font-display text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-sans mt-3 text-[11px] uppercase tracking-[0.28em] text-muted">
                  {stat.label}
                </p>
              </PremiumCard>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area, i) => (
            <motion.article
              key={area.title}
              data-cursor="interactive"
              tabIndex={0}
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative h-[220px] overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.025] p-6 outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-out hover:border-accent-violet/40 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(139,92,246,0.22),0_0_40px_rgba(139,92,246,0.12)] focus-visible:border-accent-violet/40 focus-visible:shadow-[0_20px_60px_rgba(139,92,246,0.22)] sm:h-[240px] md:p-8"
            >
              <div className="pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full bg-accent-violet/0 blur-3xl transition duration-300 ease-out group-hover:bg-accent-violet/35 group-focus-within:bg-accent-violet/35" />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
                style={{
                  background:
                    "radial-gradient(420px circle at 18% 0%, rgba(139,92,246,0.18), transparent 55%)",
                }}
              />

              <span className="relative z-10 font-sans text-[10px] uppercase tracking-[0.35em] text-accent-violet/70 transition duration-300 group-hover:text-accent-violet group-focus-within:text-accent-violet">
                0{i + 1}
              </span>

              <div className="absolute inset-x-6 bottom-6 z-10 md:inset-x-8 md:bottom-8">
                <p className="font-display text-xl text-white transition-transform duration-300 ease-out group-hover:-translate-y-14 group-focus-within:-translate-y-14 sm:text-2xl sm:group-hover:-translate-y-16 sm:group-focus-within:-translate-y-16 md:text-3xl">
                  {area.title}
                </p>

                <p className="font-body absolute inset-x-0 bottom-0 text-sm leading-[1.7] text-white/65 opacity-0 translate-y-[10px] transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {area.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
