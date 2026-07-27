"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 560, damping: 40, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 560, damping: 40, mass: 0.25 });
  const trailX = useSpring(x, { stiffness: 140, damping: 26, mass: 0.4 });
  const trailY = useSpring(y, { stiffness: 140, damping: 26, mass: 0.4 });
  const hoverRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) {
      document.body.classList.add("no-cursor");
      return;
    }

    let raf = 0;
    let latestX = -100;
    let latestY = -100;
    let shown = false;

    const flush = () => {
      x.set(latestX);
      y.set(latestY);
      raf = 0;
    };

    const move = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
      if (!shown) {
        shown = true;
        setVisible(true);
      }

      const t = (e.target as HTMLElement | null)?.closest(
        "a, button, [data-cursor='interactive']",
      );
      const next = Boolean(t);
      if (next !== hoverRef.current) {
        hoverRef.current = next;
        setHover(next);
      }
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => {
      shown = false;
      setVisible(false);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10001] hidden will-change-transform md:block"
        style={{ translateX: trailX, translateY: trailY }}
      >
        <motion.div
          className="rounded-full bg-accent-blue/20 blur-md"
          animate={{
            width: hover ? 52 : 26,
            height: hover ? 52 : 26,
            x: hover ? -26 : -13,
            y: hover ? -26 : -13,
            opacity: hover ? 0.45 : 0.22,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10002] hidden mix-blend-difference will-change-transform md:block"
        style={{ translateX: sx, translateY: sy }}
      >
        <motion.div
          className="rounded-full border border-white bg-white"
          animate={{
            width: clicking ? 8 : hover ? 34 : 10,
            height: clicking ? 8 : hover ? 34 : 10,
            x: clicking ? -4 : hover ? -17 : -5,
            y: clicking ? -4 : hover ? -17 : -5,
            opacity: 1,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        />
      </motion.div>
    </>
  );
}
