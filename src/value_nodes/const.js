export function create(type, data) {
  return {
    name: 'constant',
    type: type,
    data: data
  };
}
export function wrap(data) {
  return create(data.type, data);
}
