"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";

/* ─── Project card ────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const metrics = project.metrics.filter((m) => m.numeric > 0).slice(0, 2);

  return (
    <Link href={`/projects/${project.slug}`} data-cursor="interactive" className="block h-full">
      <div className="group relative flex h-full flex-col border border-white/10 bg-[#060810] p-7 transition-all duration-500 hover:border-accent-blue/40 hover:bg-[#040916] sm:p-9">
        <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent-violet/0 blur-3xl transition duration-700 group-hover:bg-accent-violet/25" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-accent-blue/0 blur-3xl transition duration-700 group-hover:bg-accent-blue/18" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/0 to-transparent transition duration-500 group-hover:via-accent-blue/80" />

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
              whileHover={{ rotate: 45, scale: 1.08 }}
            >
              <ArrowUpRight className="h-4 w-4" />
            </motion.span>
          </div>

          <div className="mt-10 flex-1">
            <h3 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-[2.2rem]">
              {project.title.toUpperCase()}
            </h3>
            <p className="font-body mt-5 text-sm leading-[1.85] text-white/45 transition duration-500 group-hover:text-white/70">
              {project.tagline}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {metrics.map((m, mi) => (
              <div
                key={m.label}
                className="border border-white/8 bg-black/40 p-4 transition duration-300 group-hover:border-accent-blue/30 group-hover:bg-accent-blue/[0.07]"
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
            <motion.span
              className="h-px bg-accent-blue"
              initial={{ width: 0 }}
              whileHover={{ width: 40 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Finance ticker ──────────────────────────────────────────── */
function FinanceTicker() {
  const TERMS = [
    "EBITDA","ROI","IRR","NPV","CAGR","SHARPE RATIO","P&L ANALYSIS",
    "MIS REPORTING","ALPHA","VOLATILITY","ARIMA","REGRESSION",
    "FORECASTING","VaR","SQL AUTOMATION","SAP FICO","DCF MODEL","VALUATION",
  ];
  const doubled = [...TERMS, ...TERMS];
  return (
    <div className="relative overflow-hidden border-b border-white/8 py-2.5">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-5 px-5">
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/18">{t}</span>
            <span className="h-px w-4 bg-white/10" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated spotlight that tracks the centered card ─────────── */
function Spotlight({ x }: { x: number }) {
  const sx = useSpring(x, { stiffness: 60, damping: 18 });
  return (
    <motion.div
      className="pointer-events-none absolute top-1/2 z-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x: sx,
        background: "radial-gradient(circle, rgba(79,140,255,0.10) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

/* ─── Progress bar ────────────────────────────────────────────── */
function ProgressBar({ progress, total }: { progress: number; total: number }) {
  const active = Math.min(Math.ceil(progress * total), total);
  return (
    <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
      {/* Dot indicators */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const filled = progress * total > i;
          return (
            <motion.div
              key={i}
              className="rounded-full bg-white/20"
              animate={filled
                ? { width: 18, height: 4, backgroundColor: "rgba(79,140,255,0.9)" }
                : { width: 6, height: 4, backgroundColor: "rgba(255,255,255,0.2)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </div>
      <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/25 tabular-nums">
        {active} / {total}
      </span>
    </div>
  );
}

/* ─── Main section ────────────────────────────────────────────── */
export function Projects() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const spotlightX  = useMotionValue(0);

  const { lite } = usePerfFlags();

  useEffect(() => {
    if (lite) return;
    registerGsap();

    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    let tween: gsap.core.Tween | null = null;

    const applyCardLoom = (scrollX: number) => {
      const vwCenter = window.innerWidth / 2;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const rect    = card.getBoundingClientRect();
        const cardCx  = rect.left + rect.width / 2;
        const dist    = (cardCx - vwCenter) / window.innerWidth; // -1…0…1

        // Clamp and compute transforms
        const absDist = Math.abs(dist);
        const scale   = 1 - absDist * 0.14;           // 0.86 … 1
        const opacity = 1 - absDist * 0.65;            // 0.35 … 1
        const rotY    = dist * 14;                      // -14deg … 14deg
        const blur    = absDist * 4;                    // 0 … 4px

        gsap.set(card, {
          scale:         Math.max(0.82, scale),
          opacity:       Math.max(0.25, opacity),
          rotateY:       rotY,
          filter:        `blur(${blur.toFixed(1)}px)`,
          transformOrigin: dist > 0 ? "left center" : "right center",
          z:             -absDist * 120,
        });
      });

      // Spotlight follows the most-centred card
      let bestCard = cardRefs.current[0];
      let bestDist = Infinity;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const d    = Math.abs(rect.left + rect.width / 2 - vwCenter);
        if (d < bestDist) { bestDist = d; bestCard = card; }
      });
      if (bestCard) {
        const rect = bestCard.getBoundingClientRect();
        spotlightX.set(rect.left + rect.width / 2);
      }
    };

    const setup = () => {
      tween?.kill();
      ScrollTrigger.getAll().filter((t) => t.vars.trigger === section).forEach((t) => t.kill());

      requestAnimationFrame(() => {
        const scrollDist = Math.max(0, track.scrollWidth - window.innerWidth);
        if (scrollDist === 0) return;

        section.style.height = `${window.innerHeight + scrollDist}px`;
        gsap.set(track, { x: 0 });

        // Initial state: all cards off to the right, tilted
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          gsap.set(card, { opacity: 0, scale: 0.9, rotateY: 12, y: 30 });
        });

        tween = gsap.to(track, {
          x: -scrollDist,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDist}`,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onEnter() {
              // Entrance animation: first visible cards animate in
              cardRefs.current.forEach((card, i) => {
                if (!card) return;
                gsap.to(card, {
                  opacity: 1,
                  y: 0,
                  delay: i * 0.08,
                  duration: 0.7,
                  ease: "power3.out",
                });
              });
            },
            onUpdate(self) {
              setProgress(self.progress);
              applyCardLoom(-scrollDist * self.progress);
            },
          },
        });

        // Run once for initial positions
        applyCardLoom(0);
      });
    };

    const r1 = requestAnimationFrame(() => requestAnimationFrame(setup));

    const onResize = () => {
      if (section) section.style.height = "";
      setup();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(r1);
      window.removeEventListener("resize", onResize);
      tween?.kill();
      ScrollTrigger.getAll().filter((t) => t.vars.trigger === section).forEach((t) => t.kill());
    };
  }, [lite, spotlightX]);

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

  /* ── Full mode: sticky + GSAP horizontal scroll + 3D loom ── */
  return (
    <section id="projects" ref={sectionRef} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(79,140,255,0.06),transparent)]" />

        {/* Moving spotlight */}
        <Spotlight x={spotlightX.get()} />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-20 px-5 pt-5 sm:px-8 md:px-12 lg:px-16">
          <div className="flex items-center gap-4 mb-2">
            <span className="section-num">02 / WORK</span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/25 to-transparent" />
            <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/22 tabular-nums">
              {Math.round(progress * projects.length * 10) / 10} / {projects.length}
            </span>
          </div>
          <FinanceTicker />
        </div>

        {/* Left / right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#030303] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#030303] to-transparent" />

        {/* Track wrapper — centred vertically */}
        <div className="flex h-full items-center" style={{ paddingTop: "72px", paddingBottom: "56px" }}>
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 pl-5 sm:pl-8 md:pl-12 lg:pl-16"
            style={{ width: "max-content" }}
          >
            {/* Leading blurb */}
            <div className="flex shrink-0 flex-col justify-center" style={{ width: "min(60vw, 260px)" }}>
              <h2
                className="section-heading-bold leading-tight"
                style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)" }}
              >
                WORK THAT<br />MOVED THE<br />NUMBERS.
              </h2>
              <p className="font-body mt-4 text-sm leading-[1.8] text-white/32">
                Turning financial complexity<br />into clarity — one dataset<br />at a time.
              </p>
              <div className="mt-5 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.38em] text-white/18">
                <motion.span
                  className="h-px bg-white/25"
                  animate={{ width: [20, 36, 20] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span>Scroll to explore</span>
              </div>
            </div>

            {/* Project cards — each gets a ref for loom + entrance */}
            {projects.map((project, i) => (
              <div
                key={project.slug}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="shrink-0"
                style={{
                  width: "min(80vw, 460px)",
                  height: "clamp(340px, 58vh, 530px)",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                }}
              >
                <ProjectCard project={project} index={i} />
              </div>
            ))}

            {/* Trailing CTA */}
            <div
              className="flex shrink-0 flex-col items-center justify-center pr-16"
              style={{ width: "min(60vw, 280px)" }}
            >
              <Link
                href="#contact"
                data-cursor="interactive"
                className="group flex flex-col items-center gap-4 text-center"
              >
                <motion.span
                  className="font-display font-bold text-white/15"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                  whileHover={{ color: "rgba(255,255,255,0.65)" }}
                >
                  LET&apos;S BUILD
                </motion.span>
                <motion.span
                  className="font-display font-bold text-white/15"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                  whileHover={{ color: "rgba(79,140,255,1)" }}
                >
                  SOMETHING.
                </motion.span>
                <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.4em] text-accent-blue/45">
                  Get in touch ↗
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll progress dots */}
        <ProgressBar progress={progress} total={projects.length} />
      </div>
    </section>
  );
}
