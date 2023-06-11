import { serve } from "https://deno.land/std@0.191.0/http/server.ts";
import { heandleCommectionRequest } from "../commection/main.ts";
import { createPhantomData } from "../phantom.ts";

serve(
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
  { port: 8000 }
);
