"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { IntroAtmosphere } from "./IntroAtmosphere";
import { IntroProgress } from "./IntroProgress";
import { ScreenUI } from "./ScreenUI";
import { usePerfFlags } from "@/components/providers/Providers";

const IntroMacBook = dynamic(
  () => import("./IntroMacBook").then((m) => m.IntroMacBook),
  { ssr: false },
);

type Props = {
  onReveal: () => void;
  onComplete: () => void;
};

const MIN_MS = 2200;
/** Punchy end — total time from finish() to unmount */
const ENTER_MS = 780;
/** Site circle-reveal kicks almost immediately */
const REVEAL_AT = 140;

export function CinematicIntro({ onReveal, onComplete }: Props) {
  const { lite, enableWebGL } = usePerfFlags();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"load" | "impact" | "exit">("load");
  const [canSkip, setCanSkip] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const started = useRef(performance.now());
  const finished = useRef(false);
  const revealed = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setProgress(100);
    setPhase("impact");

    window.setTimeout(() => {
      if (!revealed.current) {
        revealed.current = true;
        onReveal();
      }
      setPhase("exit");
    }, REVEAL_AT);

    window.setTimeout(() => onComplete(), ENTER_MS);
  }, [onComplete, onReveal]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onReveal();
      onComplete();
      return;
    }

    const skipTimer = window.setTimeout(() => setCanSkip(true), 650);
    let raf = 0;
    let last = performance.now();
    let finishing = false;

    const tick = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      const elapsed = now - started.current;
      const t = Math.min(1, elapsed / MIN_MS);
      const eased = 1 - Math.pow(1 - t, 2.4);
      const target = Math.min(100, eased * 100);

      setProgress((p) => Math.min(100, p + (target - p) * Math.min(1, dt / 65)));

      if (!finishing && elapsed >= MIN_MS) {
        finishing = true;
        setProgress(100);
        window.setTimeout(finish, 120);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
    };
  }, [finish, onComplete, onReveal]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(finish, 4000);
    return () => window.clearTimeout(id);
  }, [finish]);

  const impacting = phase === "impact" || phase === "exit";
  const exiting = phase === "exit";
  const use3D = enableWebGL && !lite;

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#030303]"
      initial={{ opacity: 1 }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: impacting ? 1.04 : 1,
      }}
      transition={{
        opacity: { duration: exiting ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] },
        scale: { type: "spring", stiffness: 220, damping: 22 },
      }}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: impacting ? 0.25 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <IntroAtmosphere lite={lite} />
      </motion.div>

      {/* Laptop layer — punch zoom then vanish */}
      <motion.div
        className="absolute inset-0 z-10"
        animate={
          impacting
            ? {
                scale: [1, 0.97, 1.35],
                opacity: exiting ? 0 : 1,
                filter: ["blur(0px)", "blur(0px)", "blur(10px)"],
              }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{
          duration: 0.7,
          times: [0, 0.18, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {use3D ? (
          <IntroMacBook
            progress={progress}
            entering={impacting}
            mouse={mouse}
            lite={lite}
          />
        ) : (
          <LiteMacBook progress={progress} entering={impacting} mouse={mouse} />
        )}
      </motion.div>

      {/* Shockwave rings */}
      {impacting
        ? [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute left-1/2 top-[44%] z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-blue/50"
              initial={{ width: 40, height: 40, opacity: 0.8 }}
              animate={{
                width: 900 + i * 220,
                height: 900 + i * 220,
                opacity: 0,
              }}
              transition={{
                duration: 0.65,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))
        : null}

      {/* Core flash — blue, brief, premium */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[44%] z-30 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,220,255,0.9) 0%, rgba(79,140,255,0.45) 35%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          impacting
            ? { scale: [0, 2.2, 8], opacity: [0, 1, 0] }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        animate={{ opacity: impacting ? 0 : 1, y: impacting ? 12 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <IntroProgress progress={progress} entering={impacting} />
      </motion.div>

      {canSkip && phase === "load" ? (
        <button
          type="button"
          onClick={finish}
          className="absolute right-5 top-5 z-40 font-sans text-[10px] uppercase tracking-[0.32em] text-white/35 transition hover:text-white/70 sm:right-8 sm:top-8"
        >
          Skip
        </button>
      ) : null}
    </motion.div>
  );
}

function LiteMacBook({
  progress,
  entering,
  mouse,
}: {
  progress: number;
  entering: boolean;
  mouse: MutableRefObject<{ x: number; y: number }>;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setOffset({
        x: mouse.current.x * 10,
        y: mouse.current.y * 6,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mouse]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
      <motion.div
        className="relative w-full max-w-lg will-change-transform"
        style={{ perspective: 1400 }}
        animate={
          entering
            ? { scale: 1.45, y: -20, rotateX: 0, rotateY: 0, opacity: 0 }
            : {
                y: [0, -8, 0],
                rotateX: 6 + offset.y * 0.12,
                rotateY: offset.x * 0.35,
                opacity: 1,
                scale: 1,
              }
        }
        transition={
          entering
            ? { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            : { y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <div
          className="overflow-hidden rounded-t-xl border border-white/12 bg-[#1a1b1f]"
          style={{
            boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 ${24 + progress / 4}px rgba(79,140,255,${0.1 + progress / 550})`,
          }}
        >
          <div className="aspect-[16/10] overflow-hidden bg-[#050508]">
            <ScreenUI progress={progress} />
          </div>
        </div>
        <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-2xl bg-gradient-to-b from-[#2a2c32] to-[#121316]" />
        <div className="mx-auto mt-1 h-1.5 w-28 rounded-full bg-white/10" />
      </motion.div>
    </div>
  );
}
