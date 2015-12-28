export const SideType = Object.freeze({
  ROUNDED: 1,
  SQUARED: 2,
  PEAK: 3,
  FLAT: 4
});


export function create(offset, length, sideBefore, sideAfter) {
  return {
    offset: offset === undefined ? 0.1 : offset,
    length: length === undefined ? 0.1 : length,
    sideBefore: sideBefore || SideType.FLAT,
    sideAfter: sideAfter || SideType.FLAT
  };
}
