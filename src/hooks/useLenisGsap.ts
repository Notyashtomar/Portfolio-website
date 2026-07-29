"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";

export function useLenisGsap() {
  const { lite } = usePerfFlags();

  useEffect(() => {
    registerGsap();

    // Lite tier: native scroll — skip Lenis overhead entirely.
    if (lite) {
      ScrollTrigger.config({ limitCallbacks: true });
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.12,
      duration: 1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
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
      // Each component owns its ScrollTriggers — don't kill globally.
    };
  }, [lite]);
}
