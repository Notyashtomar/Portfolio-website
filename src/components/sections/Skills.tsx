"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { skillNodes } from "@/data/resume";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { usePerfFlags } from "@/components/providers/Providers";

type Pos = { id: string; x: number; y: number };

const CORE = { x: 50, y: 50 };

/**
 * Two-ring layout: 6 outer (r=30) + 6 inner (r=18), inner offset 30°.
 * Pre-verified — all adjacent cross-ring centers are ≥ 17 units apart
 * (~114 px on the 672 px stage), preventing pill label collision.
 */
function layoutNodes(): Pos[] {
  return skillNodes.map((node, i) => {
    const isInner = i >= 6;
    const ring    = isInner ? 18 : 30;
    const idx     = isInner ? i - 6 : i;
    const offset  = isInner ? Math.PI / 6 : 0; // 30° stagger keeps rings interleaved
    const angle   = (idx / 6) * Math.PI * 2 - Math.PI / 2 + offset;
    return {
      id: node.id,
      x: CORE.x + Math.cos(angle) * ring,
      y: CORE.y + Math.sin(angle) * ring,
    };
  });
}

/* ── Animated data-pulse dot that travels along a spoke ── */
function DataPulse({
  x1, y1, x2, y2, delay,
}: {
  x1: number; y1: number; x2: number; y2: number; delay: number;
}) {
  return (
    <motion.circle
      r={0.7}
      fill="#4f8cff"
      filter="url(#skill-glow)"
      style={{ mixBlendMode: "screen" }}
      initial={{ opacity: 0 }}
      animate={{
        cx: [x1, x2, x1],
        cy: [y1, y2, y1],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        duration: 2.2,
        delay,
        repeat: Infinity,
        repeatDelay: 3.5 + delay * 0.4,
        ease: "easeInOut",
        times: [0, 0.35, 0.65, 1],
      }}
    />
  );
}

export function Skills() {
  const positions    = useMemo(() => layoutNodes(), []);
  const [active, setActive] = useState<string | null>(null);
  const { lite }     = usePerfFlags();
  const stageRef     = useRef<HTMLDivElement>(null);
  const inView       = useInView(stageRef, { once: true, amount: 0.3 });
  const activeNode   = skillNodes.find((n) => n.id === active);
  const activePos    = positions.find((p) => p.id === active);

  const connectedIds = useMemo(() => {
    if (!active) return new Set<string>();
    const idx = positions.findIndex((p) => p.id === active);
    const set = new Set([active]);
    if (idx >= 0) {
      set.add(positions[(idx + 1) % positions.length].id);
      set.add(positions[(idx - 1 + positions.length) % positions.length].id);
    }
    return set;
  }, [active, positions]);

  const spokeLinks = useMemo(
    () => positions.map((p, i) => ({ p, i, id: p.id, key: `spoke-${p.id}` })),
    [positions],
  );

  const ringLinks = useMemo(() => {
    const res: { a: Pos; b: Pos; key: string }[] = [];
    for (let i = 0; i < positions.length; i++) {
      res.push({
        a: positions[i],
        b: positions[(i + 1) % positions.length],
        key: `ring-${positions[i].id}`,
      });
    }
    return res;
  }, [positions]);

  const isRingHot = (aId: string, bId: string) =>
    !!active &&
    (aId === active || bId === active) &&
    connectedIds.has(aId) &&
    connectedIds.has(bId);

  return (
    <section
      id="skills"
      className="relative px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <span className="section-num">03 / SKILLS</span>
          <div className="h-px flex-1 bg-gradient-to-r from-accent-blue/30 to-transparent" />
        </div>
        <SplitReveal
          text="A network of analytical craft."
          as="h2"
          mode="words"
          className="mb-12 max-w-4xl text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] text-white sm:mb-20 md:mb-28"
        />

        {/* ── Mobile / tablet: card grid ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
          {skillNodes.map((node, i) => (
            <motion.button
              key={node.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActive(active === node.id ? null : node.id)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                active === node.id
                  ? "border-accent-blue/45 bg-accent-blue/[0.08]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/85">{node.label}</p>
              <p className="font-body mt-2 text-xs leading-relaxed text-muted">{node.detail}</p>
            </motion.button>
          ))}
        </div>

        {/* ── Desktop: network ── */}
        <div className="relative mx-auto hidden max-w-2xl lg:block xl:max-w-3xl">
          <div
            ref={stageRef}
            className="skills-stage relative aspect-square overflow-hidden rounded-[36px] border border-white/8 bg-[#05070d]"
          >
            {/* Background radial */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.12),transparent_55%)]" />

            {/* ── Ambient rings + glow ── */}
            {!lite && (
              <>
                {/* Outer slow orbit ring */}
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-blue/10"
                  animate={inView ? { rotate: 360 } : {}}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner counter-orbit */}
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-violet/12"
                  animate={inView ? { rotate: -360 } : {}}
                  transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                />
                {/* Dashed scan ring */}
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    border: "1px dashed rgba(79,140,255,0.07)",
                  }}
                  animate={inView ? { rotate: 360 } : {}}
                  transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                />
                {/* Core breathing glow */}
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue/20 blur-3xl"
                  animate={inView ? { opacity: [0.2, 0.55, 0.2], scale: [0.85, 1.2, 0.85] } : { opacity: 0 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Scan sweep line */}
                <motion.div
                  className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/25 to-transparent"
                  animate={inView ? { top: ["15%", "85%", "15%"] } : { top: "15%" }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                />
              </>
            )}

            {/* ── SVG lines + data pulses ── */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              overflow="visible"
            >
              <defs>
                <linearGradient id="skill-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f8cff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="skill-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Spoke lines */}
              {spokeLinks.map(({ p, i, id, key }) => {
                const hot = active === id;
                return (
                  <motion.line
                    key={key}
                    x1={CORE.x} y1={CORE.y}
                    x2={p.x}    y2={p.y}
                    stroke={hot ? "url(#skill-line)" : "rgba(79,140,255,0.18)"}
                    strokeWidth={hot ? 0.4 : 0.12}
                    strokeLinecap="round"
                    filter={hot ? "url(#skill-glow)" : undefined}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      inView
                        ? { pathLength: 1, opacity: active ? (hot ? 1 : 0.06) : 0.55 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      pathLength: { delay: 0.3 + i * 0.04, duration: 1, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3 },
                    }}
                  />
                );
              })}

              {/* Ring lines */}
              {ringLinks.map(({ a, b, key }, i) => {
                const hot = isRingHot(a.id, b.id);
                return (
                  <motion.line
                    key={key}
                    x1={a.x} y1={a.y}
                    x2={b.x} y2={b.y}
                    stroke={hot ? "url(#skill-line)" : "rgba(139,92,246,0.2)"}
                    strokeWidth={hot ? 0.35 : 0.12}
                    strokeLinecap="round"
                    filter={hot ? "url(#skill-glow)" : undefined}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      inView
                        ? { pathLength: 1, opacity: active ? (hot ? 1 : 0.05) : 0.38 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      pathLength: { delay: 0.55 + i * 0.03, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.28 },
                    }}
                  />
                );
              })}

              {/* Data pulses along spokes (only when not active & inView) */}
              {inView && !lite && !active &&
                spokeLinks.map(({ p, i }) => (
                  <DataPulse
                    key={`pulse-${p.id}`}
                    x1={CORE.x} y1={CORE.y}
                    x2={p.x}    y2={p.y}
                    delay={i * 0.55}
                  />
                ))
              }
            </svg>

            {/* ── Core node ── */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-default select-none items-center justify-center rounded-full border border-accent-blue/50 bg-accent-blue/15 text-center font-sans text-[9px] uppercase tracking-[0.25em] text-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                inView
                  ? {
                      scale: 1,
                      opacity: 1,
                      boxShadow: [
                        "0 0 18px rgba(79,140,255,0.22)",
                        "0 0 50px rgba(79,140,255,0.58)",
                        "0 0 18px rgba(79,140,255,0.22)",
                      ],
                    }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                scale: { delay: 0.05, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                opacity: { delay: 0.05, duration: 0.45 },
                boxShadow: { delay: 0.85, duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              Core
            </motion.div>

            {/* ── Skill nodes ── */}
            {positions.map((pos, i) => {
              const node    = skillNodes.find((n) => n.id === pos.id)!;
              const isActive = active === node.id;
              const isNear  = connectedIds.has(node.id);
              const dimmed  = Boolean(active && !isNear);
              /* Alternating float offsets to avoid sync */
              const floatY  = i % 3 === 0 ? -4 : i % 3 === 1 ? 3 : -2.5;
              const floatX  = i % 4 === 0 ? 2  : i % 4 === 1 ? -1.5 : i % 4 === 2 ? 1 : -2;

              return (
                <div
                  key={node.id}
                  className="absolute z-20"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)" }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      inView
                        ? {
                            scale: 1,
                            opacity: 1,
                            x: lite ? 0 : [0, floatX, 0],
                            y: lite ? 0 : [0, floatY, 0],
                          }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{
                      scale:   { delay: 0.65 + i * 0.06, duration: 0.75, ease: [0.34, 1.4, 0.64, 1] },
                      opacity: { delay: 0.65 + i * 0.06, duration: 0.4 },
                      x: { delay: 1.5 + i * 0.07, duration: 4.2 + (i % 5) * 0.4, repeat: Infinity, ease: "easeInOut" },
                      y: { delay: 1.5 + i * 0.07, duration: 3.6 + (i % 4) * 0.45, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <motion.button
                      type="button"
                      data-cursor="interactive"
                      onMouseEnter={() => setActive(node.id)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(node.id)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive(active === node.id ? null : node.id)}
                      className="relative min-h-[38px] whitespace-nowrap rounded-full border px-4 py-2 font-sans text-[10px] uppercase tracking-[0.14em] backdrop-blur-md"
                      animate={{
                        opacity: dimmed ? 0.2 : 1,
                        scale: isActive ? 1.18 : 1,
                        borderColor: isActive
                          ? "rgba(79,140,255,0.95)"
                          : isNear
                          ? "rgba(139,92,246,0.65)"
                          : "rgba(255,255,255,0.16)",
                        backgroundColor: isActive
                          ? "rgba(79,140,255,0.3)"
                          : "rgba(4,6,16,0.85)",
                        color: "#ffffff",
                        boxShadow: isActive
                          ? "0 0 36px rgba(79,140,255,0.75), 0 0 72px rgba(139,92,246,0.4)"
                          : isNear
                          ? "0 0 22px rgba(139,92,246,0.45)"
                          : "none",
                      }}
                      transition={{ type: "spring", stiffness: 340, damping: 24 }}
                      whileHover={{ scale: isActive ? 1.18 : 1.18 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      {node.label}

                      {/* Idle breath glow */}
                      {!isActive && !dimmed && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 rounded-full"
                          animate={{ boxShadow: ["0 0 0px rgba(79,140,255,0)", "0 0 14px rgba(79,140,255,0.25)", "0 0 0px rgba(79,140,255,0)"] }}
                          transition={{ duration: 2.8 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                        />
                      )}

                      {/* Active ripple rings */}
                      <AnimatePresence>
                        {isActive && (
                          <>
                            {[0, 0.35, 0.7].map((ringDelay) => (
                              <motion.span
                                key={ringDelay}
                                className="pointer-events-none absolute inset-[-6px] rounded-full border border-accent-blue/55"
                                initial={{ opacity: 0.85, scale: 0.9 }}
                                animate={{ opacity: 0, scale: 1.7 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut", delay: ringDelay }}
                              />
                            ))}
                          </>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </div>
              );
            })}

            {/* Orbiting spark dot on active node */}
            <AnimatePresence>
              {activePos && !lite && (
                <motion.div
                  key={`spark-${activePos.id}`}
                  className="pointer-events-none absolute z-30 h-2 w-2 rounded-full bg-white shadow-[0_0_14px_rgba(79,140,255,1)]"
                  style={{ left: `${activePos.x}%`, top: `${activePos.y}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale:   [0.7, 1.1, 0.7],
                    x: ["-50%", "12px", "-50%", "-16px", "-50%"],
                    y: ["-50%", "-14px", "-50%", "12px",  "-50%"],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {/* Detail card — pinned bottom-right, never overlaps stage */}
            <AnimatePresence mode="wait">
              {activeNode && (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute bottom-5 right-5 z-40 w-64 overflow-hidden rounded-2xl border border-accent-blue/35 bg-black/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(79,140,255,0.2)] backdrop-blur-xl"
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <p className="font-display text-base font-bold text-white">{activeNode.label}</p>
                  <p className="font-body mt-2 text-[11px] leading-[1.8] text-white/55">{activeNode.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            <AnimatePresence>
              {inView && !active && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 font-sans text-[9px] uppercase tracking-[0.38em] text-white/40"
                >
                  Hover a node
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
