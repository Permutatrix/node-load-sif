export function create(m00, m01, m02,
                       m10, m11, m12,
                       m20, m21, m22) {
  return {
    array: [m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22]
  };
}

export function affine(m00, m01,
                       m10, m11,
                       m20, m21) {
  return {
    array: [m00, m01, 0,
            m10, m11, 0,
            m20, m21, 1]
  };
}

export function fromVectors(axisX, axisY, offset) {
  return {
    array: [axisX.x,  axisX.y,  0,
            axisY.x,  axisY.y,  0,
            offset.x, offset.y, 1]
  };
}

export function identity() {
  return {
    array: [1, 0, 0,
            0, 1, 0,
            0, 0, 1]
  };
}
