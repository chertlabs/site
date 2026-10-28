const W = 60;
const H = 30;
const TILT = 0.36;
const SAMPLES = 4;
const RAMP = " .:-=+*#%@";

function squircle(x: number, y: number, cx: number, cy: number): number {
  const dx = x - cx;
  const dy = y - cy;
  const c = Math.cos(TILT);
  const s = Math.sin(TILT);
  const u = dx * c - dy * s;
  const v = dx * s + dy * c;
  return (Math.abs(u) ** 3.2 + Math.abs(v) ** 3.2) ** (1 / 3.2);
}

function inside(x: number, y: number): boolean {
  if (squircle(x, y, 0, 0) > 0.92) return false;
  const core = squircle(x, y, 0.1, 0.04);
  return core < 0.5 || core > 0.66;
}

export const MARK = Array.from({ length: H }, (_, r) =>
  Array.from({ length: W }, (_, c) => {
    let hits = 0;
    for (let i = 0; i < SAMPLES; i++) {
      for (let j = 0; j < SAMPLES; j++) {
        const x = ((c + (j + 0.5) / SAMPLES) / W) * 2 - 1;
        const y = ((r + (i + 0.5) / SAMPLES) / H) * 2 - 1;
        if (inside(x, y)) hits++;
      }
    }
    return RAMP[Math.round((hits / SAMPLES ** 2) * (RAMP.length - 1))];
  })
    .join("")
    .trimEnd(),
).join("\n");
