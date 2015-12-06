import * as Interpolation from '../interpolation.js';

export function create(type, data, isStatic, interpolation, loop) {
  return {
    type,
    data,
    static: !!isStatic,
    interpolation: interpolation || Interpolation.UNDEFINED,
    loop: !!loop
  };
};
