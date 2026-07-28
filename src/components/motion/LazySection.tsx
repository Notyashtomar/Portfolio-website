"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Mounts children only when the section nears the viewport — defers heavy JS/GSAP/WebGL init. */
export function LazySection({
  children,
  rootMargin = "280px 0px",
  minHeight = "1px",
}: {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
}
