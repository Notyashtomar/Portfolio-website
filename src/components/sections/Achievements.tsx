"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { achievements, certifications, education } from "@/data/resume";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SplitReveal } from "@/components/motion/SplitReveal";

/* ── Stat card (achievment metric) — expands on hover ── */
function StatCard({
  item,
  index,
}: {
  item: (typeof achievements)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#05070d] p-5 sm:p-6 md:p-8 cursor-default"
    >
      {/* Animated border glow on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: "inset 0 0 30px rgba(79,140,255,0.12), 0 0 40px rgba(79,140,255,0.08)" }}
      />
      {/* Scan line sweep */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/60 to-transparent"
        initial={{ top: "0%", opacity: 0 }}
        animate={hovered ? { top: ["0%", "100%"], opacity: [0, 0.7, 0] } : { top: "0%", opacity: 0 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      />
      {/* Corner number */}
      <span className="absolute right-4 top-3 font-sans text-[9px] uppercase tracking-[0.3em] text-white/15">
        {String(index + 1).padStart(2, "0")}
      </span>

      <p className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl lg:text-5xl">
        <AnimatedCounter value={item.value} suffix={item.suffix} />
      </p>
      <p className="font-sans mt-3 text-sm text-white sm:mt-4">{item.label}</p>

      <AnimatePresence>
        {hovered ? (
          <motion.p
            key="detail"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-body overflow-hidden text-xs leading-relaxed text-accent-blue/80"
          >
            {item.detail}
          </motion.p>
        ) : (
          <motion.p
            key="muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-body mt-2 text-xs leading-relaxed text-muted"
          >
            {item.detail}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Education card ── */
const EDU_DETAIL: Record<string, { expand: string; tags: string[] }> = {
  "Maharaja Agrasen College, University of Delhi": {
    expand: "Built quantitative foundations in Statistics and Probability that underpin every financial model I've built since — from ARIMA forecasting to regression-based cost attribution.",
    tags: ["Statistics", "Probability", "Data Analysis", "Math"],
  },
  "JM International School, Delhi": {
    expand: "Physics and Mathematics training sharpened analytical and problem-solving skills, directly applied to complex financial modeling and data engineering challenges.",
    tags: ["Physics", "Chemistry", "Math", "90% Score"],
  },
};

function EducationCard({
  item,
  index,
}: {
  item: (typeof education)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const extra = EDU_DETAIL[item.school];

  return (
    <motion.button
      type="button"
      onClick={() => setOpen((p) => !p)}
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/8 bg-[#05070d] p-5 text-left transition-colors hover:border-accent-blue/25 sm:p-6"
    >
      {/* Animated left accent */}
      <motion.div
        className="absolute left-0 top-0 h-full w-0.5 origin-top bg-accent-blue"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-sans mb-3 text-[10px] uppercase tracking-[0.32em] text-accent-gold">
            {item.period}
          </p>
          <p className="font-display text-lg leading-snug text-white sm:text-xl">{item.school}</p>
          <p className="font-body mt-2 text-sm text-muted">{item.credential}</p>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-1 shrink-0 text-white/30 text-lg leading-none"
        >
          +
        </motion.span>
      </div>

      <AnimatePresence>
        {open && extra && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body mt-4 text-sm leading-relaxed text-white/60 border-t border-white/8 pt-4">
              {extra.expand}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {extra.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent-blue/25 bg-accent-blue/8 px-2.5 py-0.5 font-sans text-[9px] uppercase tracking-[0.18em] text-accent-blue/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Certification card ── */
const CERT_DETAIL: Record<string, string> = {
  "Financial Modelling & Business Analysis":
    "Mastered DCF, LBO, and 3-statement financial models using Excel — core toolkit for every valuation project I've led.",
  "Data Analytics & Visualization":
    "Advanced Tableau and Excel techniques for turning raw data into executive-ready visual narratives.",
  "Introduction to Corporate Finance":
    "Capital structure theory, WACC, and investment appraisal — applied directly to real forecasting and capex models.",
  "Leadership Skills":
    "Cross-functional leadership frameworks and decision-making under uncertainty, honed at IIMA's rigorous program.",
  "How Software Ate Finance":
    "Stanford's deep-dive into FinTech, algo-trading, and data-first finance — shaping my approach to financial automation.",
};

function CertCard({
  cert,
  index,
}: {
  cert: (typeof certifications)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const detail = CERT_DETAIL[cert.title];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#05070d] p-5 transition-colors hover:border-accent-violet/25"
    >
      {/* Corner scan dot */}
      <motion.div
        className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-accent-violet"
        animate={hovered ? { opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] } : { opacity: 0.3 }}
        transition={{ duration: 1.4, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
      />

      <p className="font-body pr-6 text-sm leading-snug text-white">{cert.title}</p>
      <p className="font-sans mt-3 text-[10px] uppercase tracking-[0.2em] text-muted">{cert.issuer}</p>
      {cert.date && (
        <p className="font-sans mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white/35">{cert.date}</p>
      )}

      <AnimatePresence>
        {hovered && detail && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="font-body mt-3 overflow-hidden border-t border-white/8 pt-3 text-[11px] leading-[1.75] text-accent-violet/70"
          >
            {detail}
          </motion.p>
        )}
      </AnimatePresence>

      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="interactive"
          className="font-sans mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-accent-blue transition hover:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          View Credential <span aria-hidden>↗</span>
        </a>
      )}
    </motion.div>
  );
}

export function Achievements() {
  return (
    <section
      id="impact"
      className="relative px-4 py-20 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <span className="section-num">04 / IMPACT</span>
          <div className="h-px flex-1 bg-gradient-to-r from-accent-gold/30 to-transparent" />
        </div>
        <SplitReveal
          text="Proof in the outcomes."
          as="h2"
          mode="words"
          className="mb-12 max-w-4xl text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] text-white sm:mb-20 md:mb-28"
        />

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {achievements.map((item, i) => (
            <StatCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Education + Certs */}
        <div className="mt-16 grid gap-12 sm:mt-24 sm:gap-16 lg:grid-cols-2">
          {/* Education */}
          <div>
            <motion.div
              className="mb-8 flex items-center gap-3"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SplitReveal
                text="Education"
                as="h3"
                mode="chars"
                className="text-2xl font-semibold text-white sm:text-3xl"
                stagger={0.04}
              />
              <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-muted">
                · tap to expand
              </span>
            </motion.div>
            <div className="space-y-5">
              {education.map((item, i) => (
                <EducationCard key={`${item.school}-${item.period}`} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <motion.div
              className="mb-8 flex items-center gap-3"
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SplitReveal
                text="Certifications"
                as="h3"
                mode="chars"
                className="text-2xl font-semibold text-white sm:text-3xl"
                stagger={0.04}
              />
              <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-muted">
                · hover to reveal
              </span>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2">
              {certifications.map((cert, i) => (
                <CertCard key={`${cert.issuer}-${cert.title}`} cert={cert} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
