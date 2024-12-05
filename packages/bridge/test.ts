// import { handler, apply, httpError } from './source';
// import { BridgeHandler } from './source/core';
// import { z } from 'zod';

// const middleware = handler({
//   resolve: () => ({ status: 200, res: 'Hello, world!' }),
// });

// const middleware2 = handler({
//   body: z.object({ last: z.string() }),
//   resolve: ({ body }) => {
//     if (body.last === 'last') return httpError(400, 'last is not allowed');
//     return { brooo: 'brooo' };
//   },
// });

// const query = handler({
//   middlewares: [middleware, middleware2] as const,
//   body: z.object({ name: z.string() }),
//   resolve: (data) => {},
// });

// type TEST = readonly [
//   BridgeHandler<
//     () => {
//       brooo: string;
//     },
//     never
//   >,
//   BridgeHandler<
//     () => {
//       status: number;
//       body: string;
//     },
//     never
//   >,
// ];

// export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
//   k: infer I,
// ) => void
//   ? I
//   : never;

// // Generic type to get the intersection of return types of an array of BridgeHandler
// type UnionOfResolveReturnTypes<T extends ReadonlyArray<BridgeHandler<any, any>>> =
//   T extends ReadonlyArray<BridgeHandler<infer F, any>> ? ReturnType<F> : never;

// type Result = UnionToIntersection<UnionOfResolveReturnTypes<TEST>>;
