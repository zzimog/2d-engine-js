export function floor(value: number, min: number) {
  return Math.max(value, min);
}

export function ceil(value: number, max: number) {
  return Math.min(value, max);
}

export function clamp(value: number, min: number, max: number) {
  return floor(ceil(value, max), min);
}
