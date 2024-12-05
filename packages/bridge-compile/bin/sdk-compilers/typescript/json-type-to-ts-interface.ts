import { JSONTypeI } from '../../types';

export const JSONTypeToTSInterface = (JSONType: JSONTypeI): string => {
  // HAVE TO FIX
  if (Object.values(JSONType).length === 0) return '{}';
  if ('primitive' in JSONType)
    return JSONType.value && JSONType.primitive !== 'nested'
      ? JSONType.primitive === 'string'
        ? `"${JSONType.value.toString()}"`
        : JSONType.value.toString()
      : ['unrecognized', 'nested'].includes(JSONType.primitive)
      ? 'any'
      : JSONType.primitive;

  if ('array' in JSONType) return `Array<${JSONTypeToTSInterface(JSONType.array)}>`;

  if ('record' in JSONType)
    return `Record<${JSONTypeToTSInterface(JSONType.record.key)}, ${JSONTypeToTSInterface(JSONType.record.value)}>`;

  if ('union' in JSONType && JSONType.union.length > 0)
    return '(' + JSONType.union.map((elem) => JSONTypeToTSInterface(elem)).join(' | ') + ')';

  if ('intersection' in JSONType && JSONType.intersection.length > 0)
    return '(' + JSONType.intersection.map((elem) => JSONTypeToTSInterface(elem)).join(' & ') + ')';

  if ('arrayWithPos' in JSONType)
    return '[' + JSONType.arrayWithPos.map((elem) => JSONTypeToTSInterface(elem)).join(', ') + ']';
  else if ('object' in JSONType)
    return (
      '{' +
      Object.entries(JSONType.object)
        .map(([key, value]) => `"${key}"${value.optional ? '?' : ''}: ${JSONTypeToTSInterface(value)}`)
        .join(';') +
      '}'
    );

  return 'any';
};
