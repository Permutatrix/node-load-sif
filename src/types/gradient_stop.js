import * as Color from './color.js';

export const create = function GradientStop(pos, color) {
  return { pos: pos || 0, color: color || Color.black() };
}


export function comesAfter(a, b) {
  return a.pos > b.pos;
}
