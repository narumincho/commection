import { StructuredHtml } from "../html/data.ts";

export type SimpleResponse =
  | {
      readonly status: "okHtml";
      readonly body: StructuredHtml;
    }
  | {
      readonly status: "notFoundError";
    };
