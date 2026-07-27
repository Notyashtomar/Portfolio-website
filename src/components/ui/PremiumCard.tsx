"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { usePerfFlags } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  float?: boolean;
  tilt?: number;
};

export function PremiumCard({
  children,
  className,
  float = false,
  tilt = 6,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { enableFloat, lite } = usePerfFlags();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), {
    stiffness: 280,
    damping: 28,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), {
    stiffness: 280,
    damping: 28,
    mass: 0.6,
  });
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(480px circle at ${glowX} ${glowY}, rgba(79,140,255,0.18), transparent 40%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (lite) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const shouldFloat = float && enableFloat;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        lite
          ? undefined
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
      }
      animate={shouldFloat ? { y: [0, -4, 0] } : undefined}
      transition={
        shouldFloat
          ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      className={cn(
        "premium-glass group relative overflow-hidden rounded-[28px] p-6 md:p-8",
        "will-change-transform transition-shadow duration-300 hover:shadow-[0_24px_80px_rgba(79,140,255,0.1)]",
        className,
      )}
      data-cursor="interactive"
    >
      {!lite ? (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
