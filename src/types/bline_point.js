import * as Vector from './vector.js';

export const create = function BLinePoint(vertex, tangent1, tangent2, width, origin, splitr, splita) {
  return {
    vertex: vertex || Vector.create(),
    tangent1: tangent1 || Vector.create(),
    tangent2: tangent2 || Vector.create(),
    width: width === undefined ? 1 : width,
    origin: origin === undefined ? 0.5 : origin,
    splitr: splitr === undefined ? true : splitr,
    splita: !!splita
  };
}
