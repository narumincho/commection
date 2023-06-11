import { serve } from "https://deno.land/std@0.191.0/http/server.ts";
import { heandleCommectionRequest } from "../commection/main.ts";

serve(
  (request) => {
    const response = heandleCommectionRequest(request);
    if (response === undefined) {
      return new Response("Not Found", { status: 404 });
    }
    return response;
  },
  { port: 8000 }
);
