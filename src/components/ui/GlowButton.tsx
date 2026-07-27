"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  variant?: "primary" | "ghost" | "glow";
};

export function GlowButton({
  children,
  className,
  strength = 0.4,
  variant = "primary",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18 });
  const y = useSpring(my, { stiffness: 260, damping: 18 });

  const onMove = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left - rect.width / 2) * strength);
    my.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const variants = {
    primary:
      "bg-white text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]",
    ghost:
      "border border-white/12 bg-white/[0.04] text-white backdrop-blur-xl hover:border-accent-blue/40",
    glow:
      "bg-gradient-to-r from-accent-blue via-accent-violet to-accent-magenta text-white shadow-[0_0_50px_rgba(79,140,255,0.3)]",
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      className="inline-flex"
    >
      <div
        className={cn(
          "relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 sm:px-7 sm:py-3.5",
          variants[variant],
          className,
        )}
        data-cursor="interactive"
      >
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
        </span>
        <span className="relative z-10">{children}</span>
      </div>
    </motion.div>
  );
}
