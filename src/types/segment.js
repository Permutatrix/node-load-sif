import * as Vector from './vector.js';


export function create(point1, tangent1, point2, tangent2) {
  return { point1: point1, tangent1: tangent1, point2: point2, tangent2: tangent2 };
}

export function line(point1, point2) {
  tangent1 = Vector.subtract(point2, point1);
  tangent2 = Vector.clone(tangent1);
  return {
    point1: point1,
    point2: point2,
    tangent1: Vector.subtract(point2, point1),
    tangent2: Vector.clone(tangent1)
  }
}

export function zero() {
  return {
    point1: Vector.zero(),
    point2: Vector.zero(),
    tangent1: Vector.zero(),
    tangent2: Vector.zero()
  };
}
