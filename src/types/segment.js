import * as Vector from './vector.js';

export const create = function Segment(p1, t1, p2, t2) {
  if(p1 === undefined) {
    p1 = Vector.create(); t1 = Vector.create();
    p2 = Vector.create(); t2 = Vector.create();
  } else if(p2 === undefined) {
    p2 = t1;
    t1 = Vector.subtract(p2, p1);
    t2 = Vector.clone(t1);
  }
  return { p1, t1, p2, t2 };
}
