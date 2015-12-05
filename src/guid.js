const guids = {};

export function set(guid, value) {
  guids[guid] = value;
}

export function get(guid) {
  return guids[guid];
}

export function exists(guid) {
  return guids.hasOwnProperty(guid);
}
