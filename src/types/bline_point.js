import * as Vector from './vector.js';


export function create(vertex, tangent1, tangent2, width, origin, splitRadius, splitAngle) {
  return {
    vertex: vertex || Vector.zero(),
    tangent1: tangent1 || Vector.zero(),
    tangent2: tangent2 || Vector.zero(),
    width: width === undefined ? 1 : width,
    origin: origin === undefined ? 0.5 : origin,
    splitRadius: splitRadius === undefined ? true : splitRadius,
    splitAngle: !!splitAngle
  };
}
