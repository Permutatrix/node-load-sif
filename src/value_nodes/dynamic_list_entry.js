import * as Activepoint from '../types/activepoint.js';
import { insertSorted } from '../utils.js';


export function create(valueNode, timingInfo) {
  return {
    valueNode: valueNode,
    timingInfo: timingInfo || []
  };
}


export function addActivepoint(entry, activepoint) {
  insertSorted(entry.timingInfo, activepoint, Activepoint.comesAfter);
}

export function addNewActivepoint(entry, time, state, priority) {
  addActivepoint(entry, Activepoint.create(time, state, priority));
}
