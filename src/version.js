export const CANVAS_VERSION = '1.0';

export const CANVAS_VERSION_HISTORY = [
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

export function supported(v) {
  let ind = index(v);
  return v >= 0 && v <= CANVAS_VERSION_INDEX;
}
