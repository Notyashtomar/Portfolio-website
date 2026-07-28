"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
    <Link href={`/projects/${project.slug}`} data-cursor="interactive" className="block h-full">
      <div className="group relative flex h-full flex-col border border-white/10 bg-[#060810] p-7 transition-all duration-500 hover:border-accent-blue/40 hover:bg-[#040916] sm:p-9">
        {/* Hover glows */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-violet/0 blur-3xl transition duration-500 group-hover:bg-accent-violet/22" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-accent-blue/0 blur-3xl transition duration-500 group-hover:bg-accent-blue/16" />
        {/* Top border sweep */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/0 to-transparent transition duration-500 group-hover:via-accent-blue/70" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="section-num">{String(index + 1).padStart(2, "0")} / PROJECT</span>
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

          <div className="mt-10 flex-1">
            <h3 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-[2.2rem]">
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
                  <AnimatedCounter value={m.numeric} suffix={m.suffix} duration={1.4 + mi * 0.15} />
                </p>
                <p className="font-sans mt-1.5 text-[9px] uppercase tracking-[0.22em] text-white/35">{m.label}</p>
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
    "SAP FICO","DCF MODEL","VALUATION","LBO MODEL",
  ];
  const doubled = [...TERMS, ...TERMS];
  return (
    <div className="relative overflow-hidden border-y border-white/8 py-2.5">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/20">{t}</span>
            <span className="h-px w-4 bg-white/12" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Scroll progress bar ─────────────────────────────────────── */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
      <div className="h-px w-32 overflow-hidden rounded-full bg-white/10 sm:w-48">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-blue to-accent-violet"
          style={{ scaleX: progress, transformOrigin: "left" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
      <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/30">
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
}

/* ─── Main section ────────────────────────────────────────────── */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { lite } = usePerfFlags();

  useEffect(() => {
    if (lite) return;
    registerGsap();

    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    let tween: gsap.core.Tween | null = null;

    const setup = () => {
      tween?.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === section)
        .forEach((t) => t.kill());

      // Wait one frame for widths to settle
      requestAnimationFrame(() => {
        const scrollDist = Math.max(0, track.scrollWidth - window.innerWidth);
        if (scrollDist === 0) return;

        // Section needs to be tall enough to scroll through the full card width
        section.style.height = `${window.innerHeight + scrollDist}px`;

        gsap.set(track, { x: 0 });

        tween = gsap.to(track, {
          x: -scrollDist,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDist}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
            onUpdate(self) {
              setProgress(self.progress);
            },
          },
        });
      });
    };

    // Two rAF frames so fonts + layout are fully painted
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(setup);
      return r2;
    });

    const onResize = () => {
      if (section) section.style.height = "";
      setup();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(r1);
      window.removeEventListener("resize", onResize);
      tween?.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === section)
        .forEach((t) => t.kill());
    };
  }, [lite]);

  /* ── Lite / mobile: vertical grid ── */
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

  /* ── Full mode: sticky + GSAP x-translation ── */
  return (
    <section id="projects" ref={sectionRef} className="relative">
      {/*
        stickyRef pins to top: 0 for the full height of sectionRef.
        trackRef slides horizontally driven by GSAP.
        sectionRef height is set in JS = 100vh + (track.scrollWidth - vw).
      */}
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">

        {/* ── Top bar: section number + heading ── */}
        <div className="absolute inset-x-0 top-0 z-10 px-5 pt-6 sm:px-8 md:px-12 lg:px-16">
          <div className="flex items-center gap-4 mb-3">
            <span className="section-num">02 / WORK</span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/25 to-transparent" />
            {/* Live scroll counter */}
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/25 tabular-nums">
              {Math.round(progress * projects.length * 10) / 10} / {projects.length}
            </span>
          </div>
          <FinanceTicker />
        </div>

        {/* Horizontal fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#030303] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#030303] to-transparent" />

        {/* Vertically centred track */}
        <div className="flex h-full items-center" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 pl-5 sm:pl-8 md:pl-12 lg:pl-16"
            style={{ width: "max-content" }}
          >
            {/* Leading blurb */}
            <div
              className="flex shrink-0 flex-col justify-center"
              style={{ width: "min(65vw, 280px)" }}
            >
              <h2 className="section-heading-bold leading-tight" style={{ fontSize: "clamp(1.6rem,3.5vw,2.8rem)" }}>
                WORK THAT<br />MOVED THE<br />NUMBERS.
              </h2>
              <p className="font-body mt-5 text-sm leading-[1.85] text-white/35">
                Turning financial complexity<br />into clarity —<br />one dataset at a time.
              </p>
              <div className="mt-6 flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.35em] text-white/20">
                <span className="h-px w-8 bg-white/20" />
                <span>Scroll to explore</span>
              </div>
            </div>

            {/* Project cards */}
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                className="shrink-0"
                style={{
                  width: "min(80vw, 460px)",
                  height: "clamp(340px, 56vh, 520px)",
                }}
                initial={{ opacity: 0, scale: 0.94, x: 40 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2, root: stickyRef }}
                transition={{ delay: i * 0.06, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}

            {/* Trailing CTA */}
            <div
              className="flex shrink-0 flex-col items-center justify-center pr-16"
              style={{ width: "min(65vw, 300px)" }}
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

        {/* Scroll progress bar */}
        <ProgressBar progress={progress} />
      </div>
    </section>
  );
}
