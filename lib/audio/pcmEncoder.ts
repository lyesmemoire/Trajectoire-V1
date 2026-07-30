export function float32ToPCM16(float32: _Float32Array): Uint8Array {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32[i] ?? 0));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Uint8Array(buffer);
}
