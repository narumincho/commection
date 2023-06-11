export type SimpleResponse =
  | {
      readonly status: "ok";
      readonly body: string;
    }
  | {
      readonly status: "notFoundError";
    };
