import { rawJsonToStructuredJsonValue } from "../typedJson.ts";
import { SimpleRequest } from "./request.ts";
import { urlToSimpleUrl } from "./url.ts";

export const requestToSimpleRequest = (
  request: Request,
): SimpleRequest | undefined => {
  switch (request.method) {
    case "GET": {
      return {
        method: "get",
        url: urlToSimpleUrl(new URL(request.url)),
      };
    }
    case "OPTION": {
      return {
        method: "option",
        url: urlToSimpleUrl(new URL(request.url)),
      };
    }
    case "POST": {
      return {
        method: "post",
        url: urlToSimpleUrl(new URL(request.url)),
        bodyLazy: async () =>
          rawJsonToStructuredJsonValue(await request.json()),
      };
    }
  }
};
