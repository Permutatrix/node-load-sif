import * as Vector from './vector.js';

export const create = function Transformation(offset, angle, skew, scale) {
  return {
    offset: offset || Vector.zero(),
    angle: angle || 0,
    skew: skew || 0,
    scale: scale || Vector.zero(1)
  };
};
