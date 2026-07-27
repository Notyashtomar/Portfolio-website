"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  tierToFlags,
  usePerformanceTier,
  type PerformanceTier,
} from "@/hooks/usePerformanceTier";

type AppSettings = {
  performanceMode: boolean;
  tier: PerformanceTier;
  audioEnabled: boolean;
  developerMode: boolean;
  theme: "dark" | "midnight";
  setPerformanceMode: (v: boolean) => void;
  setAudioEnabled: (v: boolean) => void;
  setDeveloperMode: (v: boolean) => void;
  toggleTheme: () => void;
};

const SettingsContext = createContext<AppSettings | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within Providers");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const tier = usePerformanceTier();
  const flags = tierToFlags(tier);
  const [manualPerf, setManualPerf] = useState<boolean | null>(null);
  const performanceMode = manualPerf ?? flags.lite;
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [theme, setTheme] = useState<"dark" | "midnight">("dark");

  const setPerformanceMode = useCallback((v: boolean) => {
    setManualPerf(v);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "midnight" : "dark"));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.tier = tier;
    document.body.classList.toggle("reduce-motion", performanceMode);
    document.body.classList.toggle("no-cursor", tier !== "high");
    document.body.style.setProperty(
      "--bg",
      theme === "midnight" ? "#03030a" : "#030303",
    );
  }, [theme, performanceMode, tier]);

  const value = useMemo(
    () => ({
      performanceMode,
      tier,
      audioEnabled,
      developerMode,
      theme,
      setPerformanceMode,
      setAudioEnabled,
      setDeveloperMode,
      toggleTheme,
    }),
    [
      performanceMode,
      tier,
      audioEnabled,
      developerMode,
      theme,
      setPerformanceMode,
      toggleTheme,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function usePerfFlags() {
  const { performanceMode, tier } = useSettings();
  const flags = tierToFlags(tier);
  return {
    ...flags,
    performanceMode,
    tier,
  };
}
