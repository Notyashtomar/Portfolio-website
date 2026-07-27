/** Shared motion tokens for consistent, GPU-friendly animation */

export const easeOut = [0.16, 1, 0.3, 1] as const;
export const easeSoft = [0.22, 1, 0.36, 1] as const;

export const springSoft = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
  mass: 0.7,
};

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: easeOut },
};

export const hoverLift = {
  y: -6,
  transition: springSoft,
};
