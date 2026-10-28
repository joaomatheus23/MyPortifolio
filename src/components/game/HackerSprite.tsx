// Bonequinho hacker em pixel art (capuz, óculos brilhando e notebook na mão)
const SPRITE = [
  '....kkkkkkkk....',
  '...kHHHHHHHHk...',
  '..kHHHHHHHHHHk..',
  '..kHHkkkkkkHHk..',
  '..kHkseeeeskHk..',
  '..kHksssssskHk..',
  '..kHHksmmskHHk..',
  '...kHHkkkkHHk...',
  '..kHHHHHHHHHHk..',
  '.kHHHHHHHHHHHHk.',
  '.kHHkLLLLLLkHHk.',
  '.kHkLLLLGLLLkHk.',
  '.kHkLLLLLLLLkHk.',
  '..kkkkkkkkkkkk..',
  '...kHHk..kHHk...',
  '...khhk..khhk...',
  '..kkkkk..kkkkk..',
];

const PALETTES = {
  purple: { H: '#6d28d9', h: '#4c1d95', e: '#c4b5fd', G: '#a78bfa' },
  red: { H: '#b91c1c', h: '#7f1d1d', e: '#ff3b47', G: '#ff6b75' },
};

const BASE: Record<string, string> = { k: '#09090b', s: '#d9a77f', m: '#27272a', L: '#3f3f46' };

export type SpriteVariant = keyof typeof PALETTES;

export default function HackerSprite({ variant, className, flip = false }: { variant: SpriteVariant; className?: string; flip?: boolean }) {
  const palette = PALETTES[variant];
  return (
    <svg
      viewBox="0 0 16 17"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {SPRITE.map((row, y) =>
        row.split('').map((pixel, x) => {
          if (pixel === '.') return null;
          const fill = palette[pixel as keyof typeof palette] ?? BASE[pixel];
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        }),
      )}
    </svg>
  );
}
