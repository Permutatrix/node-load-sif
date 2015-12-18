import * as Interpolation from '../interpolation.js';

export const create = function ValueBase(type, data, isStatic, interpolation, loop) {
  return {
    type: type,
    data: data,
    static: !!isStatic,
    interpolation: interpolation || Interpolation.UNDEFINED,
    loop: !!loop
  };
};
