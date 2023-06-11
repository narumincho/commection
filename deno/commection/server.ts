import { StructuredHtml } from "../html/data.ts";
import dist from "../dist.json" assert { type: "json" };

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

export const handleRequest = <RequestExpr>(parameter: {
  readonly request: CommectionRequest<RequestExpr>;
  readonly pathPrefix: ReadonlyArray<string>;
  readonly origin: string;
}): CommectionResponse => {
  return {
    type: "editorHtml",
    html: {
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
            `/${parameter.pathPrefix.join("/")}/editor-assets/icon-${
              dist.scriptHash
            }.js`
        ),
      ],
      themeColor: undefined,
      url: undefined,
      children: [],
    },
  };
};
