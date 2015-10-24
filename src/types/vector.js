export default function Vector(x, y) {
  if(x === undefined)
    return { x: 0, y: 0 };
  return { x, y };
}
