"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface CountUpProps {
  value?: string | number;
  to?: number;
  end?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function CountUp({
  value,
  to,
  end,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className = "",
  once = false,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  // Parse string or numeric input (e.g. "350+", "20K+", "120")
  let targetNum = to ?? end ?? 0;
  let parsedSuffix = suffix;
  let parsedPrefix = prefix;
  if (value !== undefined) {
    if (typeof value === "number") {
      targetNum = value;
    } else if (typeof value === "string") {
      const match = value.match(/^([^0-[#]*?)(\d+(?:\.\d+)?)(k|K|m|M)?(.*)$/);
      if (match) {
        parsedPrefix = prefix || match[1];
        targetNum = parseFloat(match[2]);
        const unit = (match[3] || "").toUpperCase();
        if (unit === "M") {
          targetNum = targetNum * 1000000;
        }
        parsedSuffix = suffix || (unit ? `${unit}${match[4]}` : match[4]);
      } else {
        targetNum = parseFloat(value) || 0;
      }
    }
  }

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      if (!once) {
        const frame = requestAnimationFrame(() => setCount(0));
        return () => cancelAnimationFrame(frame);
      }
      return;
    }

    const controls = animate(0, targetNum, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        setCount(latest);
      },
    });

    return () => controls.stop();
  }, [isInView, targetNum, duration, once]);

  const displayValue = Math.floor(count);

  return (
    <span ref={ref} className={className}>
      {parsedPrefix}
      {displayValue.toLocaleString()}
      {parsedSuffix}
    </span>
  );
}
