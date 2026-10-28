'use client';

import { useEffect, useState } from 'react';

const GLYPHS = '0123456789abcdef#$%&*<>/\\=+';

type ScrambleTextProps = {
  text: string;
  active: boolean;
  duration?: number;
  className?: string;
};

// Texto que "descriptografa": começa embaralhado e resolve letra por letra
export default function ScrambleText({ text, active, duration = 900, className }: ScrambleTextProps) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!active) {
      setShown(text);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      setShown(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || index < settled) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, text, duration]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
