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
