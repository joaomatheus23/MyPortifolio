'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import {
  AdditiveBlending,
  Color,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  MathUtils,
  Object3D,
  ShaderMaterial,
  Vector3,
  Vector4,
} from 'three';
import LazyCanvas from './LazyCanvas';

// Seção Cyber: um escudo protegendo o centro (onde fica a tentativa de quebra de senha em HTML).
// Pacotes vermelhos (maliciosos) batem no escudo e geram uma onda; os roxos (legítimos) passam.
export type ShieldStats = { blocked: number; allowed: number };

const PACKETS = 34;
const SHIELD_RADIUS = 1.7;
const HITS = 8;

const shieldVertex = /* glsl */ `
  varying vec3 vObjNormal;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vObjNormal = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const shieldFragment = /* glsl */ `
  uniform vec4 uHits[${HITS}];
  uniform float uTime;
  varying vec3 vObjNormal;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.4);
    vec3 col = vec3(0.55, 0.36, 0.96) * fres * 0.9;
    float alpha = fres * 0.5 + 0.03;
    for (int i = 0; i < ${HITS}; i++) {
      float age = uTime - uHits[i].w;
      if (age < 0.0 || age > 1.3) continue;
      float ang = acos(clamp(dot(vObjNormal, uHits[i].xyz), -1.0, 1.0));
      float fade = 1.0 - age / 1.3;
      float ring = smoothstep(0.14, 0.0, abs(ang - age * 1.5)) * fade;
      float spot = smoothstep(0.45, 0.0, ang) * max(0.0, 1.0 - age / 0.4);
      col += vec3(1.0, 0.23, 0.28) * (ring * 1.5 + spot * 1.2);
      alpha += ring * 0.7 + spot * 0.6;
    }
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

function ShieldContent({ stats }: { stats: MutableRefObject<ShieldStats> }) {
  const packetsRef = useRef<InstancedMesh>(null);
  const ringsRef = useRef<Group>(null);
  const hitIndex = useRef(0);
  const dummy = useMemo(() => new Object3D(), []);
  const red = useMemo(() => new Color('#ff3b47'), []);
  const purple = useMemo(() => new Color('#a78bfa'), []);
  const shieldGeometry = useMemo(() => new IcosahedronGeometry(SHIELD_RADIUS, 5), []);
  const shieldMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: shieldVertex,
        fragmentShader: shieldFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uHits: { value: Array.from({ length: HITS }, () => new Vector4(0, 0, 1, -10)) },
        },
      }),
    [],
  );
  const packets = useMemo(
    () =>
      Array.from({ length: PACKETS }, () => ({
        dir: new Vector3(),
        dist: 0,
        speed: 0,
        bad: false,
        wait: Math.random() * 3,
      })),
    [],
  );

  useEffect(() => () => {
    shieldGeometry.dispose();
    shieldMaterial.dispose();
  }, [shieldGeometry, shieldMaterial]);

  const spawn = (packet: (typeof packets)[number], index: number) => {
    packet.dir.set(Math.random() * 2 - 1, (Math.random() * 2 - 1) * 0.7, Math.random() * 1.4 - 0.3).normalize();
    packet.dist = 5.5 + Math.random() * 1.5;
    packet.speed = 1.6 + Math.random() * 1.2;
    packet.bad = Math.random() < 0.55;
    packetsRef.current?.setColorAt(index, packet.bad ? red : purple);
    if (packetsRef.current?.instanceColor) packetsRef.current.instanceColor.needsUpdate = true;
  };

  useFrame((state, delta) => {
    const mesh = packetsRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    shieldMaterial.uniforms.uTime.value = t;

    packets.forEach((packet, index) => {
      if (packet.wait > 0) {
        packet.wait -= delta;
        if (packet.wait <= 0) spawn(packet, index);
        dummy.scale.setScalar(0);
      } else {
        packet.dist -= packet.speed * delta;
        if (packet.bad && packet.dist <= SHIELD_RADIUS) {
          const hit = shieldMaterial.uniforms.uHits.value[hitIndex.current % HITS] as Vector4;
          hit.set(packet.dir.x, packet.dir.y, packet.dir.z, t);
          hitIndex.current += 1;
          stats.current.blocked += 1;
          packet.wait = 0.3 + Math.random() * 1.6;
        } else if (!packet.bad && packet.dist <= 0.45) {
          stats.current.allowed += 1;
          packet.wait = 0.3 + Math.random() * 1.6;
        }
        dummy.position.copy(packet.dir).multiplyScalar(packet.dist);
        dummy.rotation.set(t * 3 + index, t * 2, 0);
        dummy.scale.setScalar(packet.wait > 0 ? 0 : 0.085);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;

    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * 0.25;
      ringsRef.current.rotation.z = Math.sin(t * 0.4) * 0.2;
    }
    state.camera.position.x = MathUtils.damp(state.camera.position.x, state.pointer.x * 0.6, 2, delta);
    state.camera.position.y = MathUtils.damp(state.camera.position.y, 0.4 + state.pointer.y * 0.4, 2, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 4]} intensity={20} color="#a78bfa" />
      <mesh geometry={shieldGeometry} material={shieldMaterial} />
      <mesh>
        <icosahedronGeometry args={[SHIELD_RADIUS * 1.002, 2]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.07} />
      </mesh>
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.25, 0.006, 6, 160]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, 0.5, 0]}>
          <torusGeometry args={[2.5, 0.004, 6, 160]} />
          <meshBasicMaterial color="#ff3b47" transparent opacity={0.25} />
        </mesh>
      </group>
      <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKETS]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

export default function ShieldCanvas({ className, stats }: { className?: string; stats: MutableRefObject<ShieldStats> }) {
  return (
    <LazyCanvas className={className} camera={{ position: [0, 0.4, 6.2], fov: 40 }}>
      <ShieldContent stats={stats} />
    </LazyCanvas>
  );
}
