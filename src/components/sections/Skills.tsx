"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { skillNodes } from "@/data/resume";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { usePerfFlags } from "@/components/providers/Providers";

type Pos = { id: string; x: number; y: number };

const CORE = { x: 50, y: 50 };

function layoutNodes(): Pos[] {
  return skillNodes.map((node, i) => {
    const angle = (i / skillNodes.length) * Math.PI * 2 - Math.PI / 2;
    const ring = i % 3 === 0 ? 36 : i % 3 === 1 ? 28 : 20;
    return {
      id: node.id,
      x: CORE.x + Math.cos(angle) * ring,
      y: CORE.y + Math.sin(angle) * ring,
    };
  });
}

export function Skills() {
  const positions = useMemo(() => layoutNodes(), []);
  const [active, setActive] = useState<string | null>(null);
  const { lite } = usePerfFlags();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.35 });
  const activeNode = skillNodes.find((n) => n.id === active);
  const activePos = positions.find((p) => p.id === active);

  const ringLinks = useMemo(() => {
    const result: Array<{ a: Pos; b: Pos; key: string }> = [];
    for (let i = 0; i < positions.length; i++) {
      const a = positions[i];
      const b = positions[(i + 1) % positions.length];
      result.push({ a, b, key: `ring-${a.id}-${b.id}` });
    }
    return result;
  }, [positions]);

  const spokeLinks = useMemo(
    () =>
      positions.map((p) => ({
        b: p,
        key: `spoke-${p.id}`,
        id: p.id,
      })),
    [positions],
  );

  const connectedIds = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active]);
    const idx = positions.findIndex((p) => p.id === active);
    if (idx >= 0) {
      set.add(positions[(idx + 1) % positions.length].id);
      set.add(positions[(idx - 1 + positions.length) % positions.length].id);
    }
    return set;
  }, [active, positions]);

  const isRingHot = (aId: string, bId: string) => {
    if (!active) return false;
    return (
      (aId === active || bId === active) &&
      connectedIds.has(aId) &&
      connectedIds.has(bId)
    );
  };

  return (
    <section id="skills" className="relative px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-blue/80">
          Skills
        </p>
        <SplitReveal
          text="A network of analytical craft."
          as="h2"
          mode="words"
          className="mb-12 max-w-4xl text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] text-white sm:mb-20 md:mb-28"
        />

        {/* Mobile + tablet: readable skill cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
          {skillNodes.map((node, i) => (
            <motion.button
              key={node.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: i * 0.04,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => setActive(active === node.id ? null : node.id)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                active === node.id
                  ? "border-accent-blue/45 bg-accent-blue/[0.08]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/85">
                {node.label}
              </p>
              <p className="font-body mt-2 text-xs leading-relaxed text-muted">
                {node.detail}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Desktop: network visualization */}
        <div className="relative mx-auto hidden max-w-4xl lg:block">
          <div
            ref={stageRef}
            className="skills-stage relative aspect-square overflow-hidden rounded-[36px] border border-white/8 bg-[#05070d]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.14),transparent_58%)]" />

            {!lite ? (
              <>
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-blue/10"
                  animate={inView ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-violet/10"
                  animate={inView ? { rotate: -360 } : { rotate: 0 }}
                  transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue/25 blur-3xl"
                  animate={
                    inView
                      ? { opacity: [0.22, 0.55, 0.22], scale: [0.88, 1.18, 0.88] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            ) : null}

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="skill-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f8cff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="skill-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="0.55" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {spokeLinks.map((link, i) => {
                const hot = active === link.id;
                return (
                  <motion.line
                    key={link.key}
                    x1={CORE.x}
                    y1={CORE.y}
                    x2={link.b.x}
                    y2={link.b.y}
                    stroke={hot ? "url(#skill-line)" : "rgba(79,140,255,0.16)"}
                    strokeWidth={hot ? 0.38 : 0.1}
                    strokeLinecap="round"
                    filter={hot ? "url(#skill-glow)" : undefined}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      inView
                        ? {
                            pathLength: 1,
                            opacity: active ? (hot ? 1 : 0.08) : 0.5,
                          }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      pathLength: {
                        delay: 0.28 + i * 0.04,
                        duration: 0.95,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: { duration: 0.3 },
                      strokeWidth: { duration: 0.25 },
                    }}
                  />
                );
              })}

              {ringLinks.map((link, i) => {
                const hot = isRingHot(link.a.id, link.b.id);
                return (
                  <motion.line
                    key={link.key}
                    x1={link.a.x}
                    y1={link.a.y}
                    x2={link.b.x}
                    y2={link.b.y}
                    stroke={hot ? "url(#skill-line)" : "rgba(139,92,246,0.18)"}
                    strokeWidth={hot ? 0.34 : 0.12}
                    strokeLinecap="round"
                    filter={hot ? "url(#skill-glow)" : undefined}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      inView
                        ? {
                            pathLength: 1,
                            opacity: active ? (hot ? 1 : 0.08) : 0.42,
                          }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      pathLength: {
                        delay: 0.5 + i * 0.03,
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: { duration: 0.28 },
                    }}
                  />
                );
              })}
            </svg>

            {/* Core */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-blue/45 bg-accent-blue/15 text-center font-sans text-[9px] uppercase tracking-[0.25em] text-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                inView
                  ? {
                      scale: 1,
                      opacity: 1,
                      boxShadow: [
                        "0 0 20px rgba(79,140,255,0.25)",
                        "0 0 52px rgba(79,140,255,0.55)",
                        "0 0 20px rgba(79,140,255,0.25)",
                      ],
                    }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                scale: { delay: 0.05, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                opacity: { delay: 0.05, duration: 0.45 },
                boxShadow: {
                  delay: 0.85,
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              Core
            </motion.div>

            {/* Nodes */}
            {positions.map((pos, i) => {
              const node = skillNodes.find((n) => n.id === pos.id)!;
              const isActive = active === node.id;
              const isNear = connectedIds.has(node.id);
              const dimmed = Boolean(active && !isNear);

              return (
                <div
                  key={node.id}
                  className="absolute z-20"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      inView
                        ? {
                            scale: 1,
                            opacity: 1,
                            y: lite ? 0 : [0, i % 2 === 0 ? -5 : 4, 0],
                          }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      scale: {
                        delay: 0.65 + i * 0.055,
                        duration: 0.75,
                        ease: [0.34, 1.4, 0.64, 1],
                      },
                      opacity: {
                        delay: 0.65 + i * 0.055,
                        duration: 0.4,
                      },
                      y: lite
                        ? { duration: 0 }
                        : {
                            delay: 1.4 + i * 0.05,
                            duration: 3.8 + (i % 5) * 0.35,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                    }}
                  >
                    <motion.button
                      type="button"
                      data-cursor="interactive"
                      onMouseEnter={() => setActive(node.id)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(node.id)}
                      onBlur={() => setActive(null)}
                      onClick={() =>
                        setActive(active === node.id ? null : node.id)
                      }
                      className="relative min-h-11 rounded-full border px-4 py-2.5 font-sans text-[10px] uppercase tracking-[0.14em] backdrop-blur-md"
                      animate={{
                        opacity: dimmed ? 0.25 : 1,
                        scale: isActive ? 1.2 : 1,
                        borderColor: isActive
                          ? "rgba(79,140,255,0.9)"
                          : isNear
                            ? "rgba(139,92,246,0.6)"
                            : "rgba(255,255,255,0.15)",
                        backgroundColor: isActive
                          ? "rgba(79,140,255,0.28)"
                          : "rgba(0,0,0,0.82)",
                        color: "#fff",
                        boxShadow: isActive
                          ? "0 0 40px rgba(79,140,255,0.7), 0 0 80px rgba(139,92,246,0.35)"
                          : isNear
                            ? "0 0 24px rgba(139,92,246,0.4)"
                            : "0 0 12px rgba(139,92,246,0.12)",
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      whileHover={{ scale: 1.24 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {node.label}

                      <AnimatePresence>
                        {isActive ? (
                          <motion.span
                            key="ring"
                            className="pointer-events-none absolute inset-[-8px] rounded-full border border-accent-blue/60"
                            initial={{ opacity: 0.9, scale: 0.9 }}
                            animate={{ opacity: 0, scale: 1.65 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 1.05,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                        ) : null}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </div>
              );
            })}

            {/* Orbiting spark on active node */}
            <AnimatePresence>
              {activePos && !lite ? (
                <motion.div
                  key={`spark-${activePos.id}`}
                  className="pointer-events-none absolute z-30 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_16px_rgba(79,140,255,1)]"
                  style={{
                    left: `${activePos.x}%`,
                    top: `${activePos.y}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.7, 1.15, 0.7],
                    x: ["-50%", "14px", "-50%", "-18px", "-50%"],
                    y: ["-50%", "-16px", "-50%", "14px", "-50%"],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
            </AnimatePresence>

            {/* Detail card */}
            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-6 left-6 right-6 z-40 overflow-hidden rounded-2xl border border-accent-blue/30 bg-black/88 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.6),0_0_48px_rgba(79,140,255,0.2)] backdrop-blur-xl md:left-auto md:right-6 md:w-80"
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <p className="font-display text-lg text-white">{activeNode.label}</p>
                  <p className="font-body mt-2 text-xs leading-[1.8] text-muted">
                    {activeNode.detail}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {inView && !active ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.35em] text-white/45"
                >
                  Explore a node
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
