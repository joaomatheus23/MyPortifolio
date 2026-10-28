'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ComponentType, type MutableRefObject } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, MathUtils, Quaternion, Vector3 } from 'three';
import LazyCanvas from './LazyCanvas';

// Seção Skills: cada tecnologia é um nó de uma rede P2P com o logo dela. As ligações e os
// pacotes são 3D; os logos são HTML posicionados pela projeção de cada nó, para ficarem nítidos.
export type NetworkNode = {
  name: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
  iconClass?: string;
};

const RADIUS = 2.2;
const PULSES = 14;

function fibonacciSphere(count: number) {
  const points: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    points.push(new Vector3(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r).multiplyScalar(RADIUS));
  }
  return points;
}

type NetworkProps = { nodes: NetworkNode[]; active: number; onSelect: (index: number) => void };

function NetworkContent({ nodes, active, nodeRefs }: NetworkProps & { nodeRefs: MutableRefObject<(HTMLButtonElement | null)[]> }) {
  const groupRef = useRef<Group>(null);
  const positions = useMemo(() => fibonacciSphere(nodes.length), [nodes.length]);
  const edges = useMemo(() => {
    const list: [number, number][] = [];
    positions.forEach((point, i) => {
      positions
        .map((other, j) => ({ j, d: point.distanceTo(other) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          if (!list.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) list.push([i, j]);
        });
    });
    return list;
  }, [positions]);
  const lineGeometry = useMemo(() => {
    const array = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], index) => {
      positions[a].toArray(array, index * 6);
      positions[b].toArray(array, index * 6 + 3);
    });
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(array, 3));
    return geometry;
  }, [edges, positions]);
  const pulses = useMemo(
    () => Array.from({ length: PULSES }, () => ({ edge: Math.floor(Math.random() * edges.length), t: Math.random(), speed: 0.3 + Math.random() * 0.5 })),
    [edges.length],
  );
  const pulseGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(PULSES * 3), 3));
    return geometry;
  }, []);
  const targetQuat = useMemo(() => new Quaternion(), []);
  const front = useMemo(() => new Vector3(0, 0.15, 1).normalize(), []);
  const world = useMemo(() => new Vector3(), []);
  const point = useMemo(() => new Vector3(), []);

  useEffect(() => () => {
    lineGeometry.dispose();
    pulseGeometry.dispose();
  }, [lineGeometry, pulseGeometry]);

  useEffect(() => {
    const direction = positions[active]?.clone().normalize();
    if (direction) targetQuat.setFromUnitVectors(direction, front);
  }, [active, positions, targetQuat, front]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.quaternion.slerp(targetQuat, 1 - Math.exp(-delta * 2.5));
    group.updateMatrixWorld();

    const attribute = pulseGeometry.getAttribute('position') as BufferAttribute;
    pulses.forEach((pulse, index) => {
      pulse.t += delta * pulse.speed;
      if (pulse.t > 1) {
        pulse.t = 0;
        pulse.edge = Math.floor(Math.random() * edges.length);
      }
      const [a, b] = edges[pulse.edge] ?? [0, 0];
      point.lerpVectors(positions[a], positions[b], pulse.t);
      attribute.setXYZ(index, point.x, point.y, point.z);
    });
    attribute.needsUpdate = true;

    // Cada logo segue a posição do seu nó; os de trás ficam menores e mais apagados
    positions.forEach((position, index) => {
      const node = nodeRefs.current[index];
      if (!node) return;
      world.copy(position).applyMatrix4(group.matrixWorld);
      const depth = MathUtils.clamp((world.z / RADIUS + 1) / 2, 0, 1);
      world.project(state.camera);
      const x = ((world.x + 1) / 2) * state.size.width;
      const y = ((1 - world.y) / 2) * state.size.height;
      const on = index === active;
      const scale = (0.62 + depth * 0.5) * (on ? 1.3 : 1);
      node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
      node.style.opacity = String(on ? 1 : 0.25 + depth * 0.75);
      node.style.zIndex = String(on ? 100 : Math.round(depth * 50));
    });
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.28} />
      </lineSegments>
      <points geometry={pulseGeometry}>
        <pointsMaterial color="#ff3b47" size={0.09} transparent opacity={0.9} blending={AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}

export default function NetworkCanvas({ className, ...props }: NetworkProps & { className?: string }) {
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={`relative ${className ?? ''}`}>
      <LazyCanvas className="absolute inset-0" camera={{ position: [0, 0, 6.4], fov: 40 }}>
        <NetworkContent {...props} nodeRefs={nodeRefs} />
      </LazyCanvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {props.nodes.map((node, index) => {
          const on = index === props.active;
          return (
            <button
              key={node.name}
              type="button"
              ref={(element) => {
                nodeRefs.current[index] = element;
              }}
              onClick={() => props.onSelect(index)}
              aria-label={node.name}
              aria-pressed={on}
              className="group pointer-events-auto absolute left-0 top-0 flex flex-col items-center opacity-0 will-change-transform"
            >
              <span
                className={`glass-apple flex h-11 w-11 items-center justify-center rounded-full transition-shadow duration-300 ${
                  on ? 'border-accent/80 shadow-[0_0_24px_rgba(255,59,71,0.55)]' : 'group-hover:border-primary/60'
                }`}
                style={on ? undefined : { boxShadow: `0 0 18px ${node.color}33` }}
              >
                <node.icon className={`h-5 w-5 ${node.iconClass ?? ''}`} />
              </span>
              <span
                className={`mt-1 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] transition-opacity ${
                  on ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                }`}
              >
                {node.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
