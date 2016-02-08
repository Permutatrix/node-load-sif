import * as Interpolation from '../interpolation.js';


export function create(time, valueNode, interpolationBefore, interpolationAfter) {
  return {
    time: time || 0,
    valueNode: valueNode,
    interpolationBefore: interpolationBefore === undefined ? (interpolationBefore = Interpolation.UNDEFINED) : interpolationBefore,
    interpolationAfter: interpolationAfter === undefined ? interpolationBefore : interpolationAfter,
    // I'm not adding all of these as parameters. That would surely kill me.
    tension: 0,
    continuity: 0,
    bias: 0,
    temporalTension: 0
  };
}

export function tcb(time, valueNode, tension, continuity, bias, temporalTension) {
  return {
    time: time || 0,
    valueNode: valueNode,
    interpolationBefore: Interpolation.TCB,
    interpolationAfter: Interpolation.TCB,
    tension: tension || 0,
    continuity: continuity || 0,
    bias: bias || 0,
    temporalTension: temporalTension || 0
  };
}


export function comesAfter(a, b) {
  return a.time > b.time;
}
