"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const STAGES: Array<{ at: number; label: string }> = [
  { at: 0, label: "Initializing..." },
  { at: 18, label: "Loading Assets..." },
  { at: 38, label: "Rendering Experience..." },
  { at: 62, label: "Optimizing Interface..." },
  { at: 82, label: "Launching Portfolio..." },
  { at: 100, label: "WELCOME" },
];

type Props = {
  progress: number;
  entering: boolean;
};

export function IntroProgress({ progress, entering }: Props) {
  const stage = useMemo(() => {
    let current = STAGES[0];
    for (const s of STAGES) {
      if (progress >= s.at) current = s;
    }
    return current;
  }, [progress]);

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(progress));
    return () => cancelAnimationFrame(id);
  }, [progress]);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-10 sm:px-10 sm:pb-14 ${
        entering ? "opacity-0 transition-opacity duration-500" : ""
      }`}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={stage.label}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="font-sans text-[10px] uppercase tracking-[0.42em] text-white/55 sm:text-[11px]"
          >
            {stage.label}
          </motion.p>
        </AnimatePresence>

        <div className="relative h-[2px] w-full overflow-visible rounded-full bg-white/[0.06]">
          <motion.div
            className="intro-energy absolute inset-y-0 left-0 origin-left rounded-full"
            style={{ width: `${display}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 28 }}
          />
          <motion.div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(79,140,255,0.95),0_0_40px_rgba(139,92,246,0.55)]"
            style={{ left: `calc(${display}% - 6px)` }}
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.p
          className="font-display text-sm tracking-[0.28em] text-white/70"
          animate={{ opacity: display >= 100 ? 1 : 0.55 }}
        >
          {Math.min(100, Math.round(display))}
          <span className="text-white/35">%</span>
        </motion.p>
      </div>
    </div>
  );
}
