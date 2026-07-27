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
  /** Site should start fading in under the intro */
  onReveal: () => void;
  /** Intro fully done — safe to unmount */
  onComplete: () => void;
};

const MIN_MS = 2300;
/** Camera fly + dissolve total */
const ENTER_MS = 1450;
/** When site starts appearing during the enter */
const REVEAL_AT = 520;

export function CinematicIntro({ onReveal, onComplete }: Props) {
  const { lite, enableWebGL } = usePerfFlags();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"load" | "enter" | "fade">("load");
  const [canSkip, setCanSkip] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const started = useRef(performance.now());
  const finished = useRef(false);
  const revealed = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setProgress(100);
    setPhase("enter");

    window.setTimeout(() => {
      if (!revealed.current) {
        revealed.current = true;
        onReveal();
      }
      setPhase("fade");
    }, REVEAL_AT);

    window.setTimeout(() => {
      onComplete();
    }, ENTER_MS);
  }, [onComplete, onReveal]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onReveal();
      onComplete();
      return;
    }

    const skipTimer = window.setTimeout(() => setCanSkip(true), 700);
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

      setProgress((p) => Math.min(100, p + (target - p) * Math.min(1, dt / 70)));

      if (!finishing && elapsed >= MIN_MS) {
        finishing = true;
        setProgress(100);
        window.setTimeout(finish, 180);
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
    const id = window.setTimeout(finish, 4200);
    return () => window.clearTimeout(id);
  }, [finish]);

  const entering = phase === "enter" || phase === "fade";
  const fading = phase === "fade";
  const use3D = enableWebGL && !lite;

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#030303]"
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{
        duration: fading ? 0.85 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ pointerEvents: fading ? "none" : "auto" }}
    >
      <motion.div
        className="absolute inset-0"
        animate={
          entering
            ? { scale: 1.06, opacity: fading ? 0.4 : 1 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <IntroAtmosphere lite={lite} />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-10"
        animate={
          entering
            ? { scale: 1.18, opacity: fading ? 0 : 1, filter: "blur(0px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {use3D ? (
          <IntroMacBook
            progress={progress}
            entering={entering}
            mouse={mouse}
            lite={lite}
          />
        ) : (
          <LiteMacBook progress={progress} entering={entering} mouse={mouse} />
        )}
      </motion.div>

      {/* Soft portal — dark, not white flash */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[44%] z-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "28vmax",
          height: "28vmax",
          background:
            "radial-gradient(circle, rgba(79,140,255,0.28) 0%, rgba(10,12,20,0.55) 45%, transparent 70%)",
        }}
        animate={
          entering
            ? {
                scale: [1, 3.2, 6],
                opacity: [0.45, 0.55, 0],
              }
            : {
                scale: 0.9 + progress / 400,
                opacity: 0.2 + progress / 600,
              }
        }
        transition={{
          duration: entering ? 1.25 : 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Edge vignette deepens into site black */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, #030303 78%)",
        }}
        animate={{ opacity: entering ? 0.95 : 0.35 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />

      <IntroProgress progress={progress} entering={entering} />

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
            ? {
                scale: 1.55,
                y: -24,
                rotateX: 0,
                rotateY: 0,
                opacity: 0,
              }
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
            ? { duration: 1.15, ease: [0.16, 1, 0.3, 1] }
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
