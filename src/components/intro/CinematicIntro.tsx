"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { IntroAtmosphere } from "./IntroAtmosphere";
import { IntroProgress } from "./IntroProgress";
import { ScreenUI } from "./ScreenUI";
import { usePerfFlags } from "@/components/providers/Providers";

const IntroMacBook = dynamic(
  () => import("./IntroMacBook").then((m) => m.IntroMacBook),
  { ssr: false },
);

type Props = {
  onComplete: () => void;
};

const MESSAGES_DONE_AT = 100;
const MIN_MS = 2300;
const ENTER_MS = 900;

export function CinematicIntro({ onComplete }: Props) {
  const { lite, enableWebGL } = usePerfFlags();
  const [progress, setProgress] = useState(0);
  const [entering, setEntering] = useState(false);
  const [gone, setGone] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const started = useRef(performance.now());
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setProgress(100);
    setEntering(true);
    window.setTimeout(() => {
      setGone(true);
      onComplete();
    }, ENTER_MS);
  }, [onComplete]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      finish();
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

      // Snappy organic progress — reaches ~100 in MIN_MS
      const t = Math.min(1, elapsed / MIN_MS);
      const eased = 1 - Math.pow(1 - t, 2.4);
      const target = Math.min(100, eased * 100);

      setProgress((p) => {
        const next = p + (target - p) * Math.min(1, dt / 70);
        return Math.min(100, next);
      });

      if (!finishing && elapsed >= MIN_MS) {
        finishing = true;
        setProgress(100);
        window.setTimeout(finish, 160);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
    };
  }, [finish]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Safety timeout — never leave users stuck
  useEffect(() => {
    const id = window.setTimeout(finish, 4200);
    return () => window.clearTimeout(id);
  }, [finish]);

  if (gone) return null;

  const use3D = enableWebGL && !lite;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro"
        className="fixed inset-0 z-[200] overflow-hidden bg-[#030303]"
        initial={{ opacity: 1 }}
        animate={
          entering
            ? {
                opacity: 1,
                scale: 1.12,
                filter: "brightness(1.45)",
              }
            : { opacity: 1, scale: 1, filter: "brightness(1)" }
        }
        exit={{ opacity: 0 }}
        transition={{ duration: ENTER_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      >
        <IntroAtmosphere lite={lite} />

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

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[42%] z-20 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,140,255,0.45) 0%, rgba(139,92,246,0.18) 35%, transparent 70%)",
          }}
          animate={
            entering
              ? { scale: [1, 5], opacity: [0.55, 0.95, 0] }
              : { scale: 0.85 + progress / 350, opacity: 0.28 + progress / 450 }
          }
          transition={{ duration: entering ? 0.85 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        <IntroProgress progress={Math.min(progress, MESSAGES_DONE_AT)} entering={entering} />

        {canSkip && !entering ? (
          <button
            type="button"
            onClick={finish}
            className="absolute right-5 top-5 z-40 font-sans text-[10px] uppercase tracking-[0.32em] text-white/35 transition hover:text-white/70 sm:right-8 sm:top-8"
          >
            Skip
          </button>
        ) : null}

        <motion.div
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(180,210,255,0.55), rgba(3,3,3,0) 55%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: entering ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </AnimatePresence>
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
        x: mouse.current.x * 12,
        y: mouse.current.y * 8,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mouse]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
      <motion.div
        className="relative w-full max-w-lg"
        style={{ perspective: 1400 }}
        animate={
          entering
            ? { scale: 2.6, y: -40, opacity: 0.35 }
            : {
                y: [0, -10, 0],
                rotateX: 8 + offset.y * 0.15,
                rotateY: offset.x * 0.4,
              }
        }
        transition={
          entering
            ? { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
            : { y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <div
          className="overflow-hidden rounded-t-xl border border-white/12 bg-[#1a1b1f] shadow-[0_40px_100px_rgba(79,140,255,0.18)]"
          style={{
            boxShadow: `0 0 ${30 + progress / 3}px rgba(79,140,255,${0.12 + progress / 500})`,
          }}
        >
          <div className="aspect-[16/10] overflow-hidden bg-[#050508]">
            <div className="h-full w-full">
              <ScreenUI progress={progress} />
            </div>
          </div>
        </div>
        <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-2xl bg-gradient-to-b from-[#2a2c32] to-[#121316]" />
        <div className="mx-auto mt-1 h-1.5 w-28 rounded-full bg-white/10" />
      </motion.div>
    </div>
  );
}
