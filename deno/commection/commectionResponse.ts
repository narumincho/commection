export type CommectionResponse =
  | {
    readonly type: "editorHtml";
    readonly html: Promise<ReadableStream<Uint8Array>>;
  }
  | {
    readonly type: "editorIcon";
  }
  | {
    readonly type: "editorScript";
  };
