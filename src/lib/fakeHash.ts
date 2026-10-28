// Gera um "hash" hexadecimal determinístico só para efeito visual
export function fakeHash(seed: string, length = 64) {
  let h1 = 0x811c9dc5;
  let out = '';
  for (let i = 0; out.length < length; i++) {
    const code = seed.charCodeAt(i % Math.max(1, seed.length)) || 31;
    h1 ^= code + i * 131;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    out += (h1 >>> 0).toString(16).padStart(8, '0').slice(0, 4);
  }
  return out.slice(0, length);
}
