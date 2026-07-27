"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/resume";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll("[data-project]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, rotateX: 12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 75%",
          },
        },
      );
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="relative px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-magenta/80">
          Projects
        </p>
        <SplitReveal
          text="Work that moved the numbers."
          as="h2"
          mode="words"
          className="mb-12 max-w-4xl text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] text-white sm:mb-20 md:mb-28"
        />

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              data-project
              data-cursor="interactive"
              className="block"
              style={{ perspective: 1200 }}
            >
              <PremiumCard tilt={8} className="group h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
                <div className="flex h-full flex-col">
                  <div className="mb-auto flex items-start justify-between">
                    <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-accent-violet">
                      {project.subtitle}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-white/30 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </div>

                  <div className="mt-16">
                    <h3 className="font-display text-2xl font-semibold text-white transition duration-500 group-hover:text-shimmer sm:text-3xl md:text-4xl">
                      {project.title}
                    </h3>
                    <p className="font-body mt-5 text-sm leading-[1.8] text-muted">
                      {project.tagline}
                    </p>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-2">
                    {project.metrics.slice(0, 2).map((metric) => (
                      <span
                        key={metric.label}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-white/60"
                      >
                        {metric.value} · {metric.label}
                      </span>
                    ))}
                  </div>
                </div>
              </PremiumCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
