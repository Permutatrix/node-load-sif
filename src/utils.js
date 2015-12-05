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
