import { BridgeHandler } from '../core';

/**
 * The only purpose of this class is to not perturbate people if they want to check what's the type of the routes object
 * */
export class BridgeMethod<
  BHGet extends BridgeHandler = any,
  BHPost extends BridgeHandler = any,
  BHPatch extends BridgeHandler = any,
  BHPut extends BridgeHandler = any,
  BHDelete extends BridgeHandler = any,
> {
  public isBridgeMethodObject = true;
  public type!: {
    getBridgeMehthodSDK: BHGet;
    postBridgeMehthodSDK: BHPost;
    patchBridgeMehthodSDK: BHPatch;
    putBridgeMehthodSDK: BHPut;
    deleteBridgeMehthodSDK: BHDelete;
  };

  constructor(
    public methods: {
      GET?: BHGet;
      POST?: BHPost;
      PATCH?: BHPatch;
      PUT?: BHPut;
      DELETE?: BHDelete;
    },
  ) {
    if (methods.GET?.config.bodySchema) throw Error("You can't have a body with a GET endpoint");
  }
}

export const isBridgeMethod = (obj: any): obj is BridgeMethod =>
  typeof obj === 'object' && obj.isBridgeMethodObject === true;

export const method = <
  BHGet extends BridgeHandler = any,
  BHPost extends BridgeHandler = any,
  BHPatch extends BridgeHandler = any,
  BHPut extends BridgeHandler = any,
  BHDelete extends BridgeHandler = any,
>(p: {
  GET?: BHGet;
  POST?: BHPost;
  PATCH?: BHPatch;
  PUT?: BHPut;
  DELETE?: BHDelete;
}) => new BridgeMethod(p);

const handler = new BridgeHandler({ resolve: () => 'Salut' as const });

const test = method({ GET: handler });

type AHJ = typeof test.type;
