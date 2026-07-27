"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

type Props = {
  numeric: number;
  suffix: string;
  fallback: string;
};

export function ProjectMetricValue({ numeric, suffix, fallback }: Props) {
  if (numeric > 0) {
    return <AnimatedCounter value={numeric} suffix={suffix} duration={1.5} />;
  }
  return <>{fallback}</>;
}
