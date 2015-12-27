import { makePulley } from 'xml-pulley';
import { parseCanvas } from './general.js';

export function loadSif(xml) {
  const pulley = makePulley(xml, {
    trim: true,
    normalize: true,
    skipWhitespaceOnly: true
  });
  return parseCanvas(pulley);
}
