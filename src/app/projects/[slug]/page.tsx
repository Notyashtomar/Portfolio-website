import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/resume";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { SplitReveal } from "@/components/motion/SplitReveal";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} · Yash Raj Singh Tomar`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="relative px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 md:px-12 md:pt-40 lg:px-16">
      <div className="relative mx-auto max-w-5xl">
        <Link
          href="/#projects"
          className="font-sans mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/45 transition hover:text-white sm:mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-accent-blue">
          {project.subtitle}
        </p>
        <SplitReveal
          text={project.title}
          as="h1"
          mode="words"
          className="mt-5 max-w-4xl text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.05] text-white"
        />
        <SplitReveal
          text={project.tagline}
          as="p"
          mode="words"
          className="font-body mt-6 max-w-2xl text-base leading-[1.8] text-muted sm:text-lg"
          stagger={0.015}
        />

        <div className="mt-10 grid grid-cols-3 gap-3 sm:mt-16 sm:gap-4">
          {project.metrics.map((metric) => (
            <PremiumCard key={metric.label} float={false} tilt={5}>
              <p className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                {metric.value}
              </p>
              <p className="font-sans mt-2 text-[9px] uppercase tracking-[0.18em] text-muted sm:mt-3 sm:text-[10px] sm:tracking-[0.24em]">
                {metric.label}
              </p>
            </PremiumCard>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2">
          <PremiumCard tilt={6}>
            <h2 className="font-display text-xl text-white sm:text-2xl">Challenge</h2>
            <p className="font-body mt-5 text-sm leading-[1.85] text-muted">
              {project.challenge}
            </p>
          </PremiumCard>
          <PremiumCard tilt={6}>
            <h2 className="font-display text-xl text-white sm:text-2xl">Solution</h2>
            <p className="font-body mt-5 text-sm leading-[1.85] text-muted">
              {project.solution}
            </p>
          </PremiumCard>
        </div>

        <PremiumCard className="mt-4 sm:mt-6" tilt={4}>
          <h2 className="font-display text-xl text-white sm:text-2xl">Tech Stack</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-white/65"
              >
                {item}
              </span>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard className="mt-4 sm:mt-6" tilt={4}>
          <h2 className="font-display text-xl text-white sm:text-2xl">Architecture</h2>
          <ol className="mt-6 space-y-4">
            {project.architecture.map((step, i) => (
              <li key={step} className="font-body flex gap-4 text-sm text-muted">
                <span className="font-sans text-accent-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </PremiumCard>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2">
          <PremiumCard tilt={5}>
            <h2 className="font-display text-xl text-white sm:text-2xl">Impact</h2>
            <p className="font-body mt-5 text-sm leading-[1.85] text-muted">
              {project.impact}
            </p>
          </PremiumCard>
          <PremiumCard tilt={5}>
            <h2 className="font-display text-xl text-white sm:text-2xl">Lessons Learned</h2>
            <ul className="mt-5 space-y-3">
              {project.lessons.map((lesson) => (
                <li key={lesson} className="font-body text-sm leading-[1.85] text-muted">
                  {lesson}
                </li>
              ))}
            </ul>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
