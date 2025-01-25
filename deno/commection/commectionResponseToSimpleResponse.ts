import { SimpleResponse } from "../simpleHttpType/response.ts";
import dist from "../dist.json" with { type: "json" };
import { decodeBase64 } from "jsr:@std/encoding";
import { CommectionResponse } from "./commectionResponse.ts";

const iconContent = decodeBase64(dist.iconBase64Content);

export const commectionResponseToSimpleResponse = (
  commectionResponse: CommectionResponse,
): SimpleResponse => {
  switch (commectionResponse.type) {
    case "editorHtml":
      return {
        status: "ok",
        body: {
          type: "html",
          html: commectionResponse.html,
        },
      };
    case "editorIcon":
      return {
        status: "ok",
        body: {
          type: "png",
          png: iconContent,
        },
      };
    case "editorScript":
      return {
        status: "ok",
        body: {
          type: "js",
          js: dist.scriptContent,
        },
      };
  }
};
