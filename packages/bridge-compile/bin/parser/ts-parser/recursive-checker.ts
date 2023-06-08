import ts from 'typescript';
import { utilityTypes } from '../../types';
import { isArrayWithPos } from './utils';

export const isTypeDepthGreaterThan = (
  checker: ts.TypeChecker,
  type: ts.Type,
  node: ts.Node,
  maxDepth: number,
  depth = 0
): boolean => {
  try {
    if (depth > maxDepth) return true;

    if (checker.typeToString(type) === 'ObjectId') return false;

    if (type.isUnionOrIntersection())
      for (const t of type.types) {
        if (isTypeDepthGreaterThan(checker, t, node, maxDepth, depth + 1)) return true;
      }

    if (
      !utilityTypes.includes((type.aliasSymbol?.name || '') as any) &&
      (type.isClassOrInterface() || ['__type', '__object'].includes(type.symbol?.name as any))
    )
      for (const property of type.getProperties()) {
        const valueType = checker.getTypeOfSymbolAtLocation(property, node);
        if (isTypeDepthGreaterThan(checker, valueType, node, maxDepth, depth + 1)) return true;
      }

    if (
      type.symbol?.name === 'Array' &&
      isTypeDepthGreaterThan(checker, checker.getTypeArguments(type as any)?.[0], node, maxDepth, depth + 1)
    )
      return true;

    if (isArrayWithPos(type) && type.symbol?.name !== 'Array' && checker.typeToString(type) !== 'string')
      for (const t of (type as any).resolvedTypeArguments || [])
        if (isTypeDepthGreaterThan(checker, t, node, maxDepth, depth + 1)) return true;

    return false;
  } catch (err) {
    console.error(err);
    return true;
  }
};
