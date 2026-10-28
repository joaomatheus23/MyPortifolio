'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Color, Group, InstancedMesh, MathUtils, Mesh, Object3D } from 'three';
import { createBlockMaterial } from './blockMaterial';
import LazyCanvas from './LazyCanvas';

// Seção Experiência: um ativo (cubo) se divide em 64 frações que viram tokens
// orbitando a ledger e depois voltam a formar o ativo. Loop de 8 segundos.
export type TokenPhase = 'asset' | 'split' | 'tokens';

const SIDE = 4;
const COUNT = SIDE * SIDE * SIDE;
const LOOP = 8;
const PURPLE = new Color('#8b5cf6');
const RED = new Color('#ff3b47');

function TokenContent({ onPhase }: { onPhase: (phase: TokenPhase) => void }) {
  const meshRef = useRef<InstancedMesh>(null);
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const phaseRef = useRef<TokenPhase>('asset');
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const material = useMemo(() => createBlockMaterial({ base: '#0b0b0e', edgeWidth: 0.09 }), []);
  const cells = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, index) => ({
        x: (index % SIDE) - (SIDE - 1) / 2,
        y: (Math.floor(index / SIDE) % SIDE) - (SIDE - 1) / 2,
        z: Math.floor(index / (SIDE * SIDE)) - (SIDE - 1) / 2,
        lane: index % 4,
        offset: Math.random() * 0.4,
      })),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;
    const t = state.clock.elapsedTime;
    const u = t % LOOP;
    const explode = MathUtils.smoothstep(u, 1.2, 2.2) * (1 - MathUtils.smoothstep(u, 6.6, 7.6));
    const orbit = MathUtils.smoothstep(u, 2.4, 3.6) * (1 - MathUtils.smoothstep(u, 5.4, 6.6));

    const phase: TokenPhase = orbit > 0.5 ? 'tokens' : explode > 0.3 ? 'split' : 'asset';
    if (phase !== phaseRef.current) {
      phaseRef.current = phase;
      onPhase(phase);
    }

    group.rotation.y += delta * (0.25 + orbit * 0.2);
    group.rotation.x = MathUtils.damp(group.rotation.x, 0.35 - state.pointer.y * 0.15, 3, delta);

    cells.forEach((cell, index) => {
      const spread = 0.34 * (1 + explode * 0.9);
      const gx = cell.x * spread;
      const gy = cell.y * spread;
      const gz = cell.z * spread;
      const angle = (index / COUNT) * Math.PI * 2 + t * 0.6;
      const radius = 1.85 + cell.lane * 0.14;
      const rx = Math.cos(angle) * radius;
      const rz = Math.sin(angle) * radius;
      const ry = Math.sin(angle * 3 + cell.offset * 10) * 0.18 + (cell.lane - 1.5) * 0.1;
      dummy.position.set(
        MathUtils.lerp(gx, rx, orbit),
        MathUtils.lerp(gy, ry, orbit),
        MathUtils.lerp(gz, rz, orbit),
      );
      dummy.rotation.set(orbit * 0.2, -angle * orbit + Math.PI / 2 * orbit, 0);
      const s = 0.3 - explode * 0.04;
      dummy.scale.set(s, s, MathUtils.lerp(s, 0.06, orbit));
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      color.copy(PURPLE).lerp(RED, orbit * (index % 3 === 0 ? 1 : 0.35)).multiplyScalar(0.8 + explode * 0.5);
      mesh.setColorAt(index, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    if (coreRef.current) {
      coreRef.current.scale.setScalar(Math.max(0.001, orbit));
      coreRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} material={material} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <mesh ref={coreRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 8, 64]} />
        <meshBasicMaterial color="#ff3b47" toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function TokenCanvas({ className, onPhase }: { className?: string; onPhase: (phase: TokenPhase) => void }) {
  return (
    <LazyCanvas className={className} camera={{ position: [0, 1.2, 5.6], fov: 40 }}>
      <TokenContent onPhase={onPhase} />
    </LazyCanvas>
  );
}
