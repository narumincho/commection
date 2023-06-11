import { SimpleResponse } from "./response.ts";

export const simpleResponseToResponse = (
  simpleResponse: SimpleResponse
): Response => {
  switch (simpleResponse.status) {
    case "ok":
      return new Response(simpleResponse.body);
    case "notFoundError":
      return new Response("Not found", { status: 404 });
  }
};
