import { stringArrayEqual, stringArrayMatchPrefix } from "../listUtil.ts";
import { SimpleRequest } from "../simpleHttpType/request.ts";
import { Schema } from "./main.ts";
import { FunctionOrType, RequestParseResult } from "./server.ts";
import dist from "../dist.json" with { type: "json" };

export const simpleRequestToCommectionRequest = <RequestExpr>(parameter: {
  readonly simpleRequest: SimpleRequest;
  readonly schema: Schema<RequestExpr>;
  readonly pathPrefix: ReadonlyArray<string>;
  readonly requestExprParser: (path: string) => RequestExpr | undefined;
}): RequestParseResult<RequestExpr> => {
  if (parameter.simpleRequest === undefined) {
    return { type: "skip" };
  }

  const pathListRemovePrefix = stringArrayMatchPrefix(
    parameter.simpleRequest.url.pathSegments,
    parameter.pathPrefix
  );
  // /
  if (pathListRemovePrefix === undefined) {
    return { type: "skip" };
  }
  // /{prefix}
  if (pathListRemovePrefix.length === 0) {
    return { type: "editorHtml", functionOrType: undefined };
  }

  // /{prefix}/editor/{"function" | "type"}/{name?}/{arguments}?{argumentsKey=argumentsValue}
  const editorSuffix = stringArrayMatchPrefix(pathListRemovePrefix, [
    "editor",
    "function",
  ]);
  if (editorSuffix !== undefined) {
    return {
      type: "editorHtml",
      functionOrType: getFunctionOrTypeFromSubPath(editorSuffix),
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
  subPath: ReadonlyArray<string>
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
