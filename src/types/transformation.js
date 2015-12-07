import * as Vector from './vector.js';

export const create = function Transformation(offset, angle, skew, scale) {
  return {
    offset: offset || Vector.create(),
    angle: angle || 0,
    skew: skew || 0,
    scale: scale || Vector.create(1)
  };
}
