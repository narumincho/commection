export type SimpleResponse =
  | {
    readonly status: "ok";
    readonly body: SimpleResponseBody;
  }
  | {
    readonly status: "notFoundError";
  };

export type SimpleResponseBody =
  | {
    readonly type: "html";
    readonly html: Promise<ReadableStream<Uint8Array<ArrayBufferLike>>>;
  }
  | {
    readonly type: "png";
    readonly png: Uint8Array;
  }
  | {
    readonly type: "js";
    readonly js: string;
  };
