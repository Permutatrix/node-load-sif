import * as VNConst from './const.js';


export function create(type, items) {
  return {
    name: 'static_list',
    type: 'list',
    containedType: type,
    items: items || []
  };
}

export function wrap(value) {
  const data = value.data, items = Array(data.length);
  for(let i = 0, len = data.length; i < len; ++i) {
    items[i] = VNConst.wrap(data[i]);
  }
  return create(data[0].type, items);
}
