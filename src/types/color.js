export function rgb(r, g, b, a) {
  return { r: r, g: g, b: b, a: a === undefined ? 1 : a };
}

export function value(value, alpha) {
  return {
    r: value,
    g: value,
    b: value,
    a: alpha === undefined ? 1 : alpha
  };
}

export function black() {
  return {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
}
