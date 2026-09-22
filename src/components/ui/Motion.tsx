"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface FadeInUpProps extends HTMLMotionProps<"div"> {
  index?: number;
}

/** Standard staggered card entrance used across every panel grid. */
export function FadeInUp({ index = 0, transition, ...props }: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4), ...transition }}
      {...props}
    />
  );
}
