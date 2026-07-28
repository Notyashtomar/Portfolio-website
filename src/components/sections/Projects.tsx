"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
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
  isCenter,
  dimmed,
}: {
  project: (typeof projects)[number];
  index: number;
  isCenter: boolean;
  dimmed: boolean;
}) {
  const metrics = project.metrics.filter((m) => m.numeric > 0).slice(0, 2);

  return (
    <Link href={`/projects/${project.slug}`} data-cursor="interactive" className="block h-full">
      <motion.div
        className="group relative flex h-full flex-col border bg-[#060810] p-7 sm:p-9"
        animate={{
          borderColor: isCenter ? "rgba(79,140,255,0.5)" : "rgba(255,255,255,0.08)",
          boxShadow: isCenter
            ? "0 0 60px rgba(79,140,255,0.18), 0 0 120px rgba(79,140,255,0.08)"
            : "none",
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Hover glows */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent-violet/0 blur-3xl transition duration-700 group-hover:bg-accent-violet/28" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-accent-blue/0 blur-3xl transition duration-700 group-hover:bg-accent-blue/20" />

        {/* Active top bar */}
        <motion.div
          className="absolute inset-x-0 top-0 h-0.5"
          animate={{
            background: isCenter
              ? "linear-gradient(90deg, transparent, #4f8cff, #8b5cf6, transparent)"
              : "transparent",
            opacity: isCenter ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Card number watermark */}
        <span
          className="pointer-events-none absolute right-5 bottom-5 font-display text-[80px] font-bold leading-none select-none"
          style={{ color: isCenter ? "rgba(79,140,255,0.06)" : "rgba(255,255,255,0.03)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

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

          <div className="mt-8 flex-1">
            <h3 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-[2.2rem]">
              {project.title.toUpperCase()}
            </h3>
            <p className="font-body mt-4 text-sm leading-[1.85] text-white/45 transition duration-500 group-hover:text-white/70">
              {project.tagline}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {metrics.map((m, mi) => (
              <motion.div
                key={m.label}
                className="border border-white/8 bg-black/40 p-4 transition duration-300 group-hover:bg-accent-blue/[0.07]"
                animate={{ borderColor: isCenter ? "rgba(79,140,255,0.25)" : "rgba(255,255,255,0.08)" }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-display text-3xl font-bold text-white">
                  <AnimatedCounter value={m.numeric} suffix={m.suffix} duration={1.4 + mi * 0.15} />
                </p>
                <p className="font-sans mt-1.5 text-[9px] uppercase tracking-[0.22em] text-white/35">{m.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.32em] text-white/25 transition group-hover:text-accent-blue/80">
            <span>Case Study</span>
            <span className="h-px w-0 bg-accent-blue transition-all duration-500 group-hover:w-10" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Finance ticker ──────────────────────────────────────────── */
function FinanceTicker() {
  const TERMS = [
    "EBITDA","ROI","IRR","NPV","CAGR","SHARPE RATIO","P&L ANALYSIS",
    "MIS REPORTING","ALPHA","VOLATILITY","ARIMA","REGRESSION",
    "FORECASTING","VaR","SQL AUTOMATION","SAP FICO","DCF MODEL","VALUATION",
    "BUDGET VARIANCE","LIQUIDITY RATIO","WORKING CAPITAL","EBITDA MARGIN",
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

/* ─── Spotlight that follows the centered card ─────────────────── */
function Spotlight({ x }: { x: number }) {
  const sx = useSpring(x, { stiffness: 50, damping: 16 });
  return (
    <motion.div
      className="pointer-events-none absolute top-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x: sx,
        background: "radial-gradient(circle, rgba(79,140,255,0.14) 0%, transparent 65%)",
        filter: "blur(50px)",
      }}
    />
  );
}

/* ─── Progress dots ───────────────────────────────────────────── */
function ProgressDots({ progress, total, center }: { progress: number; total: number; center: number }) {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === center;
          const isPast   = progress * total > i + 0.5;
          return (
            <motion.div
              key={i}
              className="rounded-full"
              animate={isActive
                ? { width: 24, height: 5, backgroundColor: "rgba(79,140,255,1)", boxShadow: "0 0 10px rgba(79,140,255,0.8)" }
                : isPast
                ? { width: 8,  height: 4, backgroundColor: "rgba(79,140,255,0.4)", boxShadow: "none" }
                : { width: 6,  height: 4, backgroundColor: "rgba(255,255,255,0.15)", boxShadow: "none" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={center}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/30 tabular-nums"
        >
          {String(center + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ─── Main section ────────────────────────────────────────────── */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const spacerRef  = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress]       = useState(0);
  const [centerIdx, setCenterIdx]     = useState(0);
  const [hoveredIdx, setHoveredIdx]   = useState<number | null>(null);
  const spotlightX = useMotionValue(0);

  const { lite } = usePerfFlags();

  useEffect(() => {
    if (lite) return;
    registerGsap();

    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    let tween: gsap.core.Tween | null = null;

    const applyLoom = () => {
      const vwCenter = window.innerWidth / 2;
      let bestDist = Infinity;
      let bestIdx  = -1;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const rect    = card.getBoundingClientRect();
        const cardCx  = rect.left + rect.width / 2;
        const dist    = (cardCx - vwCenter) / window.innerWidth; // -1…1
        const absDist = Math.abs(dist);

        // Deeper 3-D loom
        const scale   = Math.max(0.78, 1 - absDist * 0.20);
        const opacity = Math.max(0.15, 1 - absDist * 0.80);
        const rotY    = dist * 18;
        const transY  = absDist * 28;           // non-centre cards dip down
        const blur    = absDist * 6;

        gsap.set(card, {
          scale,
          opacity,
          rotateY:     rotY,
          y:           transY,
          filter:      `blur(${blur.toFixed(1)}px)`,
          zIndex:      Math.round(10 - absDist * 10),
          transformOrigin: dist > 0 ? "left center" : "right center",
        });

        const d = Math.abs(cardCx - vwCenter);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });

      setCenterIdx(bestIdx);
      if (bestIdx >= 0 && cardRefs.current[bestIdx]) {
        const r = cardRefs.current[bestIdx]!.getBoundingClientRect();
        spotlightX.set(r.left + r.width / 2);
      }
    };

    const setup = () => {
      tween?.kill();
      ScrollTrigger.getAll().filter((t) => t.vars.trigger === section).forEach((t) => t.kill());

      const spacer = spacerRef.current;
      if (spacer) spacer.style.width = "0px";
      gsap.set(track, { x: 0 });

      // Pass 1: measure natural position of card 0, then grow the spacer
      // so card 0's centre lands exactly on the viewport centre at scroll start.
      requestAnimationFrame(() => {
        const firstCard = cardRefs.current[0];
        if (spacer && firstCard) {
          const rect   = firstCard.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          const delta  = Math.max(0, window.innerWidth / 2 - center);
          spacer.style.width = `${delta}px`;
        }

        // Pass 2: layout has settled with the spacer applied — now measure
        // real scroll distance and build the trigger.
        requestAnimationFrame(() => {
          const scrollDist = Math.max(0, track.scrollWidth - window.innerWidth);
          if (scrollDist === 0) return;

          // Extra scroll runway (×1.6) so the horizontal slide feels slower
          // per pixel of vertical scroll, without changing the x range.
          const runway = scrollDist * 1.6;
          section.style.height = `${window.innerHeight + runway}px`;

          gsap.set(track, { x: 0 });
          applyLoom();

          tween = gsap.to(track, {
            x: -scrollDist,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${runway}`,
              scrub: 2,
              invalidateOnRefresh: true,
              onUpdate(self) {
                setProgress(self.progress);
                applyLoom();
              },
            },
          });
        });
      });
    };

    const r1 = requestAnimationFrame(() => requestAnimationFrame(setup));
    const onResize = () => { if (section) section.style.height = ""; setup(); };
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
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} index={i} isCenter={false} dimmed={false} />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  /* ── Full mode ── */
  return (
    <section id="projects" ref={sectionRef} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 52%" }}
      >
        {/* Ambient radial */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_55%,rgba(79,140,255,0.07),transparent)]" />

        {/* Spotlight on centered card */}
        <Spotlight x={spotlightX.get()} />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-20 px-5 pt-5 sm:px-8 md:px-12 lg:px-16">
          <div className="mb-2 flex items-center gap-4">
            <span className="section-num">02 / WORK</span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/25 to-transparent" />
            <AnimatePresence mode="wait">
              <motion.span
                key={centerIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/25 tabular-nums"
              >
                {centerIdx >= 0 ? projects[centerIdx]?.title : ""}
              </motion.span>
            </AnimatePresence>
          </div>
          <FinanceTicker />
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#030303] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#030303] to-transparent" />

        {/* Track */}
        <div className="flex h-full items-center" style={{ paddingTop: "72px", paddingBottom: "60px" }}>
          <div
            ref={trackRef}
            className="flex items-center gap-5 pl-5 sm:pl-8 md:pl-12 lg:pl-16"
            style={{ width: "max-content" }}
          >
            {/* Leading blurb */}
            <div className="flex shrink-0 flex-col justify-center" style={{ width: "min(55vw, 240px)" }}>
              <h2 className="section-heading-bold leading-tight" style={{ fontSize: "clamp(1.4rem,3vw,2.4rem)" }}>
                WORK THAT<br />MOVED THE<br />NUMBERS.
              </h2>
              <p className="font-body mt-4 text-sm leading-[1.8] text-white/30">
                Turning financial complexity into clarity — one dataset at a time.
              </p>
              <div className="mt-5 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.38em] text-white/18">
                <motion.span
                  className="h-px bg-white/22"
                  animate={{ width: [16, 32, 16] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span>Scroll to explore</span>
              </div>
            </div>

            {/* Dynamic spacer — grown via JS so card 1 centres exactly at scroll start */}
            <div ref={spacerRef} className="shrink-0" style={{ width: 0 }} aria-hidden />

            {/* Project cards */}
            {projects.map((project, i) => (
              <div
                key={project.slug}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="shrink-0"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  width: "min(78vw, 440px)",
                  height: "clamp(360px, 60vh, 540px)",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                  cursor: "pointer",
                }}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  isCenter={centerIdx === i}
                  dimmed={hoveredIdx !== null && hoveredIdx !== i}
                />
              </div>
            ))}

            {/* Trailing CTA */}
            <div className="flex shrink-0 flex-col items-center justify-center pr-16" style={{ width: "min(55vw, 260px)" }}>
              <Link href="#contact" data-cursor="interactive" className="group flex flex-col items-center gap-4 text-center">
                <motion.span
                  className="font-display font-bold text-white/14"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
                  whileHover={{ color: "rgba(255,255,255,0.6)" }}
                >
                  LET&apos;S BUILD
                </motion.span>
                <motion.span
                  className="font-display font-bold text-white/14"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
                  whileHover={{ color: "rgba(79,140,255,1)" }}
                >
                  SOMETHING.
                </motion.span>
                <span className="mt-1 font-sans text-[10px] uppercase tracking-[0.4em] text-accent-blue/40">
                  Get in touch ↗
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <ProgressDots progress={progress} total={projects.length} center={centerIdx} />
      </div>
    </section>
  );
}
