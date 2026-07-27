"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export function SectionTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector("[data-beam]"),
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative h-32 overflow-hidden md:h-44" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div
        data-beam
        className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left -translate-y-1/2 bg-gradient-to-r from-accent-blue via-accent-violet to-transparent"
      />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue/5 blur-3xl" />
    </div>
  );
}
