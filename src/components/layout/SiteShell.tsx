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
  const [revealed, setRevealed] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
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

  const onReveal = useCallback(() => setRevealed(true), []);
  const onIntroComplete = useCallback(() => {
    setShowIntro(false);
    setRevealed(true);
  }, []);

  return (
    <>
      {showIntro ? (
        <CinematicIntro onReveal={onReveal} onComplete={onIntroComplete} />
      ) : null}

      <div
        className={`relative min-h-full will-change-[clip-path,opacity] ${
          revealed ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          // Circular iris reveal from screen center — the premium handoff
          clipPath: revealed
            ? "circle(160% at 50% 44%)"
            : "circle(0% at 50% 44%)",
          opacity: revealed ? 1 : 0.98,
          transition:
            "clip-path 680ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease",
        }}
      >
        <AmbientBackground />
        <div className="noise" aria-hidden />
        <div className="scan-lines" aria-hidden />
        {enableCursor && revealed ? <CustomCursor /> : null}
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
