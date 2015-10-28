export function parse(stamp, fps) {
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
