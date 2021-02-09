export function round(n: number, precision: number): number {
  return Math.round(n * (10 ** precision)) / (10 ** precision);
}
