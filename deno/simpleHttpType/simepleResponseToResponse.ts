import { structuredHtmlToString } from "../html/toString.ts";
import { SimpleResponse } from "./response.ts";

export const simpleResponseToResponse = (
  simpleResponse: SimpleResponse
): Response => {
  switch (simpleResponse.status) {
    case "okHtml":
      return new Response(structuredHtmlToString(simpleResponse.body), {
        headers: { "content-type": "text/html" },
      });
    case "notFoundError":
      return new Response("Not found", { status: 404 });
  }
};
