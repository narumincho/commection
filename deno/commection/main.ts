import { PhantomData } from "../phantom.ts";
import { commectionResponseToSimpleResponse } from "./commectionResponseToSimpleResponse.ts";
import { handleRequest } from "./server.tsx";
import { requestToCommectionRequest } from "./simpleRequestToCommectionRequest.ts";

export const heandleCommectionRequest = <RequestExpr>(
  { request, schema, pathPrefix }: {
    readonly request: Request;
    readonly schema: Schema<RequestExpr>;
    readonly pathPrefix: ReadonlyArray<string>;
  },
): Response | undefined => {
  const commectionRequest = requestToCommectionRequest({
    request,
    pathPrefix,
    requestExprParser: () => undefined,
    schema,
  });
  if (commectionRequest.type === "skip") {
    return undefined;
  }
  if (commectionRequest.type === "error") {
    return new Response("Internal Commection Server Error", { status: 500 });
  }
  const commectionResponse = handleRequest({
    request: commectionRequest,
    origin: request.url.origin,
    pathPrefix,
  });
  if (commectionResponse === undefined) {
    return undefined;
  }
  const simpleResponse = commectionResponseToSimpleResponse(commectionResponse);
  const response = simpleResponseToResponse(simpleResponse);
  return response;
};

export type Server<RequestExpr> = {
  readonly schema: Schema<RequestExpr>;
};

export type Schema<RequestExpr> = {
  readonly name: string;
  readonly typeDefinitions: ReadonlyArray<TypeDefinition>;
  readonly functionDefinitions: ReadonlyArray<FunctionDefinition>;
  readonly requestExpr: PhantomData<RequestExpr>;
};

export type TypeDefinition = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly attribute: TypeAttribute | undefined;
  readonly body: TypeStructure;
};

export type TypeAttribute = "";

export type TypeStructure =
  | {
    readonly type: "sum";
    readonly pattern: ReadonlyArray<Pattern>;
  }
  | {
    readonly type: "product";
    readonly fields: ReadonlyArray<Field>;
  };

export type Pattern = {
  readonly type: Type;
  readonly parameter: ReadonlyArray<string>;
  readonly arguments: ReadonlyArray<Type>;
};

export type Field = {
  readonly name: string;
  readonly description: string;
  readonly type: Type;
};

export type FunctionDefinition = {
  readonly name: string;
  readonly parameters: ReadonlyArray<FunctionParameter>;
  readonly resultType: Type;
  readonly typeParameter: ReadonlyArray<string>;
};

export type FunctionParameter = {
  readonly name: string;
  readonly type: Type;
};

export type Type = {
  readonly id: string;
  readonly arguments: ReadonlyArray<Type>;
};
