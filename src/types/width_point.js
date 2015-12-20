export const SideType = Object.freeze({
  INTERPOLATE: 0,
  ROUNDED: 1,
  SQUARED: 2,
  PEAK: 3,
  FLAT: 4
});


export function create(position, width, before, after, dash, lower, upper) {
  return {
    position: position || 0,
    width: width === undefined ? 0.01 : width,
    before: before || SideType.INTERPOLATE,
    after: after || SideType.INTERPOLATE,
    dash: !!dash,
    lower: lower || 0,
    upper: upper === undefined ? 1 : upper
  };
}
