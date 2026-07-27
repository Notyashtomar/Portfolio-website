"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { projects } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { usePerfFlags } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { lite } = usePerfFlags();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 180, damping: 24 });
  const springY = useSpring(my, { stiffness: 180, damping: 24 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(79,140,255,0.22), rgba(139,92,246,0.08), transparent 45%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (lite) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  const onLeave = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(rect.width / 2);
    my.set(rect.height / 2);
  };

  const metrics = project.metrics.filter((m) => m.numeric > 0).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 72, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        delay: index * 0.12,
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1400 }}
      className="h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="interactive"
        className="block h-full"
      >
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          whileHover={lite ? undefined : { y: -10, scale: 1.015 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={cn(
            "group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.025] p-6 sm:min-h-[400px] sm:p-8 lg:min-h-[440px]",
            "transition-[border-color,box-shadow] duration-500 hover:border-accent-blue/35",
            "hover:shadow-[0_30px_90px_rgba(79,140,255,0.16),0_0_0_1px_rgba(79,140,255,0.08)]",
          )}
        >
          {!lite ? (
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
              style={{ background: glow }}
            />
          ) : null}

          {/* Corner accent sweep */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-accent-violet/0 blur-3xl transition duration-500 group-hover:bg-accent-violet/20" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-accent-blue/0 blur-3xl transition duration-500 group-hover:bg-accent-blue/15" />

          {/* Top shine line */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-0 group-hover:opacity-100"
            initial={false}
            whileHover={{ scaleX: 1 }}
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-auto flex items-start justify-between gap-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-accent-violet transition group-hover:text-accent-blue">
                {project.subtitle}
              </span>
              <motion.span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/35 transition group-hover:border-accent-blue/40 group-hover:bg-accent-blue/15 group-hover:text-white"
                whileHover={{ rotate: 45 }}
              >
                <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.span>
            </div>

            <div className="mt-10 sm:mt-14">
              <h3 className="font-display text-2xl font-semibold leading-[1.15] text-white transition duration-500 group-hover:text-shimmer sm:text-3xl md:text-[2.1rem]">
                {project.title}
              </h3>
              <p className="font-body mt-5 text-sm leading-[1.8] text-muted transition group-hover:text-white/70">
                {project.tagline}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10">
              {metrics.map((metric, mi) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.35 + index * 0.1 + mi * 0.08,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-2xl border border-white/8 bg-black/30 px-3 py-3 transition duration-300 group-hover:border-accent-blue/30 group-hover:bg-accent-blue/[0.07] sm:px-4 sm:py-4"
                >
                  <p className="font-display text-2xl font-semibold text-white sm:text-3xl">
                    <AnimatedCounter
                      value={metric.numeric}
                      suffix={metric.suffix}
                      duration={1.4 + mi * 0.15}
                    />
                  </p>
                  <p className="font-sans mt-2 text-[9px] uppercase tracking-[0.18em] text-white/45 sm:text-[10px] sm:tracking-[0.2em]">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.28em] text-white/30 transition group-hover:text-accent-blue/80">
              <span>View case study</span>
              <span className="h-px w-0 bg-accent-blue transition-all duration-500 group-hover:w-8" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function Projects() {
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
