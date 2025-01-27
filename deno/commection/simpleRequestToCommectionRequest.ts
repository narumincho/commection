import { stringArrayEqual, stringArrayMatchPrefix } from "../listUtil.ts";
import { Schema } from "./main.ts";
import { FunctionOrType, RequestParseResult } from "./server.tsx";
import dist from "../dist.json" with { type: "json" };

export const requestToCommectionRequest = <RequestExpr>(
  { request, schema, pathPrefix, requestExprParser }: {
    readonly request: Request;
    readonly schema: Schema<RequestExpr>;
    readonly pathPrefix: string;
    readonly requestExprParser: (path: string) => RequestExpr | undefined;
  },
): RequestParseResult<RequestExpr> => {
  // /
  if (new URLPattern({ pathname: `${pathPrefix}/` }).test(request.url)) {
    return { type: "skip" };
  }
  // /{prefix}
  if (new URLPattern({ pathname: `${pathPrefix}/` }).test(request.url)) {
    return { type: "editorHtml", functionOrType: undefined };
  }

  // /{prefix}/editor/function/:name/{arguments}?{argumentsKey=argumentsValue}
  const editorFunctionPattern = new URLPattern({
    pathname: `${pathPrefix}/editor/function/:name/:arguments?`,
  }).exec(request.url);

  if (editorFunctionPattern) {
    const name = editorFunctionPattern.pathname.groups["name"];
    return {
      type: "editorHtml",
      functionOrType: name
        ? {
          type: "function",
          functionId: name,
          arguments: [],
        }
        : undefined,
    };
  }

  // /{prefix}/editor/function/{name?}/{arguments}?{argumentsKey=argumentsValue}
  const editorFunctionPattern = new URLPattern({
    pathname: `${pathPrefix}/editor/function/:name/:arguments?`,
  }).exec(request.url);

  if (editorFunctionPattern) {
    const name = editorFunctionPattern.pathname.groups["name"];
    return {
      type: "editorHtml",
      functionOrType: name
        ? {
          type: "function",
          functionId: name,
          arguments: [],
        }
        : undefined,
    };
  }

  // /{prefix}/editor-assets
  const editorAssetsSuffix = stringArrayMatchPrefix(pathListRemovePrefix, [
    "editor-assets",
  ]);
  if (editorAssetsSuffix !== undefined) {
    // /{prefix}/editor-assets/icon-hash.png
    if (stringArrayEqual(editorAssetsSuffix, [`icon-${dist.iconHash}.png`])) {
      return { type: "editorIcon" };
    }
    // /{prefix}/editor-assets/script-hash.js
    if (
      stringArrayEqual(editorAssetsSuffix, [`script-${dist.scriptHash}.js`])
    ) {
      return { type: "editorScript" };
    }
    // /{prefix}/editor-assets/ogp/
    const ogpSuffix = stringArrayMatchPrefix(editorAssetsSuffix, ["ogp"]);
    if (ogpSuffix !== undefined) {
      return {
        type: "editorOgpImage",
        functionOrType: getFunctionOrTypeFromSubPath(ogpSuffix),
      };
    }
    return { type: "editorAssetNotFound" };
  }

  // /{prefix}/api/{functionName}
  const apiSuffix = stringArrayMatchPrefix(pathListRemovePrefix, ["api"]);
  if (apiSuffix !== undefined) {
    const expr = parameter.requestExprParser("wip");
    if (expr === undefined) {
      return {
        type: "error",
      };
    }
    return {
      type: "apiRequest",
      expr: expr,
    };
  }

  return { type: "skip" };
};

const getFunctionOrTypeFromSubPath = (
  subPath: ReadonlyArray<string>,
): FunctionOrType | undefined => {
  // ./function/{functionId}/{arguments}?{argumentsKey=argumentsValue}
  const functionSuffix = stringArrayMatchPrefix(subPath, ["function"]);
  if (functionSuffix) {
    const functionId = functionSuffix[0];
    return functionId === undefined
      ? undefined
      : { type: "function", functionId, arguments: [] };
  }
  // ./type/{typeId}/{arguments}?{argumentsKey=argumentsValue}
  const typeSuffix = stringArrayMatchPrefix(subPath, ["type"]);
  if (typeSuffix) {
    const typeId = typeSuffix[0];
    return typeId === undefined
      ? undefined
      : { type: "type", typeId, arguments: [] };
  }
};
