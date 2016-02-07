export const SideType = Object.freeze({
  INTERPOLATE: 0,
  ROUNDED: 1,
  SQUARED: 2,
  PEAK: 3,
  FLAT: 4
});


export function create(position, width, sideBefore, sideAfter, dash, lowerBound, upperBound) {
  return {
    position: position || 0,
    width: width === undefined ? 0.01 : width,
    sideBefore: sideBefore || SideType.INTERPOLATE,
    sideAfter: sideAfter || SideType.INTERPOLATE,
    dash: !!dash,
    lowerBound: lowerBound || 0,
    upperBound: upperBound === undefined ? 1 : upperBound
  };
}


export function comesAfter(a, b) {
  return a.position > b.position;
}
