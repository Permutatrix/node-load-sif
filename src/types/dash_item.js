export const SideType = Object.freeze({
  ROUNDED: 1,
  SQUARED: 2,
  PEAK: 3,
  FLAT: 4
});


export const create = function DashItem(offset, length, before, after) {
  return {
    offset: offset === undefined ? 0.1 : offset,
    length: length === undefined ? 0.1 : length,
    before: before || SideType.FLAT,
    after: after || SideType.FLAT
  };
};
