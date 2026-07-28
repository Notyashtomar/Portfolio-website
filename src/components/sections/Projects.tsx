"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const metrics = project.metrics.filter((m) => m.numeric > 0).slice(0, 2);

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="interactive"
      className="block h-full"
    >
      <div className="group relative flex h-full flex-col border border-white/10 bg-[#060810] p-7 transition-all duration-500 hover:border-accent-blue/40 hover:bg-[#040916] sm:p-9">
        {/* Corner glow */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-violet/0 blur-3xl transition duration-500 group-hover:bg-accent-violet/22" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-accent-blue/0 blur-3xl transition duration-500 group-hover:bg-accent-blue/16" />

        {/* Top shine line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/0 to-transparent transition duration-500 group-hover:via-accent-blue/70" />

        <div className="relative z-10 flex h-full flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="section-num">
                {String(index + 1).padStart(2, "0")} / PROJECT
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-accent-violet/80 transition group-hover:text-accent-blue">
                {project.subtitle}
              </span>
            </div>
            <motion.span
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/12 bg-white/[0.025] text-white/30 transition group-hover:border-accent-blue/50 group-hover:bg-accent-blue/15 group-hover:text-white"
              whileHover={{ rotate: 45 }}
            >
              <ArrowUpRight className="h-4 w-4" />
            </motion.span>
          </div>

          {/* Title */}
          <div className="mt-12 flex-1">
            <h3 className="font-display text-3xl font-bold leading-[1.1] text-white transition duration-400 sm:text-[2.2rem]">
              {project.title.toUpperCase()}
            </h3>
            <p className="font-body mt-5 text-sm leading-[1.85] text-white/45 transition group-hover:text-white/65">
              {project.tagline}
            </p>
          </div>

          {/* Metrics */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {metrics.map((m, mi) => (
              <div
                key={m.label}
                className="border border-white/8 bg-black/40 p-4 transition duration-300 group-hover:border-accent-blue/25 group-hover:bg-accent-blue/[0.06]"
              >
                <p className="font-display text-3xl font-bold text-white">
                  <AnimatedCounter
                    value={m.numeric}
                    suffix={m.suffix}
                    duration={1.4 + mi * 0.15}
                  />
                </p>
                <p className="font-sans mt-1.5 text-[9px] uppercase tracking-[0.22em] text-white/35">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA text */}
          <div className="mt-7 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.32em] text-white/25 transition group-hover:text-accent-blue/80">
            <span>Case Study</span>
            <span className="h-px w-0 bg-accent-blue transition-all duration-500 group-hover:w-10" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Finance ticker of terms that scrolls horizontally */
function FinanceTicker() {
  const TERMS = [
    "EBITDA", "ROI", "IRR", "NPV", "CAGR", "SHARPE RATIO",
    "P&L ANALYSIS", "MIS REPORTING", "ALPHA", "VOLATILITY",
    "ARIMA", "REGRESSION", "FORECASTING", "VaR", "SQL AUTOMATION",
  ];
  const doubled = [...TERMS, ...TERMS];

  return (
    <div className="relative overflow-hidden border-y border-white/8 py-3">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/25">{t}</span>
            <span className="h-px w-5 bg-white/15" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { lite } = usePerfFlags();

  useEffect(() => {
    if (lite) return;
    registerGsap();

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // scrollWidth of the flex track vs viewport width
      const getScrollDist = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDist()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [lite]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden"
    >
      {/* ── Section header (outside pin zone) ── */}
      <div className="relative z-10 px-5 pt-20 sm:px-8 sm:pt-28 md:px-12 md:pt-36 lg:px-16">
        <div className="mx-auto max-w-[90rem]">
          {/* ── Terminal-style label ── */}
          <div className="mb-6 flex items-center gap-4">
            <span className="section-num">02 / WORK</span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/30 to-transparent" />
          </div>

          <h2 className="section-heading-bold mb-0 max-w-3xl">
            WORK THAT<br />MOVED THE<br />NUMBERS.
          </h2>
        </div>
      </div>

      {/* ── Ticker ── */}
      <div className="mt-12 sm:mt-16">
        <FinanceTicker />
      </div>

      {/* ── Horizontal scroll rail ── */}
      <div
        className={`relative mt-0 ${lite ? "px-5 py-12 sm:px-8 md:px-12 lg:px-16" : "py-12"}`}
      >
        {lite ? (
          /* ── Lite mode: vertical grid ── */
          <div className="mx-auto grid max-w-[90rem] gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* ── Full mode: horizontal pinned scroll ──
             The <section> has overflow-hidden so the viewport is the clip boundary.
             The track uses pl- for left gutter — NO inner overflow-hidden wrapper. */
          <div className="relative">
            {/* Left fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#030303] to-transparent" />
            {/* Right fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#030303] to-transparent" />

            {/* Track — left padding sets start offset; section clips right overflow */}
            <div
              ref={trackRef}
              className="flex gap-5 pl-5 sm:pl-8 md:pl-12 lg:pl-16"
              style={{ width: "max-content" }}
            >
              {/* Leading copy panel */}
              <div
                className="flex shrink-0 items-end pb-3"
                style={{ width: "min(70vw, 320px)" }}
              >
                <div>
                  <p className="font-body text-sm leading-[1.85] text-white/35 md:text-base">
                    Turning financial complexity<br />into clarity — one dataset<br />at a time.
                  </p>
                  <div className="mt-6 flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.35em] text-white/20">
                    <span className="h-px w-8 bg-white/20" />
                    <span>Scroll to explore</span>
                  </div>
                </div>
              </div>

              {/* Project cards */}
              {projects.map((project, i) => (
                <div
                  key={project.slug}
                  className="shrink-0"
                  style={{
                    width: "min(82vw, 480px)",
                    height: "clamp(380px, 54vh, 540px)",
                  }}
                >
                  <ProjectCard project={project} index={i} />
                </div>
              ))}

              {/* Trailing CTA */}
              <div
                className="flex shrink-0 items-center justify-center pr-12"
                style={{ width: "min(70vw, 340px)" }}
              >
                <Link
                  href="#contact"
                  data-cursor="interactive"
                  className="group flex flex-col items-center gap-4 text-center"
                >
                  <span className="font-display text-4xl font-bold text-white/18 transition group-hover:text-white/60 sm:text-5xl">
                    LET&apos;S BUILD
                  </span>
                  <span className="font-display text-4xl font-bold text-white/18 transition group-hover:text-accent-blue sm:text-5xl">
                    SOMETHING.
                  </span>
                  <span className="mt-2 font-sans text-[10px] uppercase tracking-[0.4em] text-accent-blue/50">
                    Get in touch ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
