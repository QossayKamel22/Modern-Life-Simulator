"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString(), className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{format(display)}</span>;
}
