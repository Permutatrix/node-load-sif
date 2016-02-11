import { insertSorted } from '../utils.js';

import * as Keyframe from './keyframe.js';


export function create() {
  return {
    keyframes: [],
    metadata: {},
    valueNodes: {},
    canvases: {},
    inline: false
  };
}

export function inline() {
  return {
    inline: true
  };
}


export function addKeyframe(canvas, keyframe) {
  insertSorted(getNonInline(canvas).keyframes, keyframe, Keyframe.comesAfter);
}

export function addValueNode(canvas, node, id) {
  getNonInline(canvas).valueNodes[id] = node;
}

export function findValueNode(canvas, id) {
  if(!canvas || !id) return;
  canvas = getNonInline(canvas);
  
  if(id.indexOf(':') === -1 && id.indexOf('#') === -1) {
    return canvas.valueNodes[id];
  }
  
  const sep = id.lastIndexOf(':');
  const canvasID = id.substr(0, sep) || ':', nodeID = id.substr(sep + 1);
  canvas = findCanvas(canvas, canvasID);
  
  return canvas && canvas.valueNodes[id];
}

export function childCanvas(canvas, id) {
  return getNonInline(canvas).canvases[id] = create();
}

export function getRoot(canvas) {
  while(canvas.parent) {
    canvas = canvas.parent;
  }
  return canvas;
}

export function getNonInline(canvas) {
  while(canvas.inline) {
    canvas = canvas.parent;
  }
  return canvas;
}

export function findCanvas(canvas, id) {
  throw Error("Not implemented");
}

export function addLayer(canvas, layer) {
  throw Error("Not implemented");
}
