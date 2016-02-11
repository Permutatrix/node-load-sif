import { invertObject } from '../utils.js';


const layers = {};

function register(name, factory, mapping) {
  const layer = {
    factory: factory,
    mapping: invertObject(mapping)
  };
  if(typeof name === 'string') {
    layers[name] = layer;
  } else {
    for(let i = 0, len = name.length; i < len; ++i) {
      layers[name[i]] = layer;
    }
  }
  return layer;
}


export function parseLayer(pulley, context) {
  throw Error("Not implemented");
}
