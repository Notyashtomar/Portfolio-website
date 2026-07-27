"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/resume";

type Props = {
  progress: number;
};

export function ScreenUI({ progress }: Props) {
  const showNav = progress > 12;
  const showTitle = progress > 28;
  const showCards = progress > 48;
  const showCta = progress > 68;
  const showGlow = progress > 40;

  return (
    <div className="relative h-full min-h-[180px] w-full overflow-hidden bg-[#050508] text-white">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: showGlow ? 1 : 0,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(79,140,255,0.22), transparent 60%), radial-gradient(ellipse 50% 40% at 70% 70%, rgba(139,92,246,0.14), transparent 55%)",
        }}
      />

      <motion.div
        initial={false}
        animate={{ y: showNav ? 0 : -16, opacity: showNav ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="relative z-10 flex items-center justify-between px-[4%] py-[3%]"
      >
        <span className="font-display text-[clamp(7px,1.6vw,11px)] tracking-[0.28em]">
          YRST
        </span>
        <div className="flex gap-[0.7em]">
          {["About", "Work", "Contact"].map((item) => (
            <span
              key={item}
              className="font-sans text-[clamp(5px,1vw,8px)] uppercase tracking-[0.16em] text-white/40"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 px-[4%] pt-[2%]">
        <motion.p
          initial={false}
          animate={{ opacity: showTitle ? 0.55 : 0, y: showTitle ? 0 : 8 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="font-sans text-[clamp(5px,1vw,8px)] uppercase tracking-[0.3em] text-white/50"
        >
          {profile.location} · {profile.title}
        </motion.p>

        <motion.h1
          initial={false}
          animate={{ opacity: showTitle ? 1 : 0, y: showTitle ? 0 : 14 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.04 }}
          className="font-display mt-[0.4em] text-[clamp(14px,3.2vw,28px)] font-semibold leading-[0.95] tracking-[-0.03em]"
        >
          {profile.shortName.toUpperCase()}
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: showTitle ? 0.55 : 0, y: showTitle ? 0 : 10 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.08 }}
          className="font-body mt-[0.5em] max-w-[75%] text-[clamp(6px,1.2vw,11px)] leading-relaxed text-white/55"
        >
          Analytics · MIS · Forecasting
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: showCta ? 1 : 0, y: showCta ? 0 : 10 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="mt-[1em] flex gap-[0.5em]"
        >
          <span className="rounded-full bg-white px-[0.9em] py-[0.35em] font-sans text-[clamp(5px,1vw,9px)] text-black">
            View work
          </span>
          <span className="rounded-full border border-white/15 px-[0.9em] py-[0.35em] font-sans text-[clamp(5px,1vw,9px)] text-white/70">
            Contact
          </span>
        </motion.div>

        <div className="mt-[1.2em] grid grid-cols-3 gap-[0.5em]">
          {["Forecasting", "Dashboards", "SQL"].map((label, i) => (
            <motion.div
              key={label}
              initial={false}
              animate={{
                opacity: showCards ? 1 : 0,
                y: showCards ? 0 : 12,
                scale: showCards ? 1 : 0.94,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 18,
                delay: 0.07 * i,
              }}
              className="rounded-[0.4em] border border-white/10 bg-white/[0.04] p-[0.45em]"
            >
              <div className="mb-[0.4em] h-[2em] rounded-[0.25em] bg-gradient-to-br from-accent-blue/30 to-accent-violet/20" />
              <p className="font-sans text-[clamp(5px,0.95vw,8px)] uppercase tracking-[0.12em] text-white/70">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
