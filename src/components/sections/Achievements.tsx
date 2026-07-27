"use client";

import { achievements, certifications, education } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function Achievements() {
  return (
    <section id="impact" className="relative px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-gold/80">
          Impact
        </p>
        <SplitReveal
          text="Proof in the outcomes."
          as="h2"
          mode="words"
          className="mb-12 max-w-4xl text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] text-white sm:mb-20 md:mb-28"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {achievements.map((item) => (
            <PremiumCard key={item.id} tilt={4} className="!p-5 sm:!p-6 md:!p-8">
              <p className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="font-sans mt-3 text-sm text-white sm:mt-4">{item.label}</p>
              <p className="font-body mt-2 text-xs leading-relaxed text-muted">
                {item.detail}
              </p>
            </PremiumCard>
          ))}
        </div>

        <div className="mt-16 grid gap-12 sm:mt-24 sm:gap-16 lg:grid-cols-2">
          <div>
            <SplitReveal
              text="Education"
              as="h3"
              mode="chars"
              className="mb-8 text-2xl font-semibold text-white sm:mb-10 sm:text-3xl"
              stagger={0.04}
            />
            <div className="space-y-5">
              {education.map((item) => (
                <PremiumCard key={`${item.school}-${item.period}`} float={false} tilt={4}>
                  <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-accent-gold">
                    {item.period}
                  </p>
                  <p className="font-display mt-3 text-lg leading-snug text-white sm:text-xl">
                    {item.school}
                  </p>
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
              className="mb-8 text-2xl font-semibold text-white sm:mb-10 sm:text-3xl"
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
                  {cert.date ? (
                    <p className="font-sans mt-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
                      {cert.date}
                    </p>
                  ) : null}
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="interactive"
                      className="font-sans mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-accent-blue transition hover:text-white"
                    >
                      View Credential
                      <span aria-hidden>↗</span>
                    </a>
                  ) : null}
                </PremiumCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
