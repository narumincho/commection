import { stringArrayEqual, stringArrayMatchPrefix } from "../listUtil.ts";
import { SimpleRequest } from "../simpleHttpType/request.ts";
import { Schema } from "./main.ts";

export type CommectionRequest<RequestExpr> = {
  readonly type: "editorHtml";
  readonly functionOrType: FunctionOrType | undefined;
} | {
  readonly type: "editorOgpImage";
  readonly functionOrType: FunctionOrType | undefined;
} | {
  readonly type: "editorIcon";
} | {
  readonly type: "editorScript";
} | {
  readonly type: "editorAssetNotFound";
} | {
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

export type CommectionResponse = {};

export type RequestParseResult<RequestExpr> = CommectionRequest<RequestExpr> | {
  readonly type: "skip";
} | { readonly type: "error" };
