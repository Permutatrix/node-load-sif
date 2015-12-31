export function at(x, y) {
  return { x: x, y: y };
}

export function diagonal(x) {
  return { x: x, y: x };
}

export function zero() {
  return { x: 0, y: 0 };
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
