import { heandleCommectionRequest } from "../commection/main.ts";
import { createPhantomData } from "../phantom.ts";

Deno.serve(
  { port: 8000 },
  (request) => {
    const response = heandleCommectionRequest({
      request,
      pathPrefix: [],
      schema: {
        name: "wip",
        typeDefinitions: [],
        functionDefinitions: [],
        requestExpr: createPhantomData(),
      },
    });
    if (response === undefined) {
      return new Response("Not Found", { status: 404 });
    }
    return response;
  },
);
