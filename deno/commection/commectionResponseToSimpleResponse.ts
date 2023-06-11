import { SimpleResponse } from "../simpleHttpType/response.ts";
import { CommectionResponse } from "./server.ts";

export const commectionResponseToSimpleResponse = (
  commectionResponse: CommectionResponse
): SimpleResponse => {
  return {
    status: "ok",
    body: commectionResponse.html,
  };
};
