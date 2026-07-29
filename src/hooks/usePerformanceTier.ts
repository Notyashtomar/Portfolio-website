"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "balanced" | "lite";

function detectTier(): PerformanceTier {
  if (typeof window === "undefined") return "balanced";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (reduced || mobile || coarse || cores <= 4 || memory <= 4) return "lite";
  if (cores >= 8 && memory >= 8) return "high";
  return "balanced";
}

export function usePerformanceTier() {
  // Keep SSR and the first client render identical — detect tier after mount.
  const [tier, setTier] = useState<PerformanceTier>("balanced");

  useEffect(() => {
    setTier(detectTier());
  }, []);

  return tier;
}

export function tierToFlags(tier: PerformanceTier) {
  return {
    lite: tier === "lite",
    high: tier === "high",
    enableWebGL: tier !== "lite",
    enableCursor: tier === "high",
    enableFloat: tier === "high",
    dpr: tier === "high" ? 1.5 : tier === "balanced" ? 1.25 : 1,
  };
}
