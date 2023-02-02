import { BridgeHandler } from '../core';

export class BridgeMethod<
  BHGet extends BridgeHandler | null,
  BHPost extends BridgeHandler | null,
  BHPatch extends BridgeHandler | null,
  BHPut extends BridgeHandler | null,
  BHDelete extends BridgeHandler | null,
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

export const isBridgeMethod = (obj: any): obj is BridgeMethod<any, any, any, any, any> =>
  typeof obj === 'object' && obj.isBridgeMethodObject === true;

export const method = <
  BHGet extends BridgeHandler | null = null,
  BHPost extends BridgeHandler | null = null,
  BHPatch extends BridgeHandler | null = null,
  BHPut extends BridgeHandler | null = null,
  BHDelete extends BridgeHandler | null = null,
>(p: {
  GET?: BHGet;
  POST?: BHPost;
  PATCH?: BHPatch;
  PUT?: BHPut;
  DELETE?: BHDelete;
}) => new BridgeMethod(p);
