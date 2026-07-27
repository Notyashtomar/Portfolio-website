"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { experience } from "@/data/resume";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { usePerfFlags } from "@/components/providers/Providers";
import { easeOut, springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FLOAT_NODES = [
  { label: "SQL", x: 18, y: 16, delay: 0 },
  { label: "Excel", x: 68, y: 22, delay: 0.4 },
  { label: "Power BI", x: 42, y: 38, delay: 0.8 },
  { label: "Python", x: 78, y: 52, delay: 1.1 },
  { label: "MIS", x: 28, y: 62, delay: 1.4 },
  { label: "KPIs", x: 62, y: 74, delay: 1.7 },
];

function ExperienceAtmosphere() {
  const { lite } = usePerfFlags();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ySlow = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const yFast = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 28]);

  const particles = useMemo(
    () =>
      Array.from({ length: lite ? 6 : 14 }, (_, i) => ({
        id: i,
        left: 8 + ((i * 37) % 84),
        top: 6 + ((i * 53) % 88),
        size: 1.5 + (i % 3),
        duration: 4.5 + (i % 5),
        delay: (i % 7) * 0.3,
      })),
    [lite],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] overflow-hidden lg:block"
    >
      <motion.div
        style={{ y: ySlow }}
        className="absolute right-[-10%] top-[8%] h-[42%] w-[70%] rounded-full bg-accent-blue/12 blur-[90px] will-change-transform"
      />
      <motion.div
        style={{ y: yFast }}
        className="absolute bottom-[6%] right-[4%] h-[38%] w-[58%] rounded-full bg-accent-violet/14 blur-[100px] will-change-transform"
      />

      <motion.div
        style={{ rotate }}
        className="absolute right-[8%] top-[18%] h-[300px] w-[300px] will-change-transform"
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-accent-blue/15"
          animate={inView && !lite ? { rotate: 360 } : {}}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-10 rounded-full border border-dashed border-accent-violet/18"
          animate={inView && !lite ? { rotate: -360 } : {}}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue shadow-[0_0_20px_rgba(79,140,255,0.85)]" />
        {!lite
          ? [0, 1].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                animate={inView ? { rotate: 360 } : {}}
                transition={{
                  duration: 18 + i * 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span
                  className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/70"
                  style={{ marginTop: i * 40 }}
                />
              </motion.div>
            ))
          : null}
      </motion.div>

      {FLOAT_NODES.map((node) => (
        <motion.div
          key={node.label}
          className="absolute rounded-full border border-white/10 bg-black/45 px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.22em] text-white/50 backdrop-blur-sm"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          animate={
            inView && !lite
              ? { opacity: [0.3, 0.75, 0.3], y: [0, -8, 0] }
              : { opacity: 0.45 }
          }
          transition={{
            delay: node.delay,
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {node.label}
        </motion.div>
      ))}

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/45"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={
            inView
              ? { opacity: [0.12, 0.7, 0.12], y: [0, -14, 0] }
              : { opacity: 0.2 }
          }
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ExperienceCard({
  role,
  index,
}: {
  role: (typeof experience)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const expanded = !canHover || open;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.1, duration: 0.65, ease: easeOut }}
      className="relative md:pl-12"
      onMouseEnter={() => canHover && setOpen(true)}
      onMouseLeave={() => canHover && setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div
        className={cn(
          "absolute left-0 top-10 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-accent-blue bg-[#030303] transition duration-300 md:left-5 md:block",
          expanded
            ? "scale-125 shadow-[0_0_28px_rgba(79,140,255,1)]"
            : "shadow-[0_0_20px_rgba(79,140,255,0.7)]",
        )}
      />

      <motion.article
        tabIndex={0}
        data-cursor="interactive"
        animate={expanded && canHover ? { y: -6 } : { y: 0 }}
        transition={springSoft}
        className={cn(
          "interactive-card relative overflow-hidden rounded-[28px] border bg-white/[0.025] p-6 outline-none sm:p-8",
          expanded
            ? "border-accent-blue/40 bg-white/[0.045] shadow-[0_24px_70px_rgba(79,140,255,0.16)]"
            : "border-white/8",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-accent-blue/25 blur-3xl transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="relative z-10">
          <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-accent-blue">
            {role.period}
          </p>
          <h3 className="font-display mt-3 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            {role.company}
          </h3>
          <p className="font-body mt-2 text-muted">{role.role}</p>

          {canHover ? (
            <p
              className={cn(
                "font-sans mt-5 text-[10px] uppercase tracking-[0.28em] text-white/30 transition-opacity duration-250",
                expanded ? "pointer-events-none opacity-0" : "opacity-100",
              )}
            >
              Hover for details
            </p>
          ) : null}

          <div
            className={cn(
              "grid transition-[grid-template-rows,margin] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
              expanded ? "mt-6 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <ul
                className={cn(
                  "space-y-4 transition-opacity duration-300",
                  expanded ? "opacity-100" : "opacity-0",
                )}
              >
                {role.highlights.map((item, hi) => (
                  <li
                    key={item}
                    className="font-body flex gap-4 border-t border-white/6 pt-4 text-sm leading-[1.75] text-muted first:border-t-0 first:pt-0"
                    style={{
                      transition: "opacity 300ms ease, transform 300ms ease",
                      transitionDelay: expanded ? `${60 + hi * 45}ms` : "0ms",
                      opacity: expanded ? 1 : 0,
                      transform: expanded ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    <span className="font-sans shrink-0 text-[10px] text-accent-gold/80">
                      {String(hi + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

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
            end: "bottom 25%",
            scrub: 1.2,
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
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <ExperienceAtmosphere />

      <div className="relative z-10 mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-violet/80">
          Experience
        </p>
        <SplitReveal
          text="Companies that shaped the craft."
          as="h2"
          mode="words"
          className="mb-12 max-w-4xl text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] text-white sm:mb-20 md:mb-28"
        />

        <div className="relative lg:max-w-[54%]">
          <div
            ref={lineRef}
            className="absolute left-[7px] top-0 hidden h-full w-px origin-top bg-gradient-to-b from-accent-blue via-accent-violet/50 to-transparent md:left-5 md:block"
          />

          <div className="space-y-8 md:space-y-10">
            {experience.map((role, index) => (
              <ExperienceCard key={role.id} role={role} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
