'use client';

import { Canvas, type CanvasProps } from '@react-three/fiber';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type LazyCanvasProps = Omit<CanvasProps, 'children' | 'fallback'> & {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  eager?: boolean;
};

// Monta o Canvas só quando a seção chega perto da tela e pausa o loop quando ela sai,
// para não manter vários contextos WebGL renderizando ao mesmo tempo
export default function LazyCanvas({
  children,
  className,
  fallback = null,
  eager = false,
  ...canvasProps
}: LazyCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(eager);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '240px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      {mounted ? (
        <Canvas
          flat
          dpr={[1, 1.75]}
          frameloop={visible ? 'always' : 'never'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          fallback={fallback}
          {...canvasProps}
        >
          {children}
        </Canvas>
      ) : (
        fallback
      )}
    </div>
  );
}
