import dynamic from "next/dynamic";
import { Hero } from "@/components/hero/Hero";
import { LazySection } from "@/components/motion/LazySection";
import { SectionTransition } from "@/components/motion/SectionTransition";
import { Projects } from "@/components/sections/Projects";

const About = dynamic(() =>
  import("@/components/sections/About").then((m) => m.About),
);
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((m) => m.Experience),
);
const Skills = dynamic(() =>
  import("@/components/sections/Skills").then((m) => m.Skills),
);
const Achievements = dynamic(() =>
  import("@/components/sections/Achievements").then((m) => m.Achievements),
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => m.Contact),
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionTransition />
      <About />
      <SectionTransition />
      <Experience />
      <SectionTransition />
      <Projects />
      <SectionTransition />
      <LazySection minHeight="80vh">
        <Skills />
      </LazySection>
      <SectionTransition />
      <LazySection>
        <Achievements />
      </LazySection>
      <SectionTransition />
      <LazySection minHeight="80vh">
        <Contact />
      </LazySection>
      <footer className="relative z-10 border-t border-white/6 px-4 py-10 text-center sm:px-6 sm:py-14 md:px-12">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/25 sm:tracking-[0.4em]">
          © 2026 Yash Raj Singh Tomar
        </p>
      </footer>
    </>
  );
}
