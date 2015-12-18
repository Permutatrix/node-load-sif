import * as Vector from './vector.js';

export const create = function Segment(p1, t1, p2, t2) {
  return { p1: p1, t1: t1, p2: p2, t2: t2 };
}
export function line(p1, p2) {
  t1 = Vector.subtract(p2, p1);
  t2 = Vector.clone(t1);
  return {
    p1: p1,
    p2: p2,
    t1: Vector.subtract(p2, p1),
    t2: Vector.clone(t1)
  }
}
export function zero() {
  return {
    p1: Vector.zero(),
    p2: Vector.zero(),
    t1: Vector.zero(),
    t2: Vector.zero()
  };
}
