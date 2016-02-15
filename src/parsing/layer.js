import { parseValueNode, parseValue, checkAttribute, readStatic } from './general.js';
import * as Version from '../version.js';

import * as VNConst from '../value_nodes/const.js';

import { invertObject } from '../utils.js';


const layers = {};

function register(name, factory, mapping, types) {
  const layer = {
    factory: factory,
    mapping: invertObject(mapping),
    types: types
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
  const tag = pulley.checkName('layer'), attrs = tag.attributes, name = attrs['type'];
  if(!Object.hasOwnProperty.call(layers, name)) {
    return;
  }
  checkAttribute(tag, 'type');
  const canvas = context.canvas, onParsingDone = context.onParsingDone;
  
  const config = layers[name], mapping = config.mapping, types = config.types;
  const layer = config.factory(canvas);
  
  if(attrs['group']) {
    layer.group = attrs['group'];
  }
  const currentVersion = layer.version;
  if(attrs['version']) {
    const version = attrs['version'];
    if(currentVersion && version > currentVersion) { // string comparison? why?
      console.warn(`"${name}" layer version ${version} is greater than installed ${currentVersion}.`);
    }
    layer.version = version;
  }
  if(attrs['desc']) {
    layer.description = attrs['desc'];
  }
  if(attrs['active']) {
    layer.active = attrs['active'] !== 'false';
  }
  if(attrs['exclude_from_rendering']) {
    layer.excludeFromRendering = attrs['exclude_from_rendering'] !== 'false';
  }
  
  // TODO: Make old PasteCanvases work. What a fun and not at all pointless prospect!
  
  pulley.loopTag((pulley) => {
    const tag = pulley.check('opentag');
    if(tag.name === 'name' || tag.name === 'desc') {
      console.warn(`<${tag.name}> entries for layers don't exist. Skipping.`);
      pulley.skipTag();
    } else if(tag.name === 'param') {
      checkAttribute(tag, 'name');
      const attrs = tag.attributes;
      let name = attrs['name'];
      if(name === 'pos' || name === 'offset') {
        name = 'origin'; // Come on, what is this? Netscape?
      }
      name = mapping[name];
      const type = types[name];
      
      if(attrs['use']) {
        const id = attrs['use'];
        // TODO: if the ID references an external canvas, make sure it's loaded.
        if(type === 'canvas') {
          const isStatic = readStatic(tag);
          onParsingDone(() => {
            layer[name] = VNConst.wrap(ValueBase.create('canvas', Canvas.findCanvas(canvas, id), isStatic));
          });
        } else {
          if(name === 'segment_list' && (layer.name === 'region' || layer.name === 'outline')) {
            name = 'bline'; // I couldn't guess why this is only corrected when it's "use"d.
          }
          onParsingDone(() => {
            layer[name] = Canvas.findValueNode(canvas, id);
          });
        }
        pulley.skipTag();
      } else {
        pulley.expectName('param');
        const value = parseValue(pulley, context);
        layer[name] = value ? VNConst.wrap(value) : parseValueNode(pulley, context);
        pulley.expectName('param', 'closetag');
      }
    } else {
      throw Error(`Unexpected element in <layer>: <${tag.name}>!`);
    }
  }, 'layer');
  
  // TODO: add amplifiers for blur
  
  layer.version = currentVersion;
  
  return layer;
}
