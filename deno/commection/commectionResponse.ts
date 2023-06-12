import { StructuredHtml } from "../html/data.ts";

export type CommectionResponse =
  | {
      readonly type: "editorHtml";
      readonly html: StructuredHtml;
    }
  | {
      readonly type: "editorIcon";
    }
  | {
      readonly type: "editorScript";
    };
