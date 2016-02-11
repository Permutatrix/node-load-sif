export function insertSorted(array, item, later) {
  for(let i = array.length; i > 0; --i) {
    if(!later(array[i-1], item)) {
      array.splice(i, 0, item);
      return i;
    }
  }
  array.unshift(item);
  return 0;
}

export function parseDecimal(str) {
  const out = parseFloat(str);
  return Math.abs(1 - out) < 1e-8 ? 1 : out;
}

export function invertObject(obj) {
  const out = {};
  for(let key in obj) {
    const v = obj[key];
    if(typeof v === 'string') {
      out[v] = key;
    } else {
      for(let i = 0, len = v.length; i < len; ++i) {
        out[v[i]] = key;
      }
    }
  }
  return out;
}
