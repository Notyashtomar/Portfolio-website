"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, Phone } from "lucide-react";
import { profile } from "@/data/resume";
import { GlowButton } from "@/components/ui/GlowButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "visitor"}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-48 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.45em] text-accent-blue/80">
          Contact
        </p>
        <SplitReveal
          text="Let's build the next decision system."
          as="h2"
          mode="words"
          className="mb-12 max-w-4xl text-[clamp(1.8rem,5.5vw,4.5rem)] font-semibold leading-[1.08] text-white sm:mb-20 md:mb-28"
        />

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <PremiumCard tilt={6}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="interactive"
                className="flex items-center gap-5"
              >
                <span className="rounded-2xl border border-white/10 bg-accent-blue/10 p-4 text-accent-blue">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="font-sans block text-[10px] uppercase tracking-[0.28em] text-muted">
                    Email
                  </span>
                  <span className="font-body break-all text-white">{profile.email}</span>
                </span>
              </a>
            </PremiumCard>

            <PremiumCard tilt={6}>
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                data-cursor="interactive"
                className="flex items-center gap-5"
              >
                <span className="rounded-2xl border border-white/10 bg-accent-violet/10 p-4 text-accent-violet">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="font-sans block text-[10px] uppercase tracking-[0.28em] text-muted">
                    Phone
                  </span>
                  <span className="font-body text-white">{profile.phone}</span>
                </span>
              </a>
            </PremiumCard>

            <a
              href={profile.resumeFile}
              download
              data-cursor="interactive"
              className="inline-flex"
            >
              <GlowButton variant="glow">
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download resume
                </span>
              </GlowButton>
            </a>
          </div>

          <PremiumCard tilt={8} float={false} className="!p-5 sm:!p-8 md:!p-12">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="font-body mt-3 w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-accent-blue/50 focus:shadow-[0_0_30px_rgba(79,140,255,0.15)]"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="font-body mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-accent-blue/50 focus:shadow-[0_0_30px_rgba(79,140,255,0.15)]"
                />
              </div>
              <motion.button
                type="submit"
                data-cursor="interactive"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-sans w-full rounded-full bg-white px-6 py-4 text-sm font-medium tracking-wide text-black transition hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                {sent ? "Opening mail client…" : "Send message"}
              </motion.button>
            </form>
          </PremiumCard>
        </div>
      </div>
    </section>
  );
}
