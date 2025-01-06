import { SimpleResponse, SimpleResponseBody } from "./response.ts";

export const simpleResponseToResponse = (
  simpleResponse: SimpleResponse,
): Response => {
  switch (simpleResponse.status) {
    case "ok":
      return new Response(simpleResponseBodyToBody(simpleResponse.body), {
        headers: {
          "content-type": simpleResponseBodyToContentType(simpleResponse.body),
        },
      });
    case "notFoundError":
      return new Response("Not found", { status: 404 });
  }
};

const simpleResponseBodyToBody = (
  simpleResponseBody: SimpleResponseBody,
): Uint8Array => {
  switch (simpleResponseBody.type) {
    case "html":
      return new TextEncoder().encode(simpleResponseBody.html);
    case "png":
      return simpleResponseBody.png;
    case "js":
      return new TextEncoder().encode(simpleResponseBody.js);
  }
};

const simpleResponseBodyToContentType = (
  simpleResponseBody: SimpleResponseBody,
): string => {
  switch (simpleResponseBody.type) {
    case "html":
      return "text/html";
    case "png":
      return "image/png";
    case "js":
      return "text/javascript";
  }
};
