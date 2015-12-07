import { insertSorted } from '../utils.js';

import * as Keyframe from './keyframe.js';


export const create = function Canvas() {
  return {
    keyframes: [],
    metadata: {},
    valueNodes: {},
    canvases: {}
  };
};


export function addKeyframe(canvas, keyframe) {
  insertSorted(canvas.keyframes, keyframe, Keyframe.comesAfter);
}

export function addValueNode(canvas, node, id) {
  canvas.valueNodes[id] = node;
}

export function childCanvas(canvas, id) {
  return canvas.canvases[id] = create();
}

export function getRoot(canvas) {
  while(canvas.parent) {
    canvas = canvas.parent;
  }
  return canvas;
}
