"use client";

import { useLenisGsap } from "@/hooks/useLenisGsap";
import { usePerfFlags } from "@/components/providers/Providers";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navigation } from "@/components/layout/Navigation";
import { EasterEggs } from "@/components/easter-eggs/EasterEggs";
import { Providers } from "@/components/providers/Providers";
import type { ReactNode } from "react";

function ShellInner({ children }: { children: ReactNode }) {
  useLenisGsap();
  const { enableCursor } = usePerfFlags();

  return (
    <>
      <AmbientBackground />
      <div className="noise" aria-hidden />
      {enableCursor ? <CustomCursor /> : null}
      <Navigation />
      <div className="relative z-10">{children}</div>
      <EasterEggs />
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
