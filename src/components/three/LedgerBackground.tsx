'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, MathUtils, ShaderMaterial } from 'three';

// Fundo fixo do site inteiro: poeira de dados que anda com a rolagem
const POINTS = 600;
const SPAN = 40;

const pointsVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uScroll;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uScroll + ${SPAN / 2}.0, ${SPAN}.0) - ${SPAN / 2}.0;
    p.x += sin(uTime * 0.15 + aSeed * 6.28) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.5 + aSeed * 2.5) * uPixelRatio * (10.0 / -mv.z);
    vAlpha = 0.25 + 0.75 * abs(sin(uTime * 0.6 + aSeed * 40.0));
    vColor = aSeed > 0.9 ? vec3(1.0, 0.23, 0.28) : (aSeed > 0.55 ? vec3(0.55, 0.36, 0.96) : vec3(0.45, 0.45, 0.5));
    gl_Position = projectionMatrix * mv;
  }
`;

const pointsFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha * 0.4);
  }
`;

function DataDust() {
  const dpr = useThree((state) => state.viewport.dpr);
  const scroll = useRef(0);
  const geometry = useMemo(() => {
    const positions = new Float32Array(POINTS * 3);
    const seeds = new Float32Array(POINTS);
    for (let i = 0; i < POINTS; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPAN;
      positions[i * 3 + 2] = -Math.random() * 18 + 2;
      seeds[i] = Math.random();
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    return geo;
  }, []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uScroll: { value: 0 }, uTime: { value: 0 }, uPixelRatio: { value: 1 } },
      }),
    [],
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state, delta) => {
    scroll.current = MathUtils.damp(scroll.current, window.scrollY * 0.006, 4, delta);
    material.uniforms.uScroll.value = scroll.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = dpr;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export default function LedgerBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas flat dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: false, alpha: true }}>
        <DataDust />
      </Canvas>
    </div>
  );
}
