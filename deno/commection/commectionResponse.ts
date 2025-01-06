export type CommectionResponse =
  | {
    readonly type: "editorHtml";
    readonly html: string;
  }
  | {
    readonly type: "editorIcon";
  }
  | {
    readonly type: "editorScript";
  };
