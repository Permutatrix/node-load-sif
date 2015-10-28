import { makePulley } from 'xml-pulley';

import * as version from './version.js';
import * as guid from './guid.js';

import Color from './types/color.js';
import Canvas from './types/canvas.js';
import Vector from './types/vector.js';
import * as time from './types/time.js';


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
  
  if(parent && (inline || attrs['id'])) {
    if(inline) {
      canvas = parent.InlineCanvas();
    } else {
      canvas = parent.childCanvas(attrs['id']);
    }
  } else {
    canvas = Canvas();
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
    canvas.timeStart = canvas.parseTime(attrs['begin-time'] || attrs['start-time']);
  }
  if(attrs['end-time']) {
    canvas.timeEnd = canvas.parseTime(attrs['end-time']);
  }
  if(attrs['antialias']) {
    canvas.antialias = parseInt(attrs['antialias']);
  }
  if(attrs['view-box']) {
    let values = attrs['view-box'].split(' ');
    if(values.length !== 4) {
      throw Error(`view-box has 4 parameters; ${values.length} given`);
    }
    canvas.tl = Vector(parseFloat(values[0]), parseFloat(values[1]));
    canvas.br = Vector(parseFloat(values[2]), parseFloat(values[3]));
  }
  if(attrs['bgcolor']) {
    let values = attrs['bgcolor'].split(' ');
    if(values.length !== 4) {
      throw Error(`bgcolor has 4 parameters; ${values.length} given`);
    }
    canvas.bgcolor = Color(parseFloat(values[0]), parseFloat(values[1]),
                           parseFloat(values[2]), parseFloat(values[3]));
  }
  if(attrs['focus']) {
    let values = attrs['focus'].split(' ');
    if(values.length !== 2) {
      throw Error(`focus has 2 parameters; ${values.length} given`);
    }
    canvas.focus = Vector(parseFloat(values[0]), parseFloat(values[1]));
  }
  
  return canvas;
}
