const W = 64;
const H = 28;

function band(d: number, at: number, width: number): number {
  return Math.max(0, 1 - Math.abs(d - at) / width);
}

function cell(x: number, y: number): number {
  const d = Math.hypot(x, y);
  const a = Math.atan2(y, x);
  const lean = (Math.cos(a + 2.36) + 1) / 2;
  const ring = band(d, 0.9, 0.06 + 0.1 * lean);
  const dd = Math.hypot(x - 0.04, y - 0.1);
  const disc = dd < 0.58 ? 1 - Math.max(0, (dd - 0.46) / 0.12) : 0;
  const arc = band(d, 0.7, 0.06) * Math.max(0, lean * 1.8 - 0.7);
  return Math.min(1, Math.max(ring, disc, arc));
}

export const MARK = Array.from({ length: H }, (_, r) => {
  const y = (r - H / 2 + 0.5) / (H / 2);
  return Array.from({ length: W }, (_, c) => {
    const x = (c - W / 2 + 0.5) / (W / 2);
    const v = cell(x, y);
    if (v < 0.2) return " ";
    if (v < 0.5) return "+";
    return v > 0.8 && x + y < 0.35 ? "@" : "0";
  })
    .join("")
    .trimEnd();
}).join("\n");
