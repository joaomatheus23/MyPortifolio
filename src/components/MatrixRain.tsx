'use client';

import { useEffect, useRef } from 'react';

const GLYPHS = '01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>/{}#$%&';

type MatrixRainProps = {
  className?: string;
  density?: number;
};

// Chuva de caracteres "hacker" (a mesma ideia da tela do laptop) num canvas 2D.
// Só anima enquanto está visível e fica parada se o usuário pede menos movimento.
export default function MatrixRain({ className, density = 18 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const family = getComputedStyle(document.body).getPropertyValue('--font-geist-mono').trim() || 'monospace';
    let columns: { y: number; speed: number; red: boolean }[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.ceil(width / density);
      columns = Array.from({ length: count }, () => ({
        y: Math.random() * height,
        speed: 40 + Math.random() * 110,
        red: Math.random() < 0.12,
      }));
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      ctx.fillStyle = 'rgba(9,9,11,0.14)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${density - 4}px ${family}`;
      columns.forEach((column, index) => {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = index * density;
        ctx.fillStyle = column.red ? 'rgba(255,59,71,0.85)' : 'rgba(167,139,250,0.75)';
        ctx.fillText(char, x, column.y);
        column.y += column.speed * dt;
        if (column.y > height + 20) {
          column.y = -20 - Math.random() * height * 0.5;
          column.red = Math.random() < 0.12;
        }
      });
      if (visible && !reduce) frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    });
    resize();
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    if (reduce) draw(performance.now());

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
