"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";

type Mode = "chars" | "words" | "lines";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  mode?: Mode;
  className?: string;
  delay?: number;
  trigger?: boolean;
  stagger?: number;
  once?: boolean;
};

function split(text: string, mode: Mode) {
  if (mode === "lines") {
    return text.split("\n").map((line, i) => ({ key: `l-${i}`, value: line, wrap: "line" as const }));
  }
  if (mode === "words") {
    return text.split(" ").map((word, i) => ({ key: `w-${i}`, value: word, wrap: "word" as const }));
  }
  return text.split("").map((char, i) => ({
    key: `c-${i}`,
    value: char === " " ? "\u00A0" : char,
    wrap: "char" as const,
  }));
}

export function SplitReveal({
  text,
  as: Tag = "h2",
  mode = "words",
  className,
  delay = 0,
  trigger = true,
  stagger = 0.04,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { lite } = usePerfFlags();
  const parts = useMemo(() => split(text, mode), [text, mode]);

  useEffect(() => {
    if (!trigger || !ref.current) return;
    registerGsap();
    const targets = ref.current.querySelectorAll("[data-split]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          y: lite ? 24 : 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: lite ? 0.55 : 0.75,
          delay,
          stagger: lite ? stagger * 0.6 : stagger,
          ease: "power3.out",
          scrollTrigger: once
            ? {
                trigger: ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
              }
            : undefined,
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [trigger, delay, stagger, lite, once, text]);

  return (
    <Tag ref={ref as never} className={cn("font-display", className)} aria-label={text}>
      {parts.map((part) => {
        if (part.wrap === "line") {
          return (
            <span key={part.key} className="split-line">
              <span data-split className="inline-block">
                {part.value}
              </span>
            </span>
          );
        }
        if (part.wrap === "word") {
          return (
            <span key={part.key} className="split-word mr-[0.28em]">
              <span data-split className="inline-block">
                {part.value}
              </span>
            </span>
          );
        }
        return (
          <span key={part.key} className="split-word">
            <span data-split className="inline-block">
              {part.value}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
