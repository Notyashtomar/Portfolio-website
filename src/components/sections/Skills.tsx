"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { skillNodes } from "@/data/resume";
import { SplitReveal } from "@/components/motion/SplitReveal";

type Pos = { id: string; x: number; y: number };

function layoutNodes(): Pos[] {
  const cx = 50;
  const cy = 50;
  return skillNodes.map((node, i) => {
    const angle = (i / skillNodes.length) * Math.PI * 2 - Math.PI / 2;
    const ring = i % 3 === 0 ? 36 : i % 3 === 1 ? 28 : 20;
    return {
      id: node.id,
      x: cx + Math.cos(angle) * ring,
      y: cy + Math.sin(angle) * ring,
    };
  });
}

export function Skills() {
  const positions = useMemo(() => layoutNodes(), []);
  const [active, setActive] = useState<string | null>(null);
  const activeNode = skillNodes.find((n) => n.id === active);

  const links = useMemo(() => {
    const result: Array<[Pos, Pos]> = [];
    for (let i = 0; i < positions.length; i++) {
      result.push([positions[i], positions[(i + 1) % positions.length]]);
    }
    return result;
  }, [positions]);

  return (
    <section id="skills" className="relative px-6 py-32 md:px-12 md:py-44 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-blue/80">
          Skills
        </p>
        <SplitReveal
          text="A network of analytical craft."
          as="h2"
          mode="words"
          className="mb-20 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] text-white md:mb-28"
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="relative aspect-square overflow-hidden rounded-[36px] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.08),transparent_60%)]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              {links.map(([a, b], i) => (
                <line
                  key={`${a.id}-${b.id}-${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="rgba(79,140,255,0.12)"
                  strokeWidth="0.12"
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-blue/30 bg-accent-blue/10 text-center font-sans text-[9px] uppercase tracking-[0.25em] text-white shadow-[0_0_40px_rgba(79,140,255,0.25)]">
              Core
            </div>

            {positions.map((pos) => {
              const node = skillNodes.find((n) => n.id === pos.id)!;
              const isActive = active === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  data-cursor="interactive"
                  onMouseEnter={() => setActive(node.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(node.id)}
                  onBlur={() => setActive(null)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/80 px-3 py-2 font-sans text-[9px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-md transition duration-200 hover:scale-105 hover:border-accent-blue/60 md:text-[10px]"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    boxShadow: isActive
                      ? "0 0 28px rgba(79,140,255,0.45)"
                      : "0 0 12px rgba(139,92,246,0.15)",
                  }}
                >
                  {node.label}
                </button>
              );
            })}

            <AnimatePresence>
              {activeNode ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-6 left-6 right-6 z-30 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl md:left-auto md:right-6 md:w-72"
                >
                  <p className="font-display text-lg text-white">{activeNode.label}</p>
                  <p className="font-body mt-2 text-xs leading-[1.8] text-muted">
                    {activeNode.detail}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
