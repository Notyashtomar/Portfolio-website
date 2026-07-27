"use client";

import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePerfFlags } from "@/components/providers/Providers";
import { profile } from "@/data/resume";
import { GlowButton } from "@/components/ui/GlowButton";
import { HeroWorkspace } from "@/components/hero/HeroWorkspace";
import { easeOut } from "@/lib/motion";

const HERO_ROLES = [
  "Business Analyst",
  "Financial Analyst",
  "MIS Specialist",
  "Dashboard Developer",
  "SQL & Automation Specialist",
] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { lite } = usePerfFlags();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % HERO_ROLES.length);
    }, 2600);
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
        y: -60,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [lite]);

  useEffect(() => {
    if (lite) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        mouseX.set(Math.min(1, Math.max(0, nx)));
        mouseY.set(Math.min(1, Math.max(0, ny)));
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lite, mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-mesh absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(79,140,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_30%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(255,61,154,0.05),transparent_45%)]" />
        <div className="hero-grid absolute inset-0 opacity-[0.035]" />
        <div className="noise absolute inset-0 !opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-transparent to-[#030303]" />
      </div>

      {!lite ? (
        <>
          <motion.div
            className="pointer-events-none absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-accent-blue/15 blur-3xl"
            animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.12, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute bottom-[18%] right-[12%] h-72 w-72 rounded-full bg-accent-violet/15 blur-3xl"
            animate={{ opacity: [0.2, 0.45, 0.2], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <div
        ref={contentRef}
        className="relative z-10 mx-auto grid w-full max-w-[90rem] items-center gap-12 px-4 py-24 sm:px-6 sm:py-28 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-16 lg:py-0"
      >
        {/* LEFT — copy */}
        <div className="relative max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.15, duration: 0.7, ease: easeOut }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/70 sm:text-[11px]">
              Available for Opportunities
            </span>
          </motion.div>

          {/* Heading */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.8, ease: easeOut }}
              className="font-display text-[clamp(1.6rem,4vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-white/55"
            >
              Hi, I&apos;m
            </motion.p>
          </div>

          <h1 className="hero-title-glow font-display mt-2 text-[clamp(2.4rem,6.5vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
            {"Yash Raj Singh Tomar".split(" ").map((word, wi) => (
              <span key={word} className="mr-[0.22em] inline-block overflow-hidden last:mr-0">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    delay: 0.42 + wi * 0.08,
                    duration: 0.85,
                    ease: easeOut,
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Role switcher */}
          <div className="relative mt-7 h-11 overflow-hidden sm:mt-8 sm:h-12 md:h-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={HERO_ROLES[roleIndex]}
                initial={{ y: 28, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -24, opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-xl text-accent-blue sm:text-2xl md:text-3xl"
              >
                {HERO_ROLES[roleIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.85, duration: 0.7, ease: easeOut }}
            className="font-body mt-6 max-w-lg text-sm leading-[1.85] text-muted sm:mt-7 sm:text-base"
          >
            I transform complex business data into meaningful insights through
            analytics, automation, and modern dashboard solutions.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.65, ease: easeOut }}
            className="mt-9 flex flex-wrap items-center gap-4 sm:mt-11"
          >
            <Link href="#projects" data-cursor="interactive">
              <GlowButton variant="primary">View My Work</GlowButton>
            </Link>
            <a href={profile.resumeFile} download data-cursor="interactive">
              <GlowButton variant="ghost">Download Resume</GlowButton>
            </a>
          </motion.div>
        </div>

        {/* RIGHT — analytics workspace */}
        <div className="relative mx-auto flex w-full max-w-lg justify-center lg:max-w-none lg:justify-end">
          <HeroWorkspace mouseX={mouseX} mouseY={mouseY} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.55, duration: 0.7, ease: easeOut }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <div className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-white/80"
            animate={{ y: [0, 10, 0], opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          className="font-sans text-[9px] uppercase tracking-[0.35em] text-white/35"
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll to Explore
        </motion.span>
      </motion.div>
    </section>
  );
}
