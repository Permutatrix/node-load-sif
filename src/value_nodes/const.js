export const create = function VNConst(data) {
  return {
    type: 'const',
    data,
    at(time) {
      return data;
    }
  };
};
