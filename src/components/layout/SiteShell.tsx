"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLenisGsap } from "@/hooks/useLenisGsap";
import { usePerfFlags } from "@/components/providers/Providers";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navigation } from "@/components/layout/Navigation";
import { EasterEggs } from "@/components/easter-eggs/EasterEggs";
import { Providers } from "@/components/providers/Providers";

const CinematicIntro = dynamic(
  () => import("@/components/intro/CinematicIntro").then((m) => m.CinematicIntro),
  { ssr: false },
);

function ShellInner({ children }: { children: ReactNode }) {
  useLenisGsap();
  const { enableCursor } = usePerfFlags();
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Lock scroll during intro
    if (showIntro) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  const onIntroComplete = useCallback(() => {
    setShowIntro(false);
    requestAnimationFrame(() => setReady(true));
  }, []);

  return (
    <>
      {showIntro ? <CinematicIntro onComplete={onIntroComplete} /> : null}

      <div
        className={`relative min-h-full transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          ready
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
            : "pointer-events-none translate-y-2 scale-[1.01] opacity-0 blur-[6px]"
        }`}
      >
        <AmbientBackground />
        <div className="noise" aria-hidden />
        {enableCursor && ready ? <CustomCursor /> : null}
        <Navigation />
        <div className="relative z-10">{children}</div>
        <EasterEggs />
      </div>
    </>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <ShellInner>{children}</ShellInner>
    </Providers>
  );
}
