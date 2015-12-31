import * as VNDynamicList from './dynamic_list.js';


export function create(items, loop) {
  const out = VNDynamicList.create('dash_item', items);
  out.name = 'dilist';
  out.loop = !!loop;
}

export function wrap(value) {
  const out = VNDynamicList.wrap(value);
  out.name = 'dilist';
  out.loop = value.loop;
}
