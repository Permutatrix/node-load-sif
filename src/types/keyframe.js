export const create = function Keyframe(time, active, desc) {
  return {
    time: time,
    active: active === undefined ? true : active,
    desc: desc ? desc : undefined
  };
};


export function comesAfter(a, b) {
  return a.time > b.time;
}
