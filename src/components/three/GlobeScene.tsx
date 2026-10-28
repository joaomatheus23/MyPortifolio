'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import type { Geometry, Position } from 'geojson';
import landTopology from 'world-atlas/land-110m.json';
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  CanvasTexture,
  Group,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  SRGBColorSpace,
  ShaderMaterial,
  Vector3,
} from 'three';
import LazyCanvas from './LazyCanvas';

// Seção Canadá: a Terra (continentes do Natural Earth desenhados numa textura) com a rota
// de Jaú até Toronto sendo traçada, um "avião" correndo pelo arco e as duas cidades pulsando.
const RADIUS = 1.6;
const TEX_W = 2048;
const TEX_H = 1024;
const ARC_POINTS = 120;
// Ciclo da viagem: ~11 s de voo, pouso e uma pausa antes de decolar de novo
const LOOP = 15;
const FLIGHT = 0.74;

export type GlobePlace = { name: string; lat: number; lon: number };

function latLon(lat: number, lon: number, radius = RADIUS) {
  const phi = MathUtils.degToRad(90 - lat);
  const theta = MathUtils.degToRad(lon + 180);
  return new Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}


const toTexture = ([lon, lat]: Position) => [((lon + 180) / 360) * TEX_W, ((90 - lat) / 180) * TEX_H] as const;
const latToY = (lat: number) => (90 - lat) / 180;

function landPolygons() {
  const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>;
  const geometries: Geometry[] = feature(topology, topology.objects.land).features.map((item) => item.geometry);
  return geometries.flatMap((geometry) =>
    geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [],
  );
}

function tracePolygons(ctx: CanvasRenderingContext2D, polygons: Position[][][]) {
  ctx.beginPath();
  polygons.forEach((polygon) =>
    polygon.forEach((ring) =>
      ring.forEach((point, index) => {
        const [x, y] = toTexture(point);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }),
    ),
  );
}

// Desenha a Terra em projeção equiretangular: oceano, continentes com cores por latitude,
// gelo nos polos e linhas de costa suaves
function drawEarth() {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const ocean = ctx.createLinearGradient(0, 0, 0, TEX_H);
  ocean.addColorStop(0, '#0a1a30');
  ocean.addColorStop(0.5, '#12395f');
  ocean.addColorStop(1, '#0a1a30');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  const land = document.createElement('canvas');
  land.width = TEX_W;
  land.height = TEX_H;
  const lctx = land.getContext('2d') as CanvasRenderingContext2D;
  const polygons = landPolygons();
  lctx.fillStyle = '#3f6b3e';
  tracePolygons(lctx, polygons);
  lctx.fill('evenodd');
  lctx.fillRect(0, latToY(-84) * TEX_H, TEX_W, TEX_H);

  lctx.globalCompositeOperation = 'source-atop';
  const bands = lctx.createLinearGradient(0, 0, 0, TEX_H);
  [
    [90, '#f4f7fb'], [72, '#dfe6ee'], [62, '#4a6b45'], [45, '#4f7a3f'], [32, '#9c8556'], [20, '#b39863'],
    [9, '#2f6634'], [-8, '#2f6634'], [-20, '#9a8257'], [-32, '#8b7b52'], [-45, '#4f7a3f'], [-60, '#dce3ea'], [-90, '#f8fafc'],
  ].forEach(([lat, color]) => bands.addColorStop(latToY(lat as number), color as string));
  lctx.globalAlpha = 0.85;
  lctx.fillStyle = bands;
  lctx.fillRect(0, 0, TEX_W, TEX_H);
  lctx.globalAlpha = 1;
  for (let i = 0; i < 26000; i++) {
    lctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.06)';
    lctx.fillRect(Math.random() * TEX_W, Math.random() * TEX_H, 2 + Math.random() * 3, 2);
  }
  ctx.drawImage(land, 0, 0);

  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1.2;
  tracePolygons(ctx, polygons);
  ctx.stroke();
  return canvas;
}

function drawClouds() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * 1024;
    const y = 60 + Math.random() * 392;
    const r = 8 + Math.random() * 26;
    const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
    blob.addColorStop(0, 'rgba(255,255,255,0.32)');
    blob.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = blob;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.4, 1);
    ctx.translate(-x, -y);
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }
  return canvas;
}

const atmosphereMaterial = () =>
  new ShaderMaterial({
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        gl_FragColor = vec4(0.42, 0.62, 1.0, 1.0) * intensity;
      }
    `,
    side: BackSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

function Marker({ position, color }: { position: Vector3; color: string }) {
  const ringRef = useRef<Mesh>(null);
  const normal = useMemo(() => position.clone().normalize(), [position]);
  useEffect(() => {
    ringRef.current?.lookAt(normal.clone().multiplyScalar(10));
  }, [normal]);
  useFrame((state) => {
    const ring = ringRef.current;
    if (!ring) return;
    const pulse = (state.clock.elapsedTime * 0.8) % 1;
    ring.scale.setScalar(1 + pulse * 2.2);
    (ring.material as MeshBasicMaterial).opacity = 1 - pulse;
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.05, 0.065, 32]} />
        <meshBasicMaterial color={color} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function GlobeContent({
  from,
  to,
  labelRefs,
  planeIcon,
}: {
  from: GlobePlace;
  to: GlobePlace;
  labelRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  planeIcon: MutableRefObject<HTMLDivElement | null>;
}) {
  const groupRef = useRef<Group>(null);
  const ahead = useMemo(() => new Vector3(), []);
  const heading = useRef(0);
  const start = useMemo(() => latLon(from.lat, from.lon), [from]);
  const end = useMemo(() => latLon(to.lat, to.lon), [to]);
  const world = useMemo(() => new Vector3(), []);
  const camDir = useMemo(() => new Vector3(), []);
  const wobble = useMemo(() => new Quaternion(), []);
  const upAxis = useMemo(() => new Vector3(0, 1, 0), []);

  const cloudsRef = useRef<Mesh>(null);
  const earth = useMemo(() => {
    const map = new CanvasTexture(drawEarth());
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 4;
    const clouds = new CanvasTexture(drawClouds());
    clouds.colorSpace = SRGBColorSpace;
    return { map, clouds, atmosphere: atmosphereMaterial() };
  }, []);

  // Arco pelo grande círculo, levantado no meio para parecer uma rota de voo
  const arc = useMemo(() => {
    const a = start.clone().normalize();
    const b = end.clone().normalize();
    const points: Vector3[] = [];
    const q = new Quaternion();
    const qa = new Quaternion();
    const qb = new Quaternion().setFromUnitVectors(a, b);
    for (let i = 0; i <= ARC_POINTS; i++) {
      const t = i / ARC_POINTS;
      q.copy(qa).slerp(qb, t);
      points.push(a.clone().applyQuaternion(q).multiplyScalar(RADIUS + Math.sin(Math.PI * t) * 0.55));
    }
    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, new LineBasicMaterial({ color: '#ff3b47', transparent: true, opacity: 0.9, blending: AdditiveBlending }));
    return { points, line };
  }, [start, end]);

  // Gira o globo para deixar o meio da rota de frente para a câmera
  const baseQuat = useMemo(() => {
    const mid = arc.points[Math.floor(ARC_POINTS / 2)].clone().normalize();
    return new Quaternion().setFromUnitVectors(mid, new Vector3(0, 0.25, 1).normalize());
  }, [arc]);

  useEffect(() => () => {
    earth.map.dispose();
    earth.clouds.dispose();
    earth.atmosphere.dispose();
    arc.line.geometry.dispose();
    (arc.line.material as LineBasicMaterial).dispose();
  }, [earth, arc]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    wobble.setFromAxisAngle(upAxis, Math.sin(t * 0.25) * 0.35 + state.pointer.x * 0.25).multiply(baseQuat);
    group.quaternion.slerp(wobble, 1 - Math.exp(-delta * 2));
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.02;

    state.camera.getWorldDirection(camDir);
    const u = (t % LOOP) / LOOP;
    // Decola devagar, cruza em velocidade e desacelera para pousar
    const flight = MathUtils.smootherstep(u, 0, FLIGHT);
    arc.line.geometry.setDrawRange(0, Math.max(2, Math.floor(flight * ARC_POINTS) + 1));
    (arc.line.material as LineBasicMaterial).opacity = u > 0.9 ? ((1 - u) / 0.1) * 0.9 : 0.9;

    // Avião em HTML por cima do canvas: segue o arco, aponta para onde vai e "sobe" no meio do voo
    const icon = planeIcon.current;
    if (icon) {
      const position = flight * ARC_POINTS;
      const index = Math.min(ARC_POINTS - 1, Math.floor(position));
      world.lerpVectors(arc.points[index], arc.points[index + 1], position - index).applyQuaternion(group.quaternion);
      ahead.copy(arc.points[Math.min(ARC_POINTS, index + 3)]).applyQuaternion(group.quaternion);
      const facing = -world.dot(camDir) / RADIUS;
      world.project(state.camera);
      ahead.project(state.camera);
      const x = ((world.x + 1) / 2) * state.size.width;
      const y = ((1 - world.y) / 2) * state.size.height;
      const dx = ((ahead.x + 1) / 2) * state.size.width - x;
      const dy = ((1 - ahead.y) / 2) * state.size.height - y;
      // No fim do arco o ponto à frente coincide com o avião: mantém o último rumo
      if (Math.abs(dx) + Math.abs(dy) > 0.5) heading.current = Math.atan2(dy, dx);
      const angle = heading.current;
      const altitude = Math.sin(Math.PI * flight);
      const landed = u > FLIGHT;
      const scale = landed ? Math.max(0.4, 0.7 - (u - FLIGHT) * 2) : 0.7 + altitude * 0.55;
      icon.style.opacity = u > 0.88 || facing < -0.15 ? '0' : '1';
      icon.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle + Math.PI / 2}rad) scale(${scale})`;
    }

    // Rótulos em HTML: projeta as cidades na tela e esconde quando ficam atrás do globo
    [start, end].forEach((point, index) => {
      const label = labelRefs.current[index];
      if (!label) return;
      world.copy(point).applyQuaternion(group.quaternion);
      const facing = -world.dot(camDir) / RADIUS;
      label.style.opacity = facing > 0.1 ? '1' : '0';
      world.project(state.camera);
      const x = ((world.x + 1) / 2) * state.size.width;
      const y = ((1 - world.y) / 2) * state.size.height;
      label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -170%)`;
    });
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial map={earth.map} roughness={0.85} metalness={0} />
      </mesh>
      <mesh material={earth.atmosphere} scale={1.12}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[RADIUS * 1.012, 48, 48]} />
        <meshStandardMaterial map={earth.clouds} transparent depthWrite={false} roughness={1} />
      </mesh>
      <primitive object={arc.line} />
      <Marker position={start} color="#a78bfa" />
      <Marker position={end} color="#ff3b47" />
    </group>
  );
}

export default function GlobeCanvas({ className, from, to }: { className?: string; from: GlobePlace; to: GlobePlace }) {
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const planeIcon = useRef<HTMLDivElement | null>(null);
  return (
    <div className={`relative ${className ?? ''}`}>
      <LazyCanvas className="absolute inset-0" camera={{ position: [0, 0.4, 5.2], fov: 40 }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[-4, 2.5, 5]} intensity={2.6} />
        <GlobeContent from={from} to={to} labelRefs={labelRefs} planeIcon={planeIcon} />
      </LazyCanvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div ref={planeIcon} className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform">
          <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow-[0_0_10px_rgba(255,59,71,0.85)]">
            <path
              d="M12 2c.8 0 1.3.7 1.3 1.6V9l7.7 4.5v2.1l-7.7-2.4v5.2l2.3 1.8V22L12 21l-3.6 1v-1.8l2.3-1.8v-5.2L3 15.6v-2.1L10.7 9V3.6C10.7 2.7 11.2 2 12 2z"
              fill="#fafafa"
              stroke="#ff3b47"
              strokeWidth="0.6"
            />
          </svg>
        </div>
        {[from, to].map((place, index) => (
          <div
            key={place.name}
            ref={(element) => {
              labelRefs.current[index] = element;
            }}
            className={`absolute left-0 top-0 whitespace-nowrap rounded-full border bg-black/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] opacity-0 transition-opacity ${
              index === 0 ? 'border-secondary/50 text-secondary' : 'border-accent/50 text-accent'
            }`}
          >
            {place.name}
          </div>
        ))}
      </div>
    </div>
  );
}
