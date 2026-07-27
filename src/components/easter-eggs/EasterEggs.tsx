"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/components/providers/Providers";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function EasterEggs() {
  const {
    setDeveloperMode,
    setPerformanceMode,
    toggleTheme,
    setAudioEnabled,
    developerMode,
    performanceMode,
    audioEnabled,
  } = useSettings();
  const buffer = useRef<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.current = [...buffer.current, key].slice(-KONAMI.length);
      const sequence = buffer.current.join("|").toLowerCase();
      const target = KONAMI.join("|").toLowerCase();
      if (sequence === target) {
        setDeveloperMode(true);
        document.body.animate(
          [
            { filter: "hue-rotate(0deg)" },
            { filter: "hue-rotate(40deg)" },
            { filter: "hue-rotate(0deg)" },
          ],
          { duration: 900 },
        );
      }

      if (e.key === "?" && e.shiftKey) {
        setDeveloperMode(!developerMode);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setPerformanceMode(!performanceMode);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleTheme();
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setAudioEnabled(!audioEnabled);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    audioEnabled,
    developerMode,
    performanceMode,
    setAudioEnabled,
    setDeveloperMode,
    setPerformanceMode,
    toggleTheme,
  ]);

  if (!developerMode) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[90] rounded-2xl border border-accent-gold/30 bg-black/80 px-4 py-3 text-xs text-white/80 backdrop-blur-xl">
      <p className="mb-1 font-medium text-accent-gold">Developer Mode</p>
      <p>Ctrl/Cmd + J · Performance</p>
      <p>Ctrl/Cmd + K · Theme</p>
      <p>Ctrl/Cmd + M · Ambient sound flag</p>
      <p>Shift + ? · Toggle this panel</p>
      <p className="mt-2 text-white/45">
        Perf: {performanceMode ? "on" : "off"} · Sound: {audioEnabled ? "on" : "off"}
      </p>
    </div>
  );
}
