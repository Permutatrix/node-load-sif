import * as VNDynamicList from './dynamic_list.js';
import * as Weighted from '../types/weighted.js';
import * as VNConst from './const.js';
import * as Entry from './dynamic_list_entry.js';


export function create(type, items, loop) {
  const out = VNDynamicList.create('weighted_' + type, items);
  out.name = 'weighted_average';
  // I cannot fathom why a weighted_average would be looped, but there you go.
  out.loop = !!loop;
  out.type = type;
}

export function wrap(value) {
  return create(value.type, [Entry.create(VNConst.wrap(Weighted.create(1, value)))]);
}
