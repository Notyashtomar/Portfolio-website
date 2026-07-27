"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlowButton } from "@/components/ui/GlowButton";
import { profile } from "@/data/resume";
import Link from "next/link";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#impact", label: "Impact" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    // Show nav sooner on mobile/tablet so users can navigate
    const threshold =
      typeof window !== "undefined" && window.innerWidth < 1024
        ? 80
        : window.innerHeight * 0.75;
    setVisible(v > threshold);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: visible ? 0 : -80,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-6 sm:py-4 md:px-12",
        visible && "pointer-events-auto",
        !visible && "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[90rem] items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-700 sm:px-6 sm:py-3",
          visible
            ? "border-white/10 bg-black/50 shadow-[0_8px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Link
          href="#hero"
          data-cursor="interactive"
          className="font-display text-sm font-semibold tracking-[0.2em] text-white"
        >
          YRST
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="interactive"
              className="group relative font-sans text-[11px] uppercase tracking-[0.28em] text-white/45 transition hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-blue transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={profile.resumeFile}
            download
            data-cursor="interactive"
            className="hidden md:block"
          >
            <GlowButton variant="ghost" className="!px-5 !py-2.5 !text-[11px] !tracking-[0.2em]">
              Resume
            </GlowButton>
          </Link>
          {/* Hamburger toggle for mobile/tablet */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-cursor="interactive"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <svg
              className="h-4 w-4 text-white/70"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </>
              ) : (
                <>
                  <line x1="2" y1="5" x2="14" y2="5" />
                  <line x1="2" y1="8" x2="14" y2="8" />
                  <line x1="2" y1="11" x2="14" y2="11" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mx-auto mt-3 max-w-[90rem] rounded-3xl border border-white/10 bg-black/90 p-6 backdrop-blur-2xl lg:hidden"
        >
          <nav className="grid gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-4 py-3 font-sans text-sm uppercase tracking-[0.22em] text-white/70 transition hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-white/8 pt-4">
            <Link
              href={profile.resumeFile}
              download
              onClick={() => setOpen(false)}
            >
              <GlowButton variant="ghost" className="w-full justify-center !text-[11px] !tracking-[0.2em]">
                Download Resume
              </GlowButton>
            </Link>
          </div>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
