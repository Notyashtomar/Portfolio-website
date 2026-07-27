"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";

export function useLenisGsap() {
  const { lite } = usePerfFlags();

  useEffect(() => {
    registerGsap();
    const lenis = new Lenis({
      lerp: lite ? 0.16 : 0.12,
      duration: lite ? 0.85 : 1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: lite ? 1.1 : 0.95,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    ScrollTrigger.config({ limitCallbacks: true });
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [lite]);
}
