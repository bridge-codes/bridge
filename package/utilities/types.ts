import { BridgeHandler } from '../core/handlers';

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type KeysWithValNotNever<T> = keyof { [P in keyof T as T[P] extends never ? never : P]: P };

export type ExcludeNeverKeys<T> = { [key in KeysWithValNotNever<T> & keyof T]: T[key] };

export type KeysWithValNotEmptyObject<T> = keyof {
  [P in keyof T as keyof T[P] extends never ? never : P]: P;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MidsReturnsIntersection
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type Values<T> = T[keyof T];

type Unfoo<T> = T extends { foo: any } ? T['foo'] : never;

type RemoveError<T> = T extends { error: any } ? never : T;

type NFooWithoutError<T extends Readonly<BridgeHandler[]>> = {
  [K in keyof T]: T[K] extends BridgeHandler<(arg: any) => infer Output, any>
    ? { foo: RemoveError<Output> }
    : never;
};

type NFooWithoutErrorParams<T extends Readonly<BridgeHandler[]>> = {
  [K in keyof T]: T[K] extends BridgeHandler<(arg: infer Input) => any, any>
    ? { foo: RemoveError<Input> }
    : never;
};

export type MidsReturnsIntersection<T extends Readonly<any[]>> = Unfoo<
  UnionToIntersection<Values<NFooWithoutError<T>>>
>;

export type MidsParams<T extends Readonly<any[]>> = Unfoo<
  UnionToIntersection<Values<NFooWithoutErrorParams<T>>>
>;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// APPLY --> Take an array and make it as const
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];
