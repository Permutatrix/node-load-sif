import * as time from './time.js';

export default function Canvas() {
  let canvas;
  
  let parseTime = (stamp) => time.parse(stamp, canvas.fps);
  
  return canvas = {
    parseTime
  };
}
