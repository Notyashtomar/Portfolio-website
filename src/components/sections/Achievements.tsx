"use client";

import { achievements, certifications, education } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function Achievements() {
  return (
    <section id="impact" className="relative px-6 py-32 md:px-12 md:py-44 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-gold/80">
          Impact
        </p>
        <SplitReveal
          text="Proof in the outcomes."
          as="h2"
          mode="words"
          className="mb-20 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] text-white md:mb-28"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {achievements.map((item) => (
            <PremiumCard key={item.id} tilt={4}>
              <p className="font-display text-5xl font-semibold text-white">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="font-sans mt-4 text-sm text-white">{item.label}</p>
              <p className="font-body mt-2 text-xs leading-relaxed text-muted">
                {item.detail}
              </p>
            </PremiumCard>
          ))}
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-2">
          <div>
            <SplitReveal
              text="Education"
              as="h3"
              mode="chars"
              className="mb-10 text-3xl font-semibold text-white"
              stagger={0.04}
            />
            <div className="space-y-5">
              {education.map((item) => (
                <PremiumCard key={`${item.school}-${item.period}`} float={false} tilt={4}>
                  <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-accent-gold">
                    {item.period}
                  </p>
                  <p className="font-display mt-3 text-xl text-white">{item.school}</p>
                  <p className="font-body mt-2 text-sm text-muted">{item.credential}</p>
                  <p className="font-body mt-2 text-sm text-white/50">{item.detail}</p>
                </PremiumCard>
              ))}
            </div>
          </div>

          <div>
            <SplitReveal
              text="Certifications"
              as="h3"
              mode="chars"
              className="mb-10 text-3xl font-semibold text-white"
              stagger={0.04}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {certifications.map((cert) => (
                <PremiumCard
                  key={`${cert.issuer}-${cert.title}`}
                  float={false}
                  tilt={3}
                  className="!p-5"
                >
                  <p className="font-body text-sm leading-snug text-white">{cert.title}</p>
                  <p className="font-sans mt-3 text-[10px] uppercase tracking-[0.2em] text-muted">
                    {cert.issuer}
                  </p>
                </PremiumCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
