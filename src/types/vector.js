export const create = function Vector(x, y) {
  if(x === undefined) {
    return { x: 0, y: 0 };
  } else if(y === undefined) {
    return { x, y: x };
  } else {
    return { x, y };
  }
}


export function clone(vec) {
  return { x: vec.x, y: vec.y };
}

export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(plus, minus) {
  return { x: plus.x - minus.x, y: plus.y - minus.y };
}
