"use client";

import { MotionConfig } from "framer-motion";

/**
 * "user" makes every framer-motion animation in the tree honour the OS
 * prefers-reduced-motion setting automatically, without each component
 * having to check it individually.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
