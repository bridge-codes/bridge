import ts from 'typescript';
import { isArrayWithPos } from './utils';
import { isTypeDepthGreaterThan } from './recursive-checker';
import { JSONTypeI, utilityTypes, primitives, JSONTypeObject } from '../../types';

const { log } = console;

export const createJSONType = (checker: ts.TypeChecker, type: ts.Type, node: ts.Node, depth: number = 0): JSONTypeI => {
  try {
    const typeString = checker.typeToString(type);

    if (typeString === 'ObjectId') {
      return { primitive: 'string' };
    }

    // if (typeString.endsWith('?')) console.log(typeString);

    // Depth 3 is the depth of the return
    if (depth === 7 && isTypeDepthGreaterThan(checker, type, node, 45))
      return { primitive: 'nested', value: typeString };

    if (type.isStringLiteral()) return { primitive: 'string', value: type.value };
    if (type.isNumberLiteral()) return { primitive: 'number', value: type.value };

    if (primitives.includes(typeString as any)) return { primitive: typeString as any };

    if (type.isIntersection())
      return {
        intersection: type.types.map((type) => createJSONType(checker, type, node, depth + 1)),
      };

    // If union includes primitive undefined, we remove it and returns optional: false (it's always an object on top so we can)
    if (type.isUnion()) {
      const unionElems = type.types.map((type) => createJSONType(checker, type, node, depth + 1));

      if (unionElems.find((elem) => 'primitive' in elem && elem.primitive === 'undefined'))
        return {
          union: unionElems.filter((elem) => !('primitive' in elem && elem.primitive === 'undefined')),
          optional: true,
        } as any;
      else return { union: unionElems };
    }

    if (type.symbol?.name === 'Array')
      return { array: createJSONType(checker, checker.getTypeArguments(type as any)?.[0], node, depth + 1) };

    if (isArrayWithPos(type) && type.symbol?.name !== 'Array' && typeString !== 'string')
      return {
        arrayWithPos: (type as any).resolvedTypeArguments.map((type: any) =>
          createJSONType(checker, type, node, depth + 1)
        ),
      };

    // If Promise --> Handle only the content because we're not supposed to have promises in the response
    if (type.symbol.name === 'Promise')
      return createJSONType(checker, (type as any).resolvedTypeArguments[0], node, depth + 1);
    if (type.aliasSymbol?.name === 'Record')
      return {
        record: {
          key: createJSONType(checker, (type.aliasTypeArguments as any)[0] as any, node, depth + 1),
          value: createJSONType(checker, (type.aliasTypeArguments as any)[1] as any, node, depth + 1),
        },
      };
    // For types like those: {[key: string | symbol]: string | { ah?: 'yo' }}
    if (
      type.symbol?.name === '__type' &&
      (type as any)?.indexInfos.length > 0 &&
      (type as any)?.indexInfos[0].keyType
    ) {
      if ((type as any)?.indexInfos.length === 1) {
        return {
          record: {
            key: createJSONType(checker, (type as any)?.indexInfos[0].keyType, node, depth + 1),
            value: createJSONType(checker, (type as any)?.indexInfos[0].type, node, depth + 1),
          },
        };
      } else
        return {
          record: {
            key: {
              intersection: (type as any)?.indexInfos.map((t: any) =>
                createJSONType(checker, t.keyType, node, depth + 1)
              ),
            }, //reateJSONType((type as any)?.indexInfos[0].keyType, node, depth + 1),
            value: createJSONType(checker, (type as any)?.indexInfos[0].type, node, depth + 1),
          },
        };
    }

    if (utilityTypes.includes((type.aliasSymbol?.name || '') as any)) log('UTILITY TYPE:', type.aliasSymbol?.name);
    else if (type.isClassOrInterface() || ['__type', '__object'].includes(type.symbol?.name as any)) {
      const JSONTypeObj: JSONTypeObject = {};

      for (const property of type.getProperties()) {
        const keyName = property.escapedName.toString();
        const valueType = checker.getTypeOfSymbolAtLocation(property, node);

        // IF VALUE IS A FUNCTION --> SKIP
        if (valueType.getCallSignatures()?.length) continue;

        // IF KEY IS PRIVATE --> SKIP
        let privateAttribute: boolean = false;
        property.valueDeclaration?.forEachChild((child) => {
          if (child.kind === ts.SyntaxKind.PrivateKeyword) privateAttribute = true;
        });
        if (privateAttribute) continue;

        // if (keyName === 'typescript-sdk') return {} as any;
        //console.log(checker.typeToString(valueType));

        // console.log(keyName, property.name);

        JSONTypeObj[keyName] = {
          optional: (property.valueDeclaration as any)?.questionToken !== undefined,
          ...createJSONType(checker, valueType, node, depth + 1),
        };
      }

      return { object: JSONTypeObj };
    }

    return { primitive: 'unrecognized' } as JSONTypeI;
  } catch (err) {
    console.error(err);
    return { primitive: 'unrecognized' };
  }
};
