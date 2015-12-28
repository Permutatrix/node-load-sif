export function create(type, data) {
  return {
    name: 'constant',
    type: type,
    data: data
  };
}
export function wrap(value) {
  return create(value.type, value);
}
