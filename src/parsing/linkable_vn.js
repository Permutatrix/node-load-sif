import { parseValueNode } from './general.js';
import * as Canvas from '../types/canvas.js';
import * as ValueBase from '../types/value_base.js';
import * as VNConst from '../value_nodes/const.js';
import * as Version from '../version.js';

const linkableValueNodes = {};

function register(name, factory, mapping) {
  const m = {}, node = linkableValueNodes[name] = { factory: factory, mapping: m };
  for(let key in mapping) {
    const v = mapping[key];
    if(typeof v === 'string') {
      m[v] = key;
    } else {
      for(let i = 0, len = v.length; i < len; ++i) {
        m[v[i]] = key;
      }
    }
  }
  return node;
}


export function parseLinkableValueNode(pulley, context) {
  const tag = pulley.check('opentag'), attrs = tag.attributes;
  if(!Object.hasOwnProperty.call(linkableValueNodes, tag.name)) {
    return;
  }
  const canvas = context.canvas, onParsingDone = context.onParsingDone;
  
  const name = tag.name, type = attrs['type'];
  const lvn = linkableValueNodes[name], mapping = lvn.mapping;
  const node = lvn.factory(type, canvas);
  
  for(let name in attrs) {
    if(name === 'guid' || name === 'id' || name === 'type') {
      continue;
    }
    if(!Object.hasOwnProperty.call(mapping, name)) {
      console.warn(`Bad link in <${tag.name}>: "${name}"`);
    }
    
    const key = mapping[name], id = attrs[name];
    // TODO: if the ID references an external canvas, make sure it's loaded.
    onParsingDone(() => {
      if(node[key]) {
        throw Error(`"${name}" was already defined in <${tag.name}>!`);
      }
      node[key] = Canvas.findValueNode(canvas, id);
    });
  }
  
  pulley.loopTag((pulley, tag) => {
    const name = pulley.expect('opentag').name;
    if(!Object.hasOwnProperty.call(mapping, name)) {
      console.warn(`Bad link in <${tag.name}>: "${name}"`);
    }
    
    const key = mapping[name];
    if(node[key]) {
      throw Error(`"${name}" was already defined in <${tag.name}>!`);
    }
    node[key] = parseValueNode(pulley, context);
    pulley.expectName(name, 'closetag');
  });
  
  const version = canvas.version;
  if((version === '0.5' || version === '0.6' || version === '0.7') &&
     (name === 'blinecalcvertex' || name === 'blinecalctangent' || name === 'blinecalcwidth')) {
    node.homogeneous = VNConst.wrap('bool', false);
  }
  if((version === '0.7' || version === '0.8') &&
     name === 'composite' && type === 'width_point') {
    node.lowerBound = VNConst.wrap('real', 0);
    node.upperBound = VNConst.wrap('real', 1);
  }
  if(Version.index(version) < Version.index('1.0') &&
     name === 'composite' && type === 'bline_point') {
    onParsingDone(() => {
      // This doesn't conform precisely to the way Synfig works, but it's just
      // here to support older formats, and the result is equivalent for that
      // purpose.
      node.splitRadius = node.splitAngle = node.split;
    });
  }
  if(Version.index(version) < Version.index('0.4') &&
     (name === 'blinecalctangent' || name === 'segcalctangent')) {
    onParsingDone(() => {
      // TODO: Attach a "scale" node with scalar of 0.5.
    });
  }
  
  return node;
}
