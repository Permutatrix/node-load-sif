import * as Interpolation from '../interpolation.js';


export function create(type, data, isStatic, interpolation, loop) {
  return {
    type: type,
    data: data,
    static: !!isStatic,
    interpolation: interpolation === undefined ? Interpolation.UNDEFINED : interpolation,
    loop: !!loop
  };
}
