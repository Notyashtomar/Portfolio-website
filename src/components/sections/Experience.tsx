"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { experience } from "@/data/resume";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative px-6 py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-violet/80">
          Experience
        </p>
        <SplitReveal
          text="Companies that shaped the craft."
          as="h2"
          mode="words"
          className="mb-20 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] text-white md:mb-28"
        />

        <div className="relative">
          <div
            ref={lineRef}
            className="absolute left-[7px] top-0 hidden h-full w-px bg-gradient-to-b from-accent-blue via-accent-violet/50 to-transparent md:left-1/2 md:block"
          />

          <div className="space-y-12 md:space-y-0">
            {experience.map((role, index) => {
              const left = index % 2 === 0;
              return (
                <div
                  key={role.id}
                  className={`relative md:grid md:grid-cols-2 md:gap-16 md:py-10 ${
                    left ? "" : "md:[&>*:first-child]:col-start-2"
                  }`}
                >
                  <div className="absolute left-0 top-10 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-accent-blue bg-[#030303] shadow-[0_0_24px_rgba(79,140,255,0.8)] md:left-1/2 md:block" />

                  <PremiumCard tilt={8}>
                    <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-accent-blue">
                      {role.period}
                    </p>
                    <h3 className="font-display mt-3 text-3xl font-semibold text-white md:text-4xl">
                      {role.company}
                    </h3>
                    <p className="font-body mt-2 text-muted">{role.role}</p>
                    <ul className="mt-8 space-y-4">
                      {role.highlights.map((item, hi) => (
                        <li
                          key={item}
                          className="font-body flex gap-4 border-t border-white/6 pt-4 text-sm leading-[1.75] text-muted first:border-t-0 first:pt-0"
                        >
                          <span className="font-sans text-[10px] text-accent-gold/80">
                            {String(hi + 1).padStart(2, "0")}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </PremiumCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
