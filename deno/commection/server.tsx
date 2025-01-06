import dist from "../dist.json" with { type: "json" };
import { CommectionResponse } from "./commectionResponse.ts";
// @ts-types="npm:@types/react"
import React from "npm:react";
// @ts-types="npm:@types/react-dom/server"
import { renderToString } from "npm:react-dom/server";

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
}): string =>
  renderToString(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>commection</title>
        <meta name="description" content="commection" />
        <link
          rel="icon"
          href={new URL(
            parameter.origin +
              `/${
                parameter.pathPrefix.join("/")
              }/editor-assets/icon-${dist.iconHash}.png`,
          ).toString()}
        />
        <meta name="twitter:card" content="summary" />
        <meta property="og:title" content="commection" />
        <meta property="og:site_name" content="commection" />
        <meta property="og:description" content="commection" />
        <meta
          property="og:image"
          content={new URL(parameter.origin + "/cover.png").toString()}
        />
        <script
          type="module"
          src={new URL(
            parameter.origin +
              `/${
                parameter.pathPrefix.join("/")
              }/editor-assets/script-${dist.scriptHash}.js`,
          ).toString()}
        />
      </head>
      <body>
        <noscript>
          commection では JavaScript を使用します.
          ブラウザの設定で有効にしてください.
        </noscript>
        <div id="root">
          <div>
            APIドキュメントはSSRするのが理想だな. データはSSRしないほうが良い
          </div>
        </div>
      </body>
    </html>,
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
