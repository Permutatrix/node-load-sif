export function create(time, state, priority) {
  return {
    time: time || 0,
    state: state === undefined ? true : state,
    priority: priority || 0
  };
}


export function comesAfter(a, b) {
  return a.time > b.time;
}
