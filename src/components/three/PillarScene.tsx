'use client';

import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Group, MathUtils } from 'three';
import { createBlockMaterial } from './blockMaterial';
import LazyCanvas from './LazyCanvas';

// Seção Sobre: um objeto 3D para cada pilar (blockchain, fintechs, cibersegurança).
// O pilar ativo cresce girando; os outros encolhem.
function Slot({ on, children }: { on: boolean; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    const s = MathUtils.damp(group.scale.x, on ? 1 : 0.001, 5, delta);
    group.scale.setScalar(s);
    group.rotation.y += delta * (on ? 0.5 : 2);
    group.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    group.visible = s > 0.01;
  });
  return <group ref={ref} scale={0.001}>{children}</group>;
}

function ChainOfBlocks() {
  const material = useMemo(() => createBlockMaterial({ tint: '#8b5cf6', base: '#0d0b14', edgeWidth: 0.06 }), []);
  const accent = useMemo(() => createBlockMaterial({ tint: '#ff3b47', base: '#140b0d', edgeWidth: 0.06 }), []);
  useEffect(() => () => {
    material.dispose();
    accent.dispose();
  }, [material, accent]);
  return (
    <group rotation={[0.35, 0, 0.25]}>
      {[-1.15, 0, 1.15].map((x, index) => (
        <mesh key={x} position={[x, 0, 0]} material={index === 1 ? accent : material}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
        </mesh>
      ))}
      {[-0.58, 0.58].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshBasicMaterial color="#a78bfa" />
        </mesh>
      ))}
    </group>
  );
}

function Coin() {
  return (
    <group rotation={[Math.PI / 2.4, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[1, 1, 0.16, 64]} />
        <meshStandardMaterial color="#2a1f45" metalness={0.85} roughness={0.25} emissive="#8b5cf6" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.035, 12, 64]} />
        <meshBasicMaterial color="#a78bfa" />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 12, 6]} />
        <meshBasicMaterial color="#ff3b47" />
      </mesh>
    </group>
  );
}

function Padlock() {
  return (
    <group position={[0, -0.25, 0]}>
      <RoundedBox args={[1.5, 1.15, 0.5]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#1a1a20" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.48, 0.1, 16, 40, Math.PI]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.05, 0.26]}>
        <circleGeometry args={[0.13, 24]} />
        <meshBasicMaterial color="#ff3b47" toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.18, 0.26]}>
        <planeGeometry args={[0.08, 0.3]} />
        <meshBasicMaterial color="#ff3b47" toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function PillarCanvas({ className, active }: { className?: string; active: number }) {
  return (
    <LazyCanvas className={className} camera={{ position: [0, 0.3, 5], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[2.5, 2.5, 3]} intensity={18} color="#a78bfa" />
      <pointLight position={[-3, -1, 2]} intensity={8} color="#ff3b47" />
      <Slot on={active === 0}>
        <ChainOfBlocks />
      </Slot>
      <Slot on={active === 1}>
        <Coin />
      </Slot>
      <Slot on={active === 2}>
        <Padlock />
      </Slot>
    </LazyCanvas>
  );
}
