export type CommectionRequest<RequestExpr> =
  | {
      readonly type: "editorHtml";
      readonly functionOrType: FunctionOrType | undefined;
    }
  | {
      readonly type: "editorOgpImage";
      readonly functionOrType: FunctionOrType | undefined;
    }
  | {
      readonly type: "editorIcon";
    }
  | {
      readonly type: "editorScript";
    }
  | {
      readonly type: "editorAssetNotFound";
    }
  | {
      readonly type: "apiRequest";
      readonly expr: RequestExpr;
    };

export type FunctionOrType = Function | Type;

export type Function = {
  readonly type: "function";
  readonly functionId: string;
  readonly arguments: ReadonlyArray<Function>;
};
export type Type = {
  readonly type: "type";
  readonly typeId: string;
  readonly arguments: ReadonlyArray<Type>;
};

export type CommectionResponse = {
  readonly type: "editorHtml";
  readonly html: string;
};

export type RequestParseResult<RequestExpr> =
  | CommectionRequest<RequestExpr>
  | {
      readonly type: "skip";
    }
  | { readonly type: "error" };

export const handleRequest = <RequestExpr>(
  request: CommectionRequest<RequestExpr>
): CommectionResponse => {
  return {
    type: "editorHtml",
    html: "wip",
  };
};
