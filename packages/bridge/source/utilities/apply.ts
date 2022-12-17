import { BridgeHandler } from '../core';
import { UnionToArray } from './types';

// transform an array into an array as const
type Apply = <B extends string | BridgeHandler, T extends Array<B>>(
  ...args: T
) => B extends string ? UnionToArray<T[number]> : UnionToArray<T[number]>;

export const apply: Apply = (...args) => args as any;
