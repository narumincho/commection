import { PhantomData, createPhantomData } from "../phantom.ts";
import { requestToSimpleRequest } from "../simpleHttpType/requestToSimpleRequest.ts";
import { simpleResponseToResponse } from "../simpleHttpType/simepleResponseToResponse.ts";
import { commectionResponseToSimpleResponse } from "./commectionResponseToSimpleResponse.ts";
import { handleRequest } from "./server.ts";
import { simpleRequestToCommectionRequest } from "./simpleRequestToCommectionRequest.ts";

export const heandleCommectionRequest = (
  request: Request
): Response | undefined => {
  const simpleRequest = requestToSimpleRequest(request);
  if (simpleRequest === undefined) {
    return new Response("Bad Request", { status: 400 });
  }
  const commectionRequest = simpleRequestToCommectionRequest({
    simpleRequest,
    iconHash: "wip",
    scriptHash: "wip",
    pathPrefix: ["wip"],
    requestExprParser: () => undefined,
    schema: {
      name: "wip",
      functionDefinitions: [],
      typeDefinitions: [],
      requestExpr: createPhantomData(),
    },
  });
  if (commectionRequest.type === "skip") {
    return undefined;
  }
  if (commectionRequest.type === "error") {
    return new Response("Internal Server Error", { status: 500 });
  }
  const commectionResponse = handleRequest(commectionRequest);
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
