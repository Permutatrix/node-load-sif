export const CANVAS_VERSION = '1.0';

export const CANVAS_VERSION_HISTORY = [
  '0.0',
  '0.1',
  '0.2',
  '0.3',
  '0.4',
  '0.5',
  '0.6',
  '0.7',
  '0.8',
  '0.9',
  '1.0'
];

const CANVAS_VERSION_INDEX = index(CANVAS_VERSION);

export function index(v) {
  return CANVAS_VERSION_HISTORY.indexOf(v);
}

export function greater(a, b) {
  return index(a) > index(b);
}

export function less(a, b) {
  return index(a) < index(b);
}

export function between(x, a, b) {
  x = index(x);
  return x >= index(a) && x <= index(b);
}

export function supported(v) {
  const ind = index(v);
  return ind >= 0 && ind <= CANVAS_VERSION_INDEX;
}
