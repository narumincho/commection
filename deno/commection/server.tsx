import { App } from "../editor/component/app.tsx";
import { CommectionResponse } from "./commectionResponse.ts";
// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:@types/react-dom/server"
import { renderToReadableStream, renderToString } from "npm:react-dom/server";

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

export type RequestParseResult<RequestExpr> =
  | CommectionRequest<RequestExpr>
  | {
    readonly type: "skip";
  }
  | { readonly type: "error" };

const createHtml = (parameter: {
  readonly pathPrefix: ReadonlyArray<string>;
  readonly origin: string;
}): Promise<ReadableStream<Uint8Array>> =>
  renderToReadableStream(
    <App origin={parameter.origin} pathPrefix={parameter.pathPrefix} />,
  );

export const handleRequest = <RequestExpr,>(parameter: {
  readonly request: CommectionRequest<RequestExpr>;
  readonly pathPrefix: ReadonlyArray<string>;
  readonly origin: string;
}): CommectionResponse => {
  switch (parameter.request.type) {
    case "editorHtml":
      return {
        type: "editorHtml",
        html: createHtml({
          origin: parameter.origin,
          pathPrefix: parameter.pathPrefix,
        }),
      };

    case "editorOgpImage":
      return {
        type: "editorIcon",
      };
    case "editorIcon":
      return {
        type: "editorIcon",
      };
    case "editorScript":
      return {
        type: "editorScript",
      };
    case "editorAssetNotFound":
      return {
        type: "editorHtml",
        html: createHtml({
          origin: parameter.origin,
          pathPrefix: parameter.pathPrefix,
        }),
      };

    case "apiRequest":
      return {
        type: "editorHtml",
        html: createHtml({
          origin: parameter.origin,
          pathPrefix: parameter.pathPrefix,
        }),
      };
  }
};
