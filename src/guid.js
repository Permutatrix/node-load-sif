const guids = {};

export function set(guid, value) {
  guids[guid] = value;
}

export function get(guid) {
  return guids[guid];
}

export function exists(guid) {
  return guids.hasOwnProperty(guid);
}

function hex(number, width) {
  let out = '';
  for(let i = 0; i < width; ++i) {
    out += '0';
  }
  return (out + number.toString(16)).substr(-width).toUpperCase();
}

export function xor(a, b) {
  let out = '';
  for(let i = 0; i < 32; i += 4) {
    out += hex(parseInt(a.substr(i, 4), 16) ^ parseInt(b.substr(i, 4), 16), 4);
  }
  return out;
}

export function generate() {
  let out = '';
  for(let i = 0; i < 16; ++i) {
    out += hex(Math.floor(Math.random() * 256), 2);
  }
  return out;
}

export function find(value) {
  for(let guid in guids) {
    if(guids[guid] === value) {
      return guid;
    }
  }
}

export function sureFind(value) {
  let guid = find(value);
  if(guid) {
    return guid;
  }
  guid = generate();
  set(guid, value);
  return guid;
}
