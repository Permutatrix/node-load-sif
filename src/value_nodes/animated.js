import * as Waypoint from '../types/waypoint.js';
import * as Interpolation from '../interpolation.js';


export function create(type, waypoints, interpolation) {
  return {
    name: 'animated',
    type: type,
    waypoints: waypoints || [],
    interpolation: interpolation === undefined ? Interpolation.UNDEFINED : interpolation
  };
}
