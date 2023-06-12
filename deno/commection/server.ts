import { StructuredHtml } from "../html/data.ts";
import dist from "../dist.json" assert { type: "json" };
import { div } from "../html/interface.ts";

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

export type CommectionResponse =
  | {
      readonly type: "editorHtml";
      readonly html: StructuredHtml;
    }
  | {
      readonly type: "editorIcon";
    }
  | {
      readonly type: "editorScript";
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
}): StructuredHtml => ({
  appName: "commection",
  pageName: "commection",
  description: "commection",
  ietfLanguageTag: "en",
  twitterCard: "SummaryCard",
  coverImageUrl: new URL(parameter.origin + "/cover.png"),
  iconUrl: new URL(
    parameter.origin +
      `/${parameter.pathPrefix.join("/")}/editor-assets/icon-${
        dist.iconHash
      }.png`
  ),
  scriptUrlList: [
    new URL(
      parameter.origin +
        `/${parameter.pathPrefix.join("/")}/editor-assets/script-${
          dist.scriptHash
        }.js`
    ),
  ],
  themeColor: undefined,
  url: undefined,
  children: [div({ id: "root" }, [])],
});

export const handleRequest = <RequestExpr>(parameter: {
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
