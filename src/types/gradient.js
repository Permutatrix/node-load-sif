import * as Stop from './gradient_stop.js';
export { Stop };
import { insertSorted } from '../utils.js';

export function threeColor(c1, c2, c3) {
  return [ Stop.create(0, c1), Stop.create(0.5, c2), Stop.create(1, c3) ];
}
export function twoColor(c1, c2) {
  return [ Stop.create(0, c1), Stop.create(1, c2) ];
}
export function oneColor(color) {
  return [ Stop.create(0, color) ];
}
export function empty() {
  return [];
}


export function addStop(gradient, stop, color) {
  if(color) {
    stop = Stop.create(stop, color);
  }
  insertSorted(gradient, stop, Stop.comesAfter);
}
