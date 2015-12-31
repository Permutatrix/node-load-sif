import * as VNDynamicList from './dynamic_list.js';


export function create(items, loop) {
  const out = VNDynamicList.create('width_point', items);
  out.name = 'wplist';
  out.loop = !!loop;
}

export function wrap(value) {
  const out = VNDynamicList.wrap(value);
  out.name = 'wplist';
  out.loop = value.loop;
}
