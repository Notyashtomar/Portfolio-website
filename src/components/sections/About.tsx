"use client";

import { focusAreas, profile } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

const stats = [
  { value: 2, suffix: "+", label: "Years experience" },
  { value: 30, suffix: "%", label: "Faster reporting" },
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
            <PremiumCard key={area} tilt={4} className="group">
              <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-accent-violet/70">
                0{i + 1}
              </span>
              <p className="font-display mt-4 text-xl text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl md:text-3xl">
                {area}
              </p>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  );
}
