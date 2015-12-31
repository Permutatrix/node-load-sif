import * as Activepoint from '../types/activepoint.js';
import * as VNConst from './const.js';
import * as Entry from './dynamic_list_entry.js';
export { Entry };


export function create(type, items) {
  return {
    name: 'dynamic_list',
    type: 'list',
    containedType: type,
    items: items || []
  };
}

export function wrap(value) {
  const data = value.data, items = Array(data.length);
  for(let i = 0, len = data.length; i < len; ++i) {
    items[i] = Entry.create(VNConst.wrap(data[i]));
  }
  return create(data[0].type, items);
}
