import { parseValueNode } from './general.js';
import * as Canvas from '../types/canvas.js';
import * as ValueBase from '../types/value_base.js';
import * as VNConst from '../value_nodes/const.js';
import * as Version from '../version.js';

import { invertObject } from '../utils.js';


const linkableValueNodes = {};

function register(name, factory, mapping) {
  const linkableValueNode = {
    factory: factory,
    mapping: invertObject(mapping)
  };
  if(typeof name === 'string') {
    linkableValueNodes[name] = linkableValueNode;
  } else {
    for(let i = 0, len = name.length; i < len; ++i) {
      linkableValueNodes[name[i]] = linkableValueNode;
    }
  }
  return linkableValueNode;
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
  if(Version.between(version, '0.5', '0.7') &&
     (name === 'blinecalcvertex' || name === 'blinecalctangent' || name === 'blinecalcwidth')) {
    node.homogeneous = VNConst.wrap('bool', false);
  }
  if(Version.between(version, '0.7', '0.8') &&
     name === 'composite' && type === 'width_point') {
    node.lowerBound = VNConst.wrap('real', 0);
    node.upperBound = VNConst.wrap('real', 1);
  }
  if(Version.less(version, '1.0') &&
     name === 'composite' && type === 'bline_point') {
    onParsingDone(() => {
      // This doesn't conform precisely to the way Synfig works, but it's just
      // here to support older formats, and the result is equivalent for that
      // purpose.
      node.splitRadius = node.splitAngle = node.split;
    });
  }
  if(Version.less(version, '0.4') &&
     (name === 'blinecalctangent' || name === 'segcalctangent')) {
    onParsingDone(() => {
      // TODO: Attach a "scale" node with scalar of 0.5.
    });
  }
  
  return node;
}
