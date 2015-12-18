import { makePulley } from 'xml-pulley';

import * as Version from './version.js';
import * as Guid from './guid.js';
import * as Interpolation from './interpolation.js';

import * as Color from './types/color.js';
import * as Canvas from './types/canvas.js';
import * as Vector from './types/vector.js';
import * as Segment from './types/segment.js';
import * as Gradient from './types/gradient.js';
import * as Transformation from './types/transformation.js';
import * as BLinePoint from './types/bline_point.js';
import * as WidthPoint from './types/width_point.js';
import * as DashItem from './types/dash_item.js';
import * as Weighted from './types/weighted.js';
import * as Keyframe from './types/keyframe.js';
import * as ValueBase from './types/value_base.js';

import * as VNConst from './value_nodes/const.js';


function checkAttribute(tag, name) {
  if(tag.attributes[name] === undefined) {
    throw Error(`<${tag.name}> is missing attribute "${name}"!`);
  }
}


export function loadSif(xml) {
  const pulley = makePulley(xml, {
    trim: true,
    normalize: true,
    skipWhitespaceOnly: true
  });
  return parseCanvas(pulley);
}


function parseCanvas(pulley, parent, inline) {
  const tag = pulley.checkName('canvas'), attrs = tag.attributes;
  
  if(attrs['guid'] && Guid.exists(attrs['guid'])) {
    pulley.skipTag();
    return Guid.get(attrs['guid']);
  }
  
  let canvas;
  
  if(inline || !parent) {
    canvas = Canvas.create();
    canvas.parent = parent;
  } else if(parent) {
    canvas = Canvas.childCanvas(canvas, attrs['id']);
  }
  
  Guid.set(canvas.guid = attrs['guid'] || Guid.generate(), canvas);
  if(!inline && attrs['id']) {
    canvas.id = attrs['id'];
  }
  if(attrs['version']) {
    canvas.version = attrs['version'];
  }
  if(attrs['width']) {
    const width = parseInt(attrs['width']);
    if(width < 1) {
      throw Error("Canvas with width or height less than one is not allowed");
    }
    canvas.width = width;
  }
  if(attrs['height']) {
    const height = parseInt(attrs['height']);
    if(height < 1) {
      throw Error("Canvas with width or height less than one is not allowed");
    }
    canvas.height = height;
  }
  if(attrs['xres']) {
    canvas.xres = parseFloat(attrs['xres']);
  }
  if(attrs['yres']) {
    canvas.yres = parseFloat(attrs['yres']);
  }
  if(attrs['fps']) {
    canvas.fps = parseFloat(attrs['fps']);
  }
  if(attrs['begin-time'] || attrs['start-time']) {
    canvas.timeStart = parseTime(attrs['begin-time'] || attrs['start-time'], canvas.fps);
  }
  if(attrs['end-time']) {
    canvas.timeEnd = parseTime(attrs['end-time'], canvas.fps);
  }
  if(attrs['antialias']) {
    canvas.antialias = parseInt(attrs['antialias']);
  }
  if(attrs['view-box']) {
    const values = attrs['view-box'].split(' ');
    if(values.length !== 4) {
      throw Error(`view-box has 4 parameters; ${values.length} given`);
    }
    canvas.tl = Vector.at(parseFloat(values[0]), parseFloat(values[1]));
    canvas.br = Vector.at(parseFloat(values[2]), parseFloat(values[3]));
  }
  if(attrs['bgcolor']) {
    const values = attrs['bgcolor'].split(' ');
    if(values.length !== 4) {
      throw Error(`bgcolor has 4 parameters; ${values.length} given`);
    }
    canvas.bgcolor = Color.rgb(parseFloat(values[0]), parseFloat(values[1]),
                               parseFloat(values[2]), parseFloat(values[3]));
  }
  if(attrs['focus']) {
    const values = attrs['focus'].split(' ');
    if(values.length !== 2) {
      throw Error(`focus has 2 parameters; ${values.length} given`);
    }
    canvas.focus = Vector.at(parseFloat(values[0]), parseFloat(values[1]));
  }
  
  pulley.loopTag((pulley) => {
    const tag = pulley.check('opentag');
    switch(tag.name) {
      case 'defs': {
        if(inline) {
          throw Error("Inline canvases can't have defs!");
        }
        parseCanvasDefs(pulley, canvas);
        break;
      }
      case 'bones': {
        console.warn("Bones are unsupported and probably will be forever.");
        pulley.skipTag();
        break;
      }
      case 'keyframe': {
        if(inline) {
          console.warn("Inline canvases can't have keyframes.");
          pulley.skipTag();
          break;
        }
        Canvas.addKeyframe(canvas, parseKeyframe(pulley, canvas));
        break;
      }
      case 'meta': {
        if(inline) {
          console.warn("Inline canvases can't have metadata.");
          pulley.skipTag();
          break;
        }
        parseMetaInto(pulley, canvas);
        break;
      }
      case 'name': case 'desc': case 'author': {
        pulley.expectName(tag.name);
        canvas[tag.name] = pulley.nextText().text;
        pulley.expectName(tag.name, 'closetag');
        break;
      }
      case 'layer': {
        Canvas.addLayer(canvas, parseLayer(pulley, canvas));
        break;
      }
      default: {
        throw Error(`Unexpected element in <canvas>: <${tag.name}>`);
      }
    }
  }, 'canvas');
  
  return canvas;
}

function parseCanvasDefs(pulley, canvas) {
  pulley.loopTag((pulley) => {
    const tag = pulley.check('opentag');
    if(tag.name === 'canvas') {
      parseCanvas(pulley, canvas);
    } else {
      parseValueNode(pulley, canvas);
    }
  }, 'defs');
}

function parseValueNode(pulley, canvas) {
  const tag = pulley.check('opentag'), attrs = tag.attributes;
  
  let guid = attrs['guid'];
  if(guid) {
    guid = Guid.xor(guid, Canvas.getRoot(canvas).guid);
    if(Guid.exists(guid)) {
      pulley.skipTag();
      return Guid.get(guid);
    }
  } else {
    guid = Guid.generate();
  }
  
  let node, value;
  if(tag.name !== 'canvas' && (value = parseValue(pulley, canvas))) {
    node = VNConst.create(value);
  } else {
    const parser = {
      'hermite': parseAnimated,
      'animated': parseAnimated,
      'static_list': parseStaticList,
      'dynamic_list': parseDynamicList,
      'bline': parseDynamicList,
      'wplist': parseDynamicList,
      'dilist': parseDynamicList,
      'weighted_average': parseDynamicList
    }[tag.name];
    if(parser) {
      node = parser(pulley, canvas);
    } else if(node = parseLinkableValueNode(pulley, canvas)) {
      
    } else if(tag.name === 'canvas') {
      node = VNConst.create(ValueBase.create('canvas', parseCanvas(pulley, canvas, true)));
    } else {
      throw Error(`Expected value node; got <${tag.name}>!`);
    }
  }
  
  if(attrs['id']) {
    Canvas.addValueNode(canvas, node, attrs['id']);
  }
  
  Guid.set(guid, node);
  
  return node;
}

function parseValue(pulley, canvas) {
  const tag = pulley.check('opentag'), attrs = tag.attributes;
  
  const out = ValueBase.create(tag.name);
  switch(tag.name) {
    case 'real': {
      out.data = parseFloat(parseValueAttribute(pulley));
      break;
    }
    case 'time': {
      out.data = parseTime(parseValueAttribute(pulley));
      break;
    }
    case 'integer': {
      out.data = parseInt(parseValueAttribute(pulley));
      break;
    }
    case 'string': {
      pulley.expectName(tag.name, 'opentag');
      out.data = pulley.nextText().rawText;
      pulley.expectName(tag.name, 'closetag');
      break;
    }
    case 'vector': {
      const vec = out.data = Vector.zero();
      pulley.loopTag((pulley) => {
        const name = pulley.expect('opentag').name, value = parseFloat(pulley.nextText().text);
        if(name === 'x') {
          vec.x = value;
        } else if(name === 'y') {
          vec.y = value;
        } else {
          throw Error(`Unexpected element in <vector>: <${name}>!`);
        }
        pulley.expectName(name, 'closetag');
      }, 'vector');
      break;
    }
    case 'color': {
      const col = out.data = Color.black();
      pulley.loopTag((pulley) => {
        const name = pulley.expect('opentag').name, value = parseFloat(pulley.nextText().text);
        if(name === 'r') {
          col.r = value;
        } else if(name === 'g') {
          col.g = value;
        } else if(name === 'b') {
          col.b = value;
        } else if(name === 'a') {
          col.a = value;
        } else {
          throw Error(`Unexpected element in <color>: <${name}>!`);
        }
        pulley.expectName(name, 'closetag');
      }, 'color');
      break;
    }
    case 'segment': {
      const seg = out.data = Segment.zero();
      pulley.loopTag((pulley) => {
        const name = pulley.expect('opentag').name;
        let value = parseValue(pulley, canvas);
        if(!value || value.type !== 'vector') {
          throw Error(`Expected <vector> in <segment>!`);
        }
        value = value.data;
        if(name === 'p1') {
          seg.p1 = value;
        } else if(name === 't1') {
          seg.t1 = value;
        } else if(name === 'p2') {
          seg.p2 = value;
        } else if(name === 't2') {
          seg.t2 = value;
        } else {
          throw Error(`Unexpected element in <segment>: <${name}>!`);
        }
        pulley.expectName(name, 'closetag');
      }, 'segment');
      break;
    }
    case 'gradient': {
      const grad = out.data = Gradient.empty();
      pulley.loopTag((pulley) => {
        const tag = pulley.checkName('color'), attrs = tag.attributes, value = parseValue(pulley, canvas);
        if(!attrs['pos']) {
          throw Error("<gradient>'s <color> is missing attribute \"pos\"!");
        }
        Gradient.addStop(grad, parseFloat(attrs['pos']), value.data);
      }, 'gradient');
      break;
    }
    case 'bool': {
      const value = parseValueAttribute(pulley);
      if(value === 'true' || value === '1') {
        out.data = true;
      } else if(value === 'false' || value === '0') {
        out.data = false;
      } else {
        throw Error(`Bad value "${value}" in <bool>!`);
      }
      break;
    }
    case 'angle': case 'degrees': case 'radians': case 'rotations': {
      // Synfig parses all of these as degrees for some reason.
      out.data = parseFloat(parseValueAttribute(pulley)) * Math.PI / 180;
      break;
    }
    case 'transformation': {
      const trans = out.data = Transformation.create();
      pulley.loopTag((pulley) => {
        const name = pulley.expect('opentag').name, value = parseValue(pulley, canvas);
        if(!value) {
          throw Error(`<transformation>'s <${name}> has an invalid value!`);
        }
        let expectedType;
        if(name === 'offset') {
          trans.offset = value.data;
          expectedType = 'vector';
        } else if(name === 'angle') {
          trans.angle = value.data;
          expectedType = 'angle';
        } else if(name === 'skew_angle') {
          trans.skew = value.data;
          expectedType = 'angle';
        } else if(name === 'scale') {
          trans.scale = value.data;
          expectedType = 'vector';
        } else {
          throw Error(`Unexpected element in <transformation>: <${name}>!`);
        }
        if(value.type !== expectedType) {
          throw Error(`Expected <transformation>'s <${name}> to be ${expectedType}; got ${value.type}!`);
        }
        pulley.expectName(name, 'closetag');
      }, 'transformation');
      break;
    }
    case 'list': {
      const list = out.data = [];
      pulley.loopTag((pulley) => {
        const name = pulley.check('opentag').name;
        const v = parseValue(pulley, canvas);
        if(!v) {
          throw Error(`Expected list item to be a value; got <${name}>!`);
        }
        list.push(v);
      }, 'list');
      return out;
    }
    case 'bline_point': {
      const bp = out.data = BLinePoint.create();
      bp.splita = bp.splitr = false;
      pulley.loopTag((pulley) => {
        const name = pulley.expect('opentag').name, value = parseValue(pulley, canvas);
        if(!value) {
          throw Error(`<bline_point>'s <${name}> has an invalid value!`);
        }
        let expectedType;
        if(name === 'v' || name === 'p1') {
          bp.vertex = value.data;
          expectedType = 'vector';
        } else if(name === 't1' || name === 'tangent') {
          bp.tangent1 = value.data;
          expectedType = 'vector';
        } else if(name === 't2') {
          bp.tangent2 = value.data;
          bp.splita = bp.splitr = true;
          expectedType = 'vector';
        } else if(name === 'width') {
          bp.width = value.data;
          expectedType = 'real';
        } else if(name === 'origin') {
          bp.origin = value.data;
          expectedType = 'real';
        } else {
          throw Error(`Unexpected element in <bline_point>: <${name}>!`);
        }
        if(value.type !== expectedType) {
          throw Error(`Expected <bline_point>'s <${name}> to be ${expectedType}; got ${value.type}!`);
        }
        pulley.expectName(name, 'closetag');
      }, 'bline_point');
      if(!bp.splita) {
        bp.tangent2 = Vector.clone(bp.tangent1);
      }
      return out;
    }
    case 'guid': {
      out.data = parseValueAttribute(pulley).toUpperCase();
      out.type = 'string';
      return out;
    }
    case 'width_point': {
      const wp = out.data = WidthPoint.create();
      pulley.loopTag((pulley) => {
        const name = pulley.expect('opentag').name, value = parseValue(pulley, canvas);
        if(!value) {
          throw Error(`<width_point>'s <${name}> has an invalid value!`);
        }
        let expectedType;
        if(name === 'position') {
          wp.position = value.data;
          expectedType = 'real';
        } else if(name === 'width') {
          wp.width = value.data;
          expectedType = 'real';
        } else if(name === 'side_before') {
          wp.before = value.data;
          expectedType = 'integer';
        } else if(name === 'side_after') {
          wp.after = value.data;
          expectedType = 'integer';
        } else if(name === 'lower_bound') {
          wp.lower = value.data;
          expectedType = 'real';
        } else if(name === 'upper_bound') {
          wp.upper = value.data;
          expectedType = 'real';
        } else {
          throw Error(`Unexpected element in <width_point>: <${name}>!`);
        }
        if(value.type !== expectedType) {
          throw Error(`Expected <width_point>'s <${name}> to be ${expectedType}; got ${value.type}!`);
        }
        pulley.expectName(name, 'closetag');
      }, 'width_point');
      return out;
    }
    case 'dash_item': {
      const di = out.data = DashItem.create();
      pulley.loopTag((pulley) => {
        const name = pulley.expect('opentag').name, value = parseValue(pulley, canvas);
        if(!value) {
          throw Error(`<dash_item>'s <${name}> has an invalid value!`);
        }
        let expectedType;
        if(name === 'offset') {
          di.offset = value.data;
          expectedType = 'real';
        } else if(name === 'length') {
          di.length = value.data;
          expectedType = 'real';
        } else if(name === 'side_before') {
          di.before = value.data;
          expectedType = 'integer';
        } else if(name === 'side_after') {
          di.after = value.data;
          expectedType = 'integer';
        } else {
          throw Error(`Unexpected element in <dash_item>: <${name}>!`);
        }
        if(value.type !== expectedType) {
          throw Error(`Expected <dash_item>'s <${name}> to be ${expectedType}; got ${value.type}!`);
        }
        pulley.expectName(name, 'closetag');
      }, 'dash_item');
      return out;
    }
    case 'canvas': {
      out.data = parseCanvas(pulley, canvas, true);
      out.static = readStatic(tag);
      return out;
    }
    default: {
      if(tag.name.indexOf('weighted_') === 0) {
        let weight = 0, value;
        pulley.loopTag((pulley) => {
          const name = pulley.expect('opentag').name, value = parseValue(pulley, canvas);
          if(!value) {
            throw Error(`<${tag.name}>'s <${name}> has an invalid value!`);
          }
          let expectedType;
          if(name === 'weight') {
            weight = value.data;
            expectedType = 'real';
          } else if(name === 'value') {
            weight = value.data;
            expectedType = tag.name.substr('weighted_'.length);
          } else {
            throw Error(`Unexpected element in <${tag.name}>: <${name}>!`);
          }
          if(value.type !== expectedType) {
            throw Error(`Expected <${tag.name}>'s <${name}> to be ${expectedType}; got ${value.type}!`);
          }
          pulley.expectName(name, 'closetag');
        });
        out.data = Weighted.create(weight, value);
        break;
      } else {
        return;
      }
    }
  }
  
  out.static = readStatic(tag);
  out.interpolation = readInterpolation(tag);
  return out;
}

function parseValueAttribute(pulley) {
  const tag = pulley.expect('opentag'), value = tag.attributes['value'];
  pulley.expectName(tag.name, 'closetag');
  if(!value) {
    throw Error(`<${tag.name}> is missing attribute "value"!`);
  }
  return value;
}

function readStatic(tag) {
  const value = tag.attributes['static'];
  switch(value) {
    case '0': case 'false': case undefined: return false;
    case '1': case 'true': return true;
  }
  throw Error(`Invalid value for static: "${value}"!`);
}

function readInterpolation(tag) {
  const value = tag.attributes['interpolation'];
  switch(value) {
    case 'halt': return Interpolation.HALT;
    case 'constant': return Interpolation.CONSTANT;
    case 'linear': return Interpolation.LINEAR;
    case 'manual': return Interpolation.MANUAL;
    case 'auto': return Interpolation.TCB;
    case 'clamped': return Interpolation.CLAMPED;
    case undefined: return Interpolation.UNDEFINED;
  }
  throw Error(`Invalid value for interpolation: "${value}"!`);
}

function parseKeyframe(pulley, canvas) {
  canvas = canvas || {};
  
  const tag = pulley.expectName('keyframe'), attrs = tag.attributes;
  
  checkAttribute(tag, 'time');
  const time = attrs['time'], active = attrs['active'];
  
  const out = Keyframe.create(parseTime(time, canvas.fps),
                              active !== 'false' && active !== '0',
                              pulley.nextText().text);
  pulley.expectName('keyframe', 'closetag');
  
  return out;
}

function parseMetaInto(pulley, canvas) {
  const tag = pulley.expectName('meta'), attrs = tag.attributes;
  
  checkAttribute(tag, 'name');
  checkAttribute(tag, 'content');
  const name = attrs['name'];
  let content = attrs['content'];
  
  if([
       'background_first_color',
       'background_second_color',
       'background_size',
       'grid_color',
       'grid_size',
       'jack_offset'
     ].indexOf(name) !== -1) {
    content = content.replace(/,/g, '.');
  }
  canvas.metadata[name] = content;
  
  pulley.expectName('meta', 'closetag');
}

function parseLayer(pulley, canvas) {
  throw Error("layer not implemented");
}


function parseTime(stamp, fps) {
  fps = fps || 0;
  stamp = stamp.toLowerCase();
  
  if(stamp === 'sot' || stamp === 'bot')
    return -32767.0*512.0;
  if(stamp === 'eot')
    return 32767.0*512.0;
  
  let value = 0;
  for(let pos = 0, len = stamp.length; pos < len; ++pos) {
    const match = /-?\d*\.?\d*/.exec(stamp.substr(pos));
    let amount = 0;
    if(match) {
      amount = +match[0] || 0;
      pos += match[0].length;
    }
    if(pos >= stamp.length || !match) {
      if(amount !== 0) {
        if(fps) {
          console.warn(`timecode "${stamp}": no unit provided; assuming frames`);
          value += amount / fps;
        } else {
          console.warn(`timecode "${stamp}": no unit provided, no FPS given; assuming seconds`);
          value += amount;
        }
      }
      return value;
    }
    const code = stamp.charAt(pos);
    if(code === 'h') {
      value += amount * 3600;
    } else if(code === 'm') {
      value += amount * 60;
    } else if(code === 's') {
      value += amount;
    } else if(code === 'f') {
      if(fps)
        value += amount / fps;
      else
        console.warn(`timecode "${stamp}": individual frames referenced, but FPS is unknown`);
    } else if(code == ':') {
      const parts = stamp.split(':');
      if(parts.length >= 3) {
        const dot = parts[2].indexOf('.');
        if(dot >= 0) {
          parts.push(parts[2].substr(dot+1));
          parts[2] = parts[2].substr(0,dot);
        }
        value = (+parts[0] || 0)*3600 + (+parts[1] || 0)*60 + (+parts[2] || 0);
        if(parts.length >= 4) {
          if(fps)
            value += (+parts[3] || 0) / fps;
          else
            console.warn(`timecode "${stamp}": individual frames referenced, but FPS is unknown`);
        }
        return value;
      } else {
        console.warn(`timecode "${stamp}": bad time format`);
      }
    } else {
      console.warn(`timecode "${stamp}": unexpected unit code "${code}"; assuming seconds`);
      value += amount;
    }
  }
  return value;
}
