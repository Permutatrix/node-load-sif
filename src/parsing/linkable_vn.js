const linkableValueNodes = {};

function register(name, factory, mapping) {
  const m = {}, node = linkableValueNodes[name] = { factory: factory, mapping: m };
  for(let key in mapping) {
    if(Object.hasOwnProperty.call(mapping, key)) {
      const v = mapping[key];
      if(typeof v === 'string') {
        m[v] = key;
      } else {
        for(let i = 0, len = v.length; i < len; ++i) {
          m[v[i]] = key;
        }
      }
    }
  }
  return node;
}


export function parseLinkableValueNode(pulley, canvas) {
  const tag = pulley.check('opentag'), attrs = tag.attributes;
  if(!Object.hasOwnProperty.call(linkableValueNodes, tag.name)) {
    return;
  }
  
  const lvn = linkableValueNodes[tag.name], mapping = lvn.mapping;
  const node = lvn.factory(attrs['type'], canvas);
}
