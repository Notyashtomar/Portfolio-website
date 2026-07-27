"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  lite?: boolean;
};

export function IntroAtmosphere({ lite = false }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: lite ? 18 : 42 }, (_, i) => ({
        id: i,
        left: (i * 47) % 100,
        top: (i * 31) % 100,
        size: 1 + (i % 3),
        delay: (i % 9) * 0.35,
        duration: 4 + (i % 6),
      })),
    [lite],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: lite ? 24 : 60 }, (_, i) => ({
        id: i,
        left: (i * 17) % 100,
        top: (i * 23) % 100,
        delay: (i % 8) * 0.4,
      })),
    [lite],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="intro-mesh absolute inset-0" />
      <div className="intro-aurora intro-aurora-a" />
      <div className="intro-aurora intro-aurora-b" />
      {!lite ? <div className="intro-aurora intro-aurora-c" /> : null}
      <div className="intro-rays" />

      {stars.map((s) => (
        <span
          key={`star-${s.id}`}
          className="intro-star absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {particles.map((p) => (
        <motion.span
          key={`dust-${p.id}`}
          className="absolute rounded-full bg-accent-blue/70"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.15, 0.8, 0.15],
            x: [0, (p.id % 2 === 0 ? 10 : -10), 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="intro-vignette absolute inset-0" />
      <div className="intro-noise absolute inset-0" />
    </div>
  );
}
