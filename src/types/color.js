export default function color(r, g, b, a) {
  if(g === undefined)
    return { r: r, g: r, b: r, a: 1 };
  if(b === undefined)
    return { r: r, g: r, b: r, a: g };
  if(a === undefined)
    return { r, g, b, a: 1 };
  return { r, g, b, a };
}
