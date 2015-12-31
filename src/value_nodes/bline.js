import * as VNDynamicList from './dynamic_list.js';


export function create(items, loop) {
  const out = VNDynamicList.create('bline_point', items);
  out.name = 'bline';
  out.loop = !!loop;
}

export function wrap(value) {
  const out = VNDynamicList.wrap(value);
  out.name = 'bline';
  out.loop = value.loop;
}
