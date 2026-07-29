"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
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
      lerp: 0.1,
      duration: 1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so scrub animations stay in sync with scroll.
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.config({ limitCallbacks: true });
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [lite]);
}
