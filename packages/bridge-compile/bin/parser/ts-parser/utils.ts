import { Type } from 'typescript';

export function isArrayWithPos(type: Type) {
  return type
    .getProperties()
    .map((p) => p.escapedName)
    .some((p) => String(p).startsWith('__@iterator'));
}
