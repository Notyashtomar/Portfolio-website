"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";

/* ─── Project card ────────────────────────────────────────────── */
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
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-violet/0 blur-3xl transition duration-500 group-hover:bg-accent-violet/22" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-accent-blue/0 blur-3xl transition duration-500 group-hover:bg-accent-blue/16" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/0 to-transparent transition duration-500 group-hover:via-accent-blue/70" />

        <div className="relative z-10 flex h-full flex-col">
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

          <div className="mt-12 flex-1">
            <h3 className="font-display text-3xl font-bold leading-[1.1] text-white transition duration-400 sm:text-[2.2rem]">
              {project.title.toUpperCase()}
            </h3>
            <p className="font-body mt-5 text-sm leading-[1.85] text-white/45 transition group-hover:text-white/65">
              {project.tagline}
            </p>
          </div>

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

          <div className="mt-7 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.32em] text-white/25 transition group-hover:text-accent-blue/80">
            <span>Case Study</span>
            <span className="h-px w-0 bg-accent-blue transition-all duration-500 group-hover:w-10" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Finance ticker ──────────────────────────────────────────── */
function FinanceTicker() {
  const TERMS = [
    "EBITDA","ROI","IRR","NPV","CAGR","SHARPE RATIO",
    "P&L ANALYSIS","MIS REPORTING","ALPHA","VOLATILITY",
    "ARIMA","REGRESSION","FORECASTING","VaR","SQL AUTOMATION",
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

/* ─── Main section ────────────────────────────────────────────── */
export function Projects() {
  const wrapperRef = useRef<HTMLDivElement>(null); // controls scroll space height
  const stickyRef = useRef<HTMLDivElement>(null);  // the sticky frame (h-screen)
  const trackRef  = useRef<HTMLDivElement>(null);  // translates horizontally

  const { lite } = usePerfFlags();

  useEffect(() => {
    if (lite) return;
    registerGsap();

    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    // Kill any existing ScrollTriggers on this wrapper before rebuilding
    const existing = ScrollTrigger.getAll().filter(
      (t) => t.vars.trigger === wrapper,
    );
    existing.forEach((t) => t.kill());

    let st: ReturnType<typeof ScrollTrigger.create> | null = null;

    const setup = () => {
      st?.kill();

      // How far the track needs to travel = track width − viewport width
      const scrollDist = Math.max(0, track.scrollWidth - window.innerWidth);
      if (scrollDist === 0) return;

      // Wrapper height creates the vertical scroll space for GSAP to work against.
      // sticky inner = 100vh, wrapper = 100vh + scrollDist so the sticky rides
      // through exactly scrollDist pixels of scroll.
      wrapper.style.height = `${window.innerHeight + scrollDist}px`;

      gsap.set(track, { x: 0 });

      st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: `+=${scrollDist}`,
        scrub: 1,
        onUpdate(self) {
          gsap.set(track, { x: -scrollDist * self.progress });
        },
      });
    };

    // Small rAF delay so the track has finished painting and scrollWidth is stable
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(setup);
    });

    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      st?.kill();
    };
  }, [lite]);

  /* ── Lite / mobile: plain vertical grid ── */
  if (lite) {
    return (
      <section id="projects" className="relative px-5 py-20 sm:px-8 sm:py-28 md:px-12 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[90rem]">
          <div className="mb-6 flex items-center gap-4">
            <span className="section-num">02 / WORK</span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/30 to-transparent" />
          </div>
          <h2 className="section-heading-bold mb-12 max-w-3xl sm:mb-16">
            WORK THAT<br />MOVED THE<br />NUMBERS.
          </h2>
        </div>
        <FinanceTicker />
        <div className="mx-auto mt-10 grid max-w-[90rem] gap-4 px-5 sm:gap-5 sm:px-8 md:grid-cols-2 md:px-12 lg:grid-cols-3 lg:px-16">
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
      </section>
    );
  }

  /* ── Full mode: CSS sticky + GSAP scroll-driven x translation ── */
  return (
    <section id="projects" className="relative">

      {/* ── Visible heading — scrolls away normally ── */}
      <div className="relative z-10 px-5 pt-20 sm:px-8 sm:pt-28 md:px-12 md:pt-36 lg:px-16">
        <div className="mx-auto max-w-[90rem]">
          <div className="mb-6 flex items-center gap-4">
            <span className="section-num">02 / WORK</span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/30 to-transparent" />
          </div>
          <h2 className="section-heading-bold mb-0 max-w-3xl">
            WORK THAT<br />MOVED THE<br />NUMBERS.
          </h2>
        </div>
      </div>

      <div className="mt-10 sm:mt-14">
        <FinanceTicker />
      </div>

      {/*
        ── Horizontal scroll scaffold ──
        wrapperRef  → tall div that gives GSAP something to measure scroll against.
                      Its height is set dynamically: 100vh + scrollDist.
        stickyRef   → position: sticky; height: 100vh — browser pins this natively.
        trackRef    → width: max-content flex row — GSAP translates this.
      */}
      <div ref={wrapperRef}>
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen overflow-hidden"
        >
          {/* Horizontal fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#030303] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#030303] to-transparent" />

          {/* Centred vertically in the sticky frame */}
          <div className="flex h-full items-center">
            {/* The flex row that slides left */}
            <div
              ref={trackRef}
              className="flex items-stretch gap-5 pl-5 sm:pl-8 md:pl-12 lg:pl-16"
              style={{ width: "max-content" }}
            >
              {/* Leading blurb */}
              <div
                className="flex shrink-0 flex-col justify-center"
                style={{ width: "min(65vw, 300px)" }}
              >
                <p className="font-body text-sm leading-[1.85] text-white/35 md:text-base">
                  Turning financial complexity<br />into clarity — one dataset<br />at a time.
                </p>
                <div className="mt-6 flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.35em] text-white/20">
                  <span className="h-px w-8 bg-white/20" />
                  <span>Scroll to explore</span>
                </div>
              </div>

              {/* Project cards */}
              {projects.map((project, i) => (
                <div
                  key={project.slug}
                  className="shrink-0"
                  style={{
                    width: "min(80vw, 460px)",
                    height: "clamp(360px, 52vh, 520px)",
                  }}
                >
                  <ProjectCard project={project} index={i} />
                </div>
              ))}

              {/* Trailing CTA */}
              <div
                className="flex shrink-0 flex-col items-center justify-center pr-16"
                style={{ width: "min(65vw, 320px)" }}
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
        </div>
      </div>
    </section>
  );
}
