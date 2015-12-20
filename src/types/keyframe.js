export function create(time, active, desc) {
  return {
    time: time,
    active: active === undefined ? true : active,
    desc: desc ? desc : undefined
  };
}


export function comesAfter(a, b) {
  return a.time > b.time;
}
