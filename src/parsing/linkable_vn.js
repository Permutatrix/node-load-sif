const linkableValueNodes = {};

function register(name, factory, mapping) {
  const m = {}, node = linkableValueNodes[name] = { factory: factory, mapping: m };
  for(let key in mapping) {
    const v = mapping[key];
    if(typeof v === 'string') {
      m[v] = key;
    } else {
      for(let i = 0, len = v.length; i < len; ++i) {
        m[v[i]] = key;
      }
    }
  }
  return node;
}


export function parseLinkableValueNode(pulley, context) {
  const tag = pulley.check('opentag'), attrs = tag.attributes;
  if(!Object.hasOwnProperty.call(linkableValueNodes, tag.name)) {
    return;
  }
  const canvas = context.canvas, onParsingDone = context.onParsingDone;
  
  const lvn = linkableValueNodes[tag.name], mapping = lvn.mapping;
  const node = lvn.factory(attrs['type'], canvas);
}
