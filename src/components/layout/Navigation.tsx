"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlowButton } from "@/components/ui/GlowButton";
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
    setVisible(v > window.innerHeight * 0.75);
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
        "fixed inset-x-0 top-0 z-50 px-6 py-4 md:px-12",
        visible && "pointer-events-auto",
        !visible && "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[90rem] items-center justify-between rounded-full border px-6 py-3 transition-all duration-700",
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
            href="/Yash-Raj-Singh-Tomar-Resume.pdf"
            download
            data-cursor="interactive"
            className="hidden sm:block"
          >
            <GlowButton variant="ghost" className="!px-5 !py-2.5 !text-[11px] !tracking-[0.2em]">
              Resume
            </GlowButton>
          </Link>
          <button
            type="button"
            aria-label="Menu"
            data-cursor="interactive"
            className="rounded-full border border-white/10 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-white/70 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-3 max-w-[90rem] rounded-3xl border border-white/10 bg-black/80 p-6 backdrop-blur-2xl lg:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 font-sans text-sm uppercase tracking-[0.22em] text-white/70"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      ) : null}
    </motion.header>
  );
}
