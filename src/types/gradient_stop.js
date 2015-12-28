import * as Color from './color.js';

export function create(position, color) {
  return { position: position || 0, color: color || Color.black() };
}


export function comesAfter(a, b) {
  return a.position > b.position;
}
