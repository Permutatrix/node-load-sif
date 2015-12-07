import * as Stop from './gradient_stop.js';
export { Stop };
import { insertSorted } from '../utils.js';

export const create = function Gradient(c1, c2, c3) {
  if(c3) {
    return [ Stop.create(0, c1), Stop.create(0.5, c2), Stop.create(1, c3) ];
  } else if(c2) {
    return [ Stop.create(0, c1), Stop.create(1, c2) ];
  } else if(c1) {
    return [ Stop.create(0, c1) ];
  } else {
    return [];
  }
}


export function addStop(gradient, stop, color) {
  if(color) {
    stop = Stop.create(stop, color);
  }
  insertSorted(gradient, stop, Stop.comesAfter);
}
