export function create(time, active, description) {
  return {
    time: time,
    active: active === undefined ? true : active,
    description: description ? description : undefined
  };
}


export function comesAfter(a, b) {
  return a.time > b.time;
}
