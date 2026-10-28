import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three';

// Material dos "blocos": vidro escuro com arestas neon e brilho de borda (fresnel).
// Funciona em mesh normal (usa uTint) e em InstancedMesh com instanceColor.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vTint;
  uniform vec3 uTint;

  void main() {
    vUv = uv;
    vec4 local = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      local = instanceMatrix * local;
      n = mat3(instanceMatrix) * n;
    #endif
    #ifdef USE_INSTANCING_COLOR
      vTint = instanceColor;
    #else
      vTint = uTint;
    #endif
    vec4 mv = modelViewMatrix * local;
    vView = -mv.xyz;
    vNormal = normalize(normalMatrix * n);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vTint;
  uniform vec3 uBase;
  uniform float uEdgeWidth;
  uniform float uOpacity;
  uniform float uGlow;

  void main() {
    vec2 d = min(vUv, 1.0 - vUv);
    float edgeDist = min(d.x, d.y);
    float edge = 1.0 - smoothstep(0.0, uEdgeWidth, edgeDist);
    float inner = 1.0 - smoothstep(uEdgeWidth * 1.6, uEdgeWidth * 2.2, edgeDist);
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.2);
    float light = 0.35 + 0.65 * clamp(dot(n, normalize(vec3(0.35, 0.8, 0.55))), 0.0, 1.0);
    vec3 col = uBase * light;
    col += vTint * (edge * 1.25 + inner * 0.12 + fres * 0.4) * uGlow;
    float alpha = uOpacity * max(0.55, edge + fres * 0.6 + 0.55);
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

type BlockMaterialOptions = {
  tint?: string;
  base?: string;
  edgeWidth?: number;
  opacity?: number;
  glow?: number;
  transparent?: boolean;
  additive?: boolean;
};

export function createBlockMaterial({
  tint = '#8b5cf6',
  base = '#07111c',
  edgeWidth = 0.07,
  opacity = 1,
  glow = 1,
  transparent = false,
  additive = false,
}: BlockMaterialOptions = {}) {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: transparent || opacity < 1,
    depthWrite: !additive,
    ...(additive ? { blending: AdditiveBlending } : {}),
    side: DoubleSide,
    toneMapped: false,
    uniforms: {
      uTint: { value: new Color(tint) },
      uBase: { value: new Color(base) },
      uEdgeWidth: { value: edgeWidth },
      uOpacity: { value: opacity },
      uGlow: { value: glow },
    },
  });
}
