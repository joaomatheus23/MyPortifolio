'use client';

// "Bit", o robô validador que acompanha o visitante (pixel art em SVG)
const SPRITE = [
  '.......gg.......',
  '.......kk.......',
  '....kkkkkkkk....',
  '...kllllllllk...',
  '...klkkkkkklk...',
  '...klcwkkwclk...',
  '...klcckkcclk...',
  '...klkkkkkklk...',
  '...kllllllllk...',
  '...klllpplllk...',
  '....kkkkkkkk....',
  '.....kbbbbk.....',
  '..kkkbbccbbkkk..',
  '.kbbkbcggcbkbbk.',
  '.kbbkbbccbbkbbk.',
  '..kk.kkkkkk.kk..',
];

const COLORS: Record<string, string> = {
  k: '#0b1220',
  l: '#3b4b63',
  b: '#1f2a3d',
  c: '#8b5cf6',
  w: '#e8fbff',
  g: '#ff3b47',
  p: '#8b5cf6',
};

type PixelBotProps = {
  className?: string;
  blinking?: boolean;
};

export default function PixelBot({ className, blinking = false }: PixelBotProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden="true">
      {SPRITE.map((row, y) =>
        row.split('').map((pixel, x) => {
          if (pixel === '.') return null;
          const isEye = (y === 5 || y === 6) && (pixel === 'c' || pixel === 'w');
          const isLed = y === 0 && pixel === 'g';
          const fill = isEye && blinking ? COLORS.k : COLORS[pixel];
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={fill}
              className={isLed ? 'animate-[botled_1.6s_steps(2)_infinite]' : undefined}
            />
          );
        }),
      )}
    </svg>
  );
}
