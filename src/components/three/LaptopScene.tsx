'use client';

import { RoundedBox } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { CanvasTexture, Color, Group, InstancedMesh, MathUtils, Object3D, SRGBColorSpace } from 'three';
import { introStore } from '@/lib/introStore';
import { createBlockMaterial } from './blockMaterial';
import LazyCanvas from './LazyCanvas';

// Intro do hero: um laptop abre com a unidade criptografada, a senha cai caractere
// por caractere e, liberado, a tela fica com a foto do João.
export type LaptopLabels = {
  lockTitle: string;
  user: string;
  role: string;
  passwordLabel: string;
  decrypting: string;
  layers: string[];
  granted: string;
};

const W = 4.6;
const T = 0.16;
const D = 3.1;
const H = 3.0;
const LID = 0.1;
const CLOSED = Math.PI / 2;
const OPEN = -0.2;
const KEY_COLS = 14;
const KEY_ROWS = 5;
const HEX = '0123456789ABCDEF';
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789#$%&@!?*';
const SCREEN_W = 1024;
const SCREEN_H = 640;
const PURPLE = '#8b5cf6';
const RED = '#ff3b47';

type PainterState = {
  power: number;
  progress: number;
  unlocked: boolean;
  unlockedFor: number;
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPadlock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, open: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.14;
  ctx.beginPath();
  ctx.arc(x, y - size * 0.15 - open * size * 0.35, size * 0.32, Math.PI, 0);
  ctx.stroke();
  roundRect(ctx, x - size * 0.48, y - size * 0.15, size * 0.96, size * 0.75, size * 0.12);
  ctx.fill();
  ctx.restore();
}

// Desenha a tela do laptop num canvas 2D que vira a textura da tela 3D
function createPainter(labels: LaptopLabels, password: string) {
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_W;
  canvas.height = SCREEN_H;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const tiny = document.createElement('canvas');
  const tinyCtx = tiny.getContext('2d') as CanvasRenderingContext2D;
  const avatar = new Image();
  avatar.src = '/profile.png';
  const family = getComputedStyle(document.body).getPropertyValue('--font-geist-mono').trim() || 'monospace';
  const mono = (size: number, weight = 400) => `${weight} ${size}px ${family}`;
  const columns = Array.from({ length: 46 }, () => ({
    y: Math.random() * SCREEN_H,
    speed: 60 + Math.random() * 160,
    chars: Array.from({ length: 12 }, () => HEX[Math.floor(Math.random() * 16)]),
  }));
  const avatarReady = () => avatar.complete && avatar.naturalWidth > 0;

  const drawLocked = ({ progress }: PainterState, dt: number) => {
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    ctx.font = mono(16);
    ctx.textAlign = 'left';
    columns.forEach((column, index) => {
      column.y += column.speed * dt;
      if (column.y > SCREEN_H + 240) column.y = -40;
      if (Math.random() < 0.08) column.chars[Math.floor(Math.random() * column.chars.length)] = HEX[Math.floor(Math.random() * 16)];
      column.chars.forEach((char, k) => {
        const alpha = (1 - k / column.chars.length) * 0.28;
        ctx.fillStyle = progress > 0.66 && index % 3 === 0 ? `rgba(255,59,71,${alpha})` : `rgba(139,92,246,${alpha})`;
        ctx.fillText(char, index * 22 + 6, column.y - k * 18);
      });
    });

    const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 180);
    drawPadlock(ctx, 512, 62, 34, 0, `rgba(255,59,71,${pulse})`);
    ctx.textAlign = 'center';
    ctx.fillStyle = RED;
    ctx.font = mono(20, 700);
    ctx.fillText(labels.lockTitle, 512, 112);

    ctx.fillStyle = 'rgba(12,12,15,0.92)';
    roundRect(ctx, 292, 132, 440, 430, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Avatar começa pixelado e fica nítido conforme a criptografia cai
    if (avatarReady()) {
      const px = Math.max(6, Math.floor(6 + progress * progress * 150));
      tiny.width = px;
      tiny.height = px;
      tinyCtx.drawImage(avatar, 300, 70, 440, 440, 0, 0, px, px);
      ctx.save();
      ctx.beginPath();
      ctx.arc(512, 226, 64, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#18181b';
      ctx.fillRect(448, 162, 128, 128);
      ctx.imageSmoothingEnabled = progress > 0.95;
      ctx.drawImage(tiny, 0, 0, px, px, 448, 162, 128, 128);
      ctx.restore();
    }
    ctx.strokeStyle = PURPLE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 226, 68, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    ctx.fillStyle = '#fafafa';
    ctx.font = mono(22, 700);
    ctx.fillText(labels.user, 512, 330);

    ctx.fillStyle = 'rgba(161,161,170,0.9)';
    ctx.font = mono(14);
    ctx.fillText(labels.passwordLabel.toUpperCase(), 512, 368);

    const cracked = Math.floor(progress * password.length + 0.0001);
    const box = 30;
    const gap = 6;
    const startX = 512 - (password.length * (box + gap) - gap) / 2;
    ctx.font = mono(20, 700);
    password.split('').forEach((char, index) => {
      const x = startX + index * (box + gap);
      const done = index < cracked;
      ctx.fillStyle = done ? 'rgba(255,59,71,0.14)' : 'rgba(255,255,255,0.04)';
      roundRect(ctx, x, 382, box, 38, 6);
      ctx.fill();
      ctx.strokeStyle = done ? 'rgba(255,59,71,0.75)' : index === cracked ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = done ? RED : index === cracked ? '#c4b5fd' : 'rgba(113,113,122,0.8)';
      ctx.fillText(done ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x + box / 2, 408);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 332, 452, 360, 8, 4);
    ctx.fill();
    const gradient = ctx.createLinearGradient(332, 0, 692, 0);
    gradient.addColorStop(0, PURPLE);
    gradient.addColorStop(1, RED);
    ctx.fillStyle = gradient;
    roundRect(ctx, 332, 452, Math.max(8, 360 * progress), 8, 4);
    ctx.fill();

    ctx.fillStyle = '#c4b5fd';
    ctx.font = mono(15);
    ctx.fillText(`${labels.decrypting} · ${Math.round(progress * 100)}%`, 512, 495);
    const layer = labels.layers[Math.min(labels.layers.length - 1, Math.floor(progress * labels.layers.length))];
    ctx.fillStyle = 'rgba(161,161,170,0.85)';
    ctx.font = mono(13);
    ctx.fillText(layer ?? '', 512, 525);
  };

  const drawUnlocked = () => {
    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    const glow = ctx.createRadialGradient(512, 360, 30, 512, 360, 420);
    glow.addColorStop(0, 'rgba(139,92,246,0.42)');
    glow.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // A foto fica 100% do tempo na tela depois de liberado (sem depender de animação)
    if (avatarReady()) {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(avatar, 212, 40, 600, 600);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0, 0, SCREEN_W, 34);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e4e4e7';
    ctx.font = mono(14, 700);
    ctx.fillText('joao@web3', 20, 23);
    ctx.textAlign = 'right';
    ctx.fillStyle = RED;
    ctx.fillText(`● ${labels.granted.toLowerCase()}`, SCREEN_W - 20, 23);

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(12,12,15,0.85)';
    roundRect(ctx, 24, 560, 360, 58, 10);
    ctx.fill();
    ctx.fillStyle = '#fafafa';
    ctx.font = mono(17, 700);
    ctx.fillText(labels.user, 40, 584);
    ctx.fillStyle = '#a78bfa';
    ctx.font = mono(13);
    ctx.fillText(labels.role, 40, 605);

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let line = 0; line < SCREEN_H; line += 4) ctx.fillRect(0, line, SCREEN_W, 1);
  };

  return {
    canvas,
    draw(state: PainterState, dt: number) {
      if (state.unlocked) drawUnlocked();
      else drawLocked(state, dt);
      if (state.power < 1) {
        ctx.fillStyle = `rgba(0,0,0,${1 - state.power})`;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
      }
    },
  };
}

function Keyboard() {
  const meshRef = useRef<InstancedMesh>(null);
  const material = useMemo(() => createBlockMaterial({ base: '#0b0b0e', edgeWidth: 0.12, glow: 0.7 }), []);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const flashes = useMemo(() => new Float32Array(KEY_COLS * KEY_ROWS), []);
  const purple = useMemo(() => new Color(PURPLE), []);
  const red = useMemo(() => new Color(RED), []);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let row = 0; row < KEY_ROWS; row++) {
      for (let col = 0; col < KEY_COLS; col++) {
        dummy.position.set((col - (KEY_COLS - 1) / 2) * 0.295, T / 2 + 0.02, -1.2 + row * 0.28);
        dummy.scale.set(0.25, 0.035, 0.23);
        dummy.updateMatrix();
        mesh.setMatrixAt(row * KEY_COLS + col, dummy.matrix);
        mesh.setColorAt(row * KEY_COLS + col, purple);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, purple]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const { progress, unlocked } = introStore.get();
    const t = state.clock.elapsedTime;
    // Teclas acendendo em vermelho como se alguém digitasse tentativas de senha
    if (!unlocked && progress > 0 && Math.random() < 0.5) flashes[Math.floor(Math.random() * flashes.length)] = 1;
    for (let i = 0; i < flashes.length; i++) {
      flashes[i] = Math.max(0, flashes[i] - delta * 3);
      const wave = unlocked ? 0.5 + 0.5 * Math.sin(t * 2 - (i % KEY_COLS) * 0.45) : 0;
      color.copy(purple).lerp(red, flashes[i]).multiplyScalar(0.3 + flashes[i] * 1.3 + wave * 0.35);
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, KEY_COLS * KEY_ROWS]} material={material}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

function LaptopContent({ labels, password }: { labels: LaptopLabels; password: string }) {
  const viewport = useThree((state) => state.viewport);
  const rootRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);
  const unlockedAt = useRef(-1);
  const paintClock = useRef(0);
  const painter = useMemo(() => createPainter(labels, password), [labels, password]);
  const texture = useMemo(() => {
    const canvasTexture = new CanvasTexture(painter.canvas);
    canvasTexture.colorSpace = SRGBColorSpace;
    canvasTexture.anisotropy = 4;
    return canvasTexture;
  }, [painter]);

  useEffect(() => () => texture.dispose(), [texture]);

  const narrow = viewport.aspect < 1.15;
  const scale = narrow ? Math.min(0.72, viewport.width / 6.2) : Math.min(0.95, viewport.width / 8, viewport.height / 6.4);
  const offsetY = narrow ? -0.1 : 0.2;

  useFrame((state, delta) => {
    const root = rootRef.current;
    const lid = lidRef.current;
    if (!root || !lid) return;
    const t = state.clock.elapsedTime;
    const { progress, unlocked } = introStore.get();

    lid.rotation.x = MathUtils.lerp(CLOSED, OPEN, MathUtils.smootherstep(t, 0.4, 2.0));
    root.rotation.y = MathUtils.damp(root.rotation.y, state.pointer.x * 0.22, 3, delta);
    root.rotation.x = MathUtils.damp(root.rotation.x, 0.12 - state.pointer.y * 0.05, 3, delta);
    root.position.y = offsetY + Math.sin(t * 1.1) * 0.04;
    root.position.x = !unlocked && progress > 0.05 ? Math.sin(t * 50) * 0.008 * progress : 0;

    if (unlocked && unlockedAt.current < 0) unlockedAt.current = t;
    paintClock.current += delta;
    if (paintClock.current > 1 / 30) {
      painter.draw(
        {
          power: MathUtils.smoothstep(t, 1.5, 2.3),
          progress,
          unlocked,
          unlockedFor: unlockedAt.current < 0 ? 0 : t - unlockedAt.current,
        },
        paintClock.current,
      );
      texture.needsUpdate = true;
      paintClock.current = 0;
    }
  });

  const hit = () => {
    if (!introStore.get().unlocked && performance.now() > 2400) introStore.hit(0.03);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <pointLight position={[0, 1.4, 1.6]} intensity={8} color={PURPLE} />
      <pointLight position={[-3, -1, 2]} intensity={4} color={RED} />

      <group ref={rootRef} scale={scale} position={[0, offsetY, 0]}>
        <group
          position={[0, -1.35, 0.6]}
          onClick={(event) => {
            event.stopPropagation();
            hit();
          }}
          onPointerOver={() => {
            if (!introStore.get().unlocked) document.body.style.cursor = 'crosshair';
          }}
          onPointerOut={() => {
            document.body.style.cursor = '';
          }}
        >
          <RoundedBox args={[W, T, D]} radius={0.06} smoothness={3}>
            <meshStandardMaterial color="#17171b" metalness={0.75} roughness={0.32} />
          </RoundedBox>
          <mesh position={[0, T / 2 + 0.002, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W * 0.9, 1.55]} />
            <meshStandardMaterial color="#070708" roughness={0.8} />
          </mesh>
          <Keyboard />
          <mesh position={[0, T / 2 + 0.004, 0.95]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 0.85]} />
            <meshStandardMaterial color="#1f1f25" metalness={0.5} roughness={0.4} />
          </mesh>

          <group position={[0, T / 2, -D / 2 + 0.02]}>
            <group ref={lidRef} rotation={[CLOSED, 0, 0]}>
              <group position={[0, H / 2, -LID / 2]}>
                <RoundedBox args={[W, H, LID]} radius={0.05} smoothness={3}>
                  <meshStandardMaterial color="#17171b" metalness={0.75} roughness={0.32} />
                </RoundedBox>
                <mesh position={[0, 0, LID / 2 + 0.002]}>
                  <planeGeometry args={[W - 0.08, H - 0.08]} />
                  <meshBasicMaterial color="#020203" />
                </mesh>
                <mesh position={[0, 0.04, LID / 2 + 0.004]}>
                  <planeGeometry args={[W * 0.92, H * 0.86]} />
                  <meshBasicMaterial map={texture} toneMapped={false} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

export default function LaptopCanvas({
  className,
  fallback,
  labels,
  password,
}: {
  className?: string;
  fallback?: ReactNode;
  labels: LaptopLabels;
  password: string;
}) {
  return (
    <LazyCanvas eager className={className} fallback={fallback} camera={{ position: [0, 1.6, 9.5], fov: 35 }}>
      <LaptopContent labels={labels} password={password} />
    </LazyCanvas>
  );
}
