import { insertSorted } from '../utils.js';

import * as Keyframe from './keyframe.js';


export const create = function Canvas() {
  return {
    keyframes: []
  };
};


export function addKeyframe(canvas, keyframe) {
  insertSorted(canvas.keyframes, keyframe, Keyframe.comesAfter);
}
