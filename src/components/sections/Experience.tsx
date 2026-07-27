"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { experience } from "@/data/resume";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { usePerfFlags } from "@/components/providers/Providers";

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
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ySlow = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const yFast = useTransform(scrollYProgress, [0, 1], [80, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const particles = useMemo(
    () =>
      Array.from({ length: lite ? 8 : 18 }, (_, i) => ({
        id: i,
        left: 8 + ((i * 37) % 84),
        top: 6 + ((i * 53) % 88),
        size: 1.5 + (i % 3),
        duration: 4 + (i % 5),
        delay: (i % 7) * 0.35,
      })),
    [lite],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] overflow-hidden lg:block"
    >
      {/* Soft color fields */}
      <motion.div
        style={{ y: ySlow }}
        className="absolute right-[-10%] top-[8%] h-[42%] w-[70%] rounded-full bg-accent-blue/15 blur-[90px]"
      />
      <motion.div
        style={{ y: yFast }}
        className="absolute bottom-[6%] right-[4%] h-[38%] w-[58%] rounded-full bg-accent-violet/18 blur-[100px]"
      />
      <motion.div
        className="absolute right-[18%] top-[42%] h-40 w-40 rounded-full bg-accent-magenta/10 blur-[70px]"
        animate={
          inView && !lite
            ? { opacity: [0.25, 0.55, 0.25], scale: [0.9, 1.15, 0.9] }
            : { opacity: 0.3 }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbital rings */}
      <motion.div
        style={{ rotate }}
        className="absolute right-[8%] top-[18%] h-[320px] w-[320px]"
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-accent-blue/15"
          animate={inView && !lite ? { rotate: 360 } : {}}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 rounded-full border border-dashed border-accent-violet/20"
          animate={inView && !lite ? { rotate: -360 } : {}}
          transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-16 rounded-full border border-white/8"
          animate={
            inView && !lite
              ? { scale: [1, 1.06, 1], opacity: [0.35, 0.7, 0.35] }
              : {}
          }
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue shadow-[0_0_24px_rgba(79,140,255,0.9)]"
          animate={
            inView && !lite
              ? { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }
              : {}
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orbiting dots */}
        {!lite
          ? [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                animate={inView ? { rotate: 360 } : {}}
                transition={{
                  duration: 16 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.4,
                }}
              >
                <span
                  className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/75 shadow-[0_0_12px_rgba(255,255,255,0.65)]"
                  style={{ marginTop: i === 1 ? 32 : i === 2 ? 64 : 0 }}
                />
              </motion.div>
            ))
          : null}
      </motion.div>

      {/* Floating labels */}
      {FLOAT_NODES.map((node) => (
        <motion.div
          key={node.label}
          className="absolute rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.22em] text-white/55 backdrop-blur-md"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, y: 12 }}
          animate={
            inView
              ? {
                  opacity: [0.35, 0.85, 0.35],
                  y: [0, -10, 0],
                }
              : { opacity: 0 }
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

      {/* Particle field */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/50"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={
            inView
              ? {
                  opacity: [0.15, 0.8, 0.15],
                  y: [0, -18, 0],
                }
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

      {/* Vertical data stream lines */}
      {!lite
        ? [12, 28, 46, 64, 82].map((left, i) => (
            <motion.span
              key={left}
              className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-accent-blue/20 to-transparent"
              style={{ left: `${left}%` }}
              animate={
                inView
                  ? { opacity: [0.1, 0.45, 0.1], scaleY: [0.7, 1, 0.7] }
                  : {}
              }
              transition={{
                delay: i * 0.25,
                duration: 3.8 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        : null}
    </div>
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
            className="absolute left-[7px] top-0 hidden h-full w-px bg-gradient-to-b from-accent-blue via-accent-violet/50 to-transparent md:left-5 md:block"
          />

          <div className="space-y-8 md:space-y-10">
            {experience.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative md:pl-12"
              >
                <div className="absolute left-0 top-10 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-accent-blue bg-[#030303] shadow-[0_0_24px_rgba(79,140,255,0.8)] md:left-5 md:block" />

                <PremiumCard tilt={8}>
                  <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-accent-blue">
                    {role.period}
                  </p>
                  <h3 className="font-display mt-3 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
