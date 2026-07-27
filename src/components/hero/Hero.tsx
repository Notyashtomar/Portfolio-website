"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";
import { profile } from "@/data/resume";
import { GlowButton } from "@/components/ui/GlowButton";

const PlasmaScene = dynamic(
  () => import("./PlasmaScene").then((m) => m.PlasmaScene),
  { ssr: false, loading: () => <div className="hero-fallback-glow absolute inset-0" /> },
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { lite } = usePerfFlags();

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % profile.roles.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (lite) return;
    registerGsap();
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        y: -80,
        opacity: 0.2,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [lite]);

  useEffect(() => {
    if (lite) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (lightRef.current) {
          lightRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
        }
        raf = 0;
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lite]);

  const nameParts = profile.displayName.split(" ");

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-20 sm:pb-20 sm:pt-28 md:items-center md:pb-0 md:pt-0"
    >
      <PlasmaScene />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/15 to-[#030303]" />
      {!lite ? (
        <div
          ref={lightRef}
          className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(79,140,255,0.14) 0%, transparent 65%)",
            willChange: "transform",
          }}
        />
      ) : null}

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[90rem] px-6 md:px-12 lg:px-16"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans mb-8 text-[11px] uppercase tracking-[0.45em] text-white/45"
        >
          {profile.location} · {profile.title}
        </motion.p>

        <h1 className="hero-title-glow font-display max-w-[14ch] text-[clamp(2.4rem,9vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
          {nameParts.map((word, wi) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  delay: 0.35 + wi * 0.12,
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-8 h-10 overflow-hidden sm:mt-10 sm:h-12 md:h-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={profile.roles[roleIndex]}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -28, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-lg text-accent-blue sm:text-xl md:text-3xl"
            >
              {profile.roles[roleIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="font-body mt-6 max-w-md text-sm leading-[1.8] text-muted sm:mt-8 md:text-base"
        >
          Turning financial complexity into clarity — through analytics, MIS
          systems, and project leadership that moves the business forward.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center gap-4 sm:mt-12 sm:gap-5"
        >
          <Link href="#projects" data-cursor="interactive">
            <GlowButton variant="primary">View work</GlowButton>
          </Link>
          <Link href="#contact" data-cursor="interactive">
            <GlowButton variant="ghost">Get in touch</GlowButton>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/30">
          Enter
        </span>
        <motion.span
          className="h-12 w-px bg-gradient-to-b from-accent-blue/80 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
