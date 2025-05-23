import { SimpleResponse, SimpleResponseBody } from "./response.ts";

export const simpleResponseToResponse = async (
  simpleResponse: SimpleResponse,
): Promise<Response> => {
  switch (simpleResponse.status) {
    case "ok":
      return new Response(await simpleResponseBodyToBody(simpleResponse.body), {
        headers: {
          "content-type": simpleResponseBodyToContentType(simpleResponse.body),
        },
      });
    case "notFoundError":
      return new Response("Not found", { status: 404 });
  }
};

const simpleResponseBodyToBody = async (
  simpleResponseBody: SimpleResponseBody,
): Promise<BodyInit> => {
  switch (simpleResponseBody.type) {
    case "html":
      return await simpleResponseBody.html;
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
