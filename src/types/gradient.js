import * as Stop from './gradient_stop.js';
export { Stop };
import { insertSorted } from '../utils.js';


export function threeColor(c1, c2, c3) {
  return { stops: [ Stop.create(0, c1), Stop.create(0.5, c2), Stop.create(1, c3) ] };
}

export function twoColor(c1, c2) {
  return { stops: [ Stop.create(0, c1), Stop.create(1, c2) ] };
}

export function oneColor(color) {
  return { stops: [ Stop.create(0, color) ] };
}

export function empty() {
  return { stops: [] };
}


export function addStop(gradient, stop) {
  insertSorted(gradient.stops, stop, Stop.comesAfter);
}

export function addNewStop(gradient, position, color) {
  addStop(gradient, Stop.create(position, color));
}
