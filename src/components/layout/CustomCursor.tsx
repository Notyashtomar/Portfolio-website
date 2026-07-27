"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 38, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 38, mass: 0.3 });
  const trailX = useSpring(x, { stiffness: 120, damping: 24 });
  const trailY = useSpring(y, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) {
      document.body.classList.add("no-cursor");
      return;
    }

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor='interactive']",
      );
      setHover(Boolean(t));
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10001] hidden md:block"
        style={{ translateX: trailX, translateY: trailY }}
      >
        <motion.div
          className="rounded-full bg-accent-blue/20 blur-md"
          animate={{
            width: hover ? 56 : 28,
            height: hover ? 56 : 28,
            x: hover ? -28 : -14,
            y: hover ? -28 : -14,
            opacity: hover ? 0.5 : 0.25,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10002] hidden mix-blend-difference md:block"
        style={{ translateX: sx, translateY: sy }}
      >
        <motion.div
          className="rounded-full border border-white bg-white"
          animate={{
            width: clicking ? 8 : hover ? 36 : 10,
            height: clicking ? 8 : hover ? 36 : 10,
            x: clicking ? -4 : hover ? -18 : -5,
            y: clicking ? -4 : hover ? -18 : -5,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
        />
      </motion.div>
    </>
  );
}
