"use client";

import { useEffect, type ReactNode } from "react";
import { useLenisGsap } from "@/hooks/useLenisGsap";
import { usePerfFlags } from "@/components/providers/Providers";
import { markPreloaderDone } from "@/lib/preloader";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navigation } from "@/components/layout/Navigation";
import { EasterEggs } from "@/components/easter-eggs/EasterEggs";
import { Providers } from "@/components/providers/Providers";

function ShellInner({ children }: { children: ReactNode }) {
  useLenisGsap();
  const { enableCursor, lite } = usePerfFlags();

  useEffect(() => {
    markPreloaderDone();
  }, []);

  return (
    <div className="relative min-h-full">
      {!lite && <AmbientBackground />}
      {!lite && <div className="noise" aria-hidden />}
      {!lite && <div className="scan-lines" aria-hidden />}
      {enableCursor ? <CustomCursor /> : null}
      <Navigation />
      <div className="relative z-10">{children}</div>
      <EasterEggs />
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <ShellInner>{children}</ShellInner>
    </Providers>
  );
}
