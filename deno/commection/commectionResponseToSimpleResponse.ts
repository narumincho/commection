import { SimpleResponse } from "../simpleHttpType/response.ts";
import dist from "../dist.json" with { type: "json" };
import { decode } from "https://deno.land/std@0.191.0/encoding/base64.ts";
import { CommectionResponse } from "./commectionResponse.ts";

const iconContent = decode(dist.iconBase64Content);

export const commectionResponseToSimpleResponse = (
  commectionResponse: CommectionResponse
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
