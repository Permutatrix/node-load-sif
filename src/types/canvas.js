import { parseTime as parseTime_ } from './time.js';

export default function Canvas() {
  let canvas;
  
  let parseTime = (stamp) => parseTime_(stamp, canvas.fps);
  
  return canvas = {
    parseTime
  };
}
