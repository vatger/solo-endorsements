function sum(...numbers: number[]): number {
  return numbers.reduce((old, now) => old + now, 0);
}

export default {
  sum,
};
