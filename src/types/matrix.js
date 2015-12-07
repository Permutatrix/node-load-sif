export function create(m00, m01, m02,
                       m10, m11, m12,
                       m20, m21, m22) {
  if(m00 === undefined) {
    // identity matrix
    return [1, 0, 0,
            0, 1, 0,
            0, 0, 1];
  } else if(m10 === undefined) {
    // x-axis, y-axis, offset
    return [m00.x, m00.y, 0,
            m01.x, m01.y, 0,
            m02.x, m02.y, 1];
  } else if(m20 === undefined) {
    // affine matrix
    return [m00, m01, 0,
            m02, m10, 0,
            m11, m12, 1];
  } else {
    return [m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22];
  }
}
