export function floor(value: number, min: number) {
  return Math.max(value, min);
}

export function ceil(value: number, max: number) {
  return Math.min(value, max);
}

export function clamp(value: number, min: number, max: number) {
  return floor(ceil(value, max), min);
}

export function rand(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function flipCoin(head: number, cross: number) {
  return Math.random() < 0.5 ? head : cross;
}
