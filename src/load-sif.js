import { makePulley } from 'xml-pulley';

import * as Version from './version.js';
import * as Guid from './guid.js';

import * as Color from './types/color.js';
import * as Canvas from './types/canvas.js';
import * as Vector from './types/vector.js';


export default function loadSif(file) {
  let pulley = makePulley(file, {
    trim: true,
    normalize: true,
    skipWhitespaceOnly: true
  });
  return parseCanvas(pulley);
}


function parseCanvas(pulley, parent, inline) {
  let tag = pulley.checkName('canvas'), attrs = tag.attributes;
  
  if(attrs['guid'] && guid.exists(attrs['guid'])) {
    pulley.skipTag();
    return guid.get(attrs['guid']);
  }
  
  let canvas;
  
  if(inline || !parent) {
    canvas = Canvas.create();
  } else if(parent) {
    canvas = Canvas.childCanvas(canvas, attrs['id']);
  }
  
  if(attrs['guid']) {
    guid.set(attrs['guid'], canvas);
  }
  if(attrs['version']) {
    canvas.version = attrs['version'];
  }
  if(attrs['width']) {
    let width = parseInt(attrs['width']);
    if(width < 1) {
      throw Error("Canvas with width or height less than one is not allowed");
    }
    canvas.width = width;
  }
  if(attrs['height']) {
    let height = parseInt(attrs['height']);
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
    let values = attrs['view-box'].split(' ');
    if(values.length !== 4) {
      throw Error(`view-box has 4 parameters; ${values.length} given`);
    }
    canvas.tl = Vector.create(parseFloat(values[0]), parseFloat(values[1]));
    canvas.br = Vector.create(parseFloat(values[2]), parseFloat(values[3]));
  }
  if(attrs['bgcolor']) {
    let values = attrs['bgcolor'].split(' ');
    if(values.length !== 4) {
      throw Error(`bgcolor has 4 parameters; ${values.length} given`);
    }
    canvas.bgcolor = Color.create(parseFloat(values[0]), parseFloat(values[1]),
                                  parseFloat(values[2]), parseFloat(values[3]));
  }
  if(attrs['focus']) {
    let values = attrs['focus'].split(' ');
    if(values.length !== 2) {
      throw Error(`focus has 2 parameters; ${values.length} given`);
    }
    canvas.focus = Vector.create(parseFloat(values[0]), parseFloat(values[1]));
  }
  
  pulley.loopTag((pulley) => {
    let tag = pulley.check('opentag');
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
        Canvas.addKeyframe(canvas, parseKeyframe(pulley));
        break;
      }
      case 'meta': {
        if(inline) {
          console.warn("Inline canvases can't have metadata.");
          pulley.skipTag();
          break;
        }
        Canvas.setMetadata(canvas, parseMeta(pulley));
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
  throw Error("defs not implemented");
}

function parseKeyframe(pulley) {
  throw Error("keyframe not implemented");
}

function parseMeta(pulley) {
  throw Error("meta not implemented");
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
    let match = /-?\d*\.?\d*/.exec(stamp.substr(pos));
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
    let code = stamp.charAt(pos);
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
      let parts = stamp.split(':');
      if(parts.length >= 3) {
        let dot = parts[2].indexOf('.');
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
