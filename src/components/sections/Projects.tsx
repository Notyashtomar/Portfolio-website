"use client";

import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { usePerfFlags } from "@/components/providers/Providers";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Ticker ──────────────────────────────────────────────────── */
function Ticker() {
  const TERMS = [
    "FRIS", "18 AIRPORTS", "RMS", "SMS", "BILLING ENGINE", "CRM SUITE",
    "ROLE-BASED ACCESS", "AUDIT TRAIL", "DATA MODELING", "SQL PIPELINES",
    "POWER BI", "PROMPT ENGINEERING", "LOOP ENGINEERING", "UAT",
    "MIS REPORTING", "FORECASTING",
  ];
  const doubled = [...TERMS, ...TERMS];
  return (
    <div className="relative overflow-hidden border-y border-white/8 py-2.5">
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

/* ─── 3D tilt card ────────────────────────────────────────────── */
function ProjectCard3D({
  project,
  index,
  total,
  interactive,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
  interactive: boolean;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 160, damping: 20 });
  const rotY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 160, damping: 20 });
  const sheenX = useTransform(px, [0, 1], ["0%", "100%"]);
  const sheenY = useTransform(py, [0, 1], ["0%", "100%"]);
  const sheen = useMotionTemplate`radial-gradient(520px circle at ${sheenX} ${sheenY}, rgba(79,140,255,0.16), transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const metrics = project.metrics.filter((m) => m.numeric > 0).slice(0, 3);
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link href={`/projects/${project.slug}`} data-cursor="interactive" className="block h-full">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#070910]"
        style={{
          rotateX: interactive ? rotX : 0,
          rotateY: interactive ? rotY : 0,
          transformStyle: "preserve-3d",
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.02) inset, 0 0 80px rgba(79,140,255,0.08)",
        }}
      >
        {/* Sheen following the pointer */}
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: sheen }} />

        {/* Ambient gradients */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-violet/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-accent-blue/12 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/70 to-transparent" />

        {/* Watermark */}
        <span
          className="pointer-events-none absolute -bottom-6 right-4 select-none font-display font-bold leading-none text-white/[0.035]"
          style={{ fontSize: "clamp(120px, 22vw, 260px)", transform: "translateZ(-40px)" }}
        >
          {num}
        </span>

        <div
          className="relative z-10 grid h-full gap-5 p-6 sm:gap-8 sm:p-10 md:grid-cols-[1.35fr_1fr] md:p-12 lg:p-14"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Left — copy */}
          <div className="flex flex-col" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center gap-4">
              <span className="section-num">{num} / {String(total).padStart(2, "0")}</span>
              <span className="h-px w-10 bg-accent-blue/30" />
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-accent-violet/80">
                {project.subtitle}
              </span>
            </div>

            <h3
              className="mt-6 font-display font-bold leading-[0.98] tracking-[-0.03em] text-white"
              style={{ fontSize: "clamp(1.5rem, 4.4vw, 3.9rem)" }}
            >
              {project.title.toUpperCase()}
            </h3>

            <p className="font-body mt-4 line-clamp-3 max-w-xl text-[13px] leading-[1.75] text-white/50 sm:mt-5 sm:line-clamp-none sm:text-[15px] sm:leading-[1.85]">
              {project.tagline}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-sans text-[9px] uppercase tracking-[0.22em] text-white/45"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-auto hidden items-center gap-3 pt-8 font-sans text-[10px] uppercase tracking-[0.32em] text-white/35 transition group-hover:text-accent-blue sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] transition duration-500 group-hover:rotate-45 group-hover:border-accent-blue/60 group-hover:bg-accent-blue/15">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <span>Open case study</span>
              <span className="h-px w-0 bg-accent-blue transition-all duration-500 group-hover:w-12" />
            </div>
          </div>

          {/* Right — metrics */}
          <div
            className="grid grid-cols-3 gap-2 self-end md:flex md:flex-col md:justify-center md:gap-3 md:self-auto"
            style={{ transform: "translateZ(50px)" }}
          >
            {metrics.map((m, mi) => (
              <div
                key={m.label}
                className="rounded-xl border border-white/8 bg-black/40 p-3 backdrop-blur-sm transition duration-500 group-hover:border-accent-blue/30 group-hover:bg-accent-blue/[0.06] sm:rounded-2xl sm:p-5"
              >
                <p className="font-display text-xl font-bold text-white sm:text-3xl md:text-4xl">
                  <AnimatedCounter value={m.numeric} suffix={m.suffix} duration={1.2 + mi * 0.15} />
                </p>
                <p className="font-sans mt-1 text-[8px] uppercase tracking-[0.16em] text-white/35 sm:mt-1.5 sm:text-[9px] sm:tracking-[0.24em]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── One layer of the scroll deck ────────────────────────────── */
function DeckLayer({
  project,
  index,
  total,
  progress,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const step = 1 / total;
  const enterStart = Math.max(0, (index - 1) * step);
  const active = index * step;
  const exitEnd = Math.min(1, (index + 1) * step);
  const isLast = index === total - 1;

  // Enter: rise from below, tilted back; Exit: sink into depth as the next card arrives.
  const rotateX = useTransform(progress, [enterStart, active, exitEnd], [18, 0, isLast ? 0 : -8]);
  const scale = useTransform(progress, [enterStart, active, exitEnd], [0.9, 1, isLast ? 1 : 0.86]);
  const y = useTransform(progress, [enterStart, active, exitEnd], [80, 0, isLast ? 0 : -60]);
  const shade = useTransform(progress, [active, exitEnd], [0, isLast ? 0 : 0.72]);

  return (
    <div
      className="sticky top-0 flex h-[100svh] items-center justify-center px-4 sm:px-8"
      style={{ perspective: "1600px", zIndex: index + 1 }}
    >
      <motion.div
        className="relative w-full max-w-[1120px] will-change-transform"
        style={{
          rotateX,
          scale,
          y,
          height: "min(74svh, 680px)",
          transformStyle: "preserve-3d",
          transformOrigin: "50% 30%",
        }}
      >
        <ProjectCard3D project={project} index={index} total={total} interactive />

        {/* Depth shade — darkens cards that have receded */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[28px] bg-[#030303]"
          style={{ opacity: shade }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Section header with 3D opening ──────────────────────────── */
function Header() {
  return (
    <div className="relative px-5 pb-10 pt-24 sm:px-8 md:px-12 lg:px-16" style={{ perspective: "1200px" }}>
      <div className="mx-auto max-w-[90rem]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="section-num">02 / WORK</span>
          <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/30 to-transparent" />
          <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-white/25">
            {projects.length} production systems
          </span>
        </motion.div>

        <motion.h2
          className="section-heading-bold max-w-5xl"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
        >
          {["SYSTEMS THAT", "RUN THE", "OPERATION."].map((line, i) => (
            <span key={line} className="block overflow-hidden" style={{ perspective: "900px" }}>
              <motion.span
                className="block origin-bottom"
                variants={{
                  hidden: { opacity: 0, rotateX: -70, y: "60%" },
                  shown: {
                    opacity: 1,
                    rotateX: 0,
                    y: "0%",
                    transition: { delay: 0.1 + i * 0.12, duration: 1, ease: EASE },
                  },
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
          className="font-body mt-8 max-w-xl text-base leading-[1.8] text-white/40"
        >
          Five production platforms for aviation ground operations at Bird Group, plus the
          analytics work that preceded them. Scroll to move through the deck.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-12"
      >
        <Ticker />
      </motion.div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────── */
export function Projects() {
  const deckRef = useRef<HTMLDivElement>(null);
  const { lite } = usePerfFlags();
  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  });

  if (lite) {
    return (
      <section id="projects" className="relative">
        <Header />
        <div className="mx-auto grid max-w-[90rem] gap-5 px-5 pb-24 pt-10 sm:px-8 md:px-12 lg:px-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: 0.05, duration: 0.7, ease: EASE }}
              style={{ minHeight: 420 }}
            >
              <ProjectCard3D project={project} index={i} total={projects.length} interactive={false} />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative">
      <Header />

      {/* Deck — each layer is sticky; the wrapper height gives scroll room */}
      <div ref={deckRef} className="relative" style={{ height: `${projects.length * 100}svh` }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgba(79,140,255,0.07),transparent)]" />
        {projects.map((project, i) => (
          <DeckLayer
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      {/* Trailing CTA */}
      <div className="relative flex flex-col items-center justify-center px-6 py-28 text-center sm:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -25 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ perspective: "900px" }}
        >
          <Link href="#contact" data-cursor="interactive" className="group flex flex-col items-center gap-2">
            <span className="font-display font-bold text-white" style={{ fontSize: "clamp(1.8rem, 5vw, 3.6rem)" }}>
              LET&apos;S BUILD
            </span>
            <span className="font-display font-bold text-accent-blue" style={{ fontSize: "clamp(1.8rem, 5vw, 3.6rem)" }}>
              SOMETHING.
            </span>
            <span className="mt-3 font-sans text-[10px] uppercase tracking-[0.4em] text-accent-blue/70 transition group-hover:text-accent-blue">
              Get in touch ↗
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
