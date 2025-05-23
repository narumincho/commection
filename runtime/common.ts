export const assertBrandString = <T extends string>(id: string): T => id as T;

export const unknownToError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error(`${error}`);
};

export type ResponseError = {
  readonly message: string;
  readonly code?: ResponseErrorType;
};

export type ResponseErrorType =
  | "invalidAuth"
  | "needAuth"
  | "forbidden"
  | "notFound"
  | "badRequest";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { readonly [key in string]: JsonValue }
  | ReadonlyArray<JsonValue>;

export type ByIdSetResponseBody = {
  readonly type: "ok";
  readonly data: ReadonlyArray<
    {
      readonly id: string;
      readonly type: "ok";
      readonly value: JsonValue;
    } | {
      readonly id: string;
      readonly type: "error";
      readonly error: ResponseError;
    }
  >;
} | ErrorBody;

export type ByFilterResponseBody = {
  readonly type: "ok";
  readonly data: ReadonlyArray<
    {
      readonly id: string;
      readonly type: "ok";
      readonly value: JsonValue;
    } | {
      readonly id: string;
      readonly type: "error";
      readonly error: ResponseError;
    }
  >;
  // ページング情報がここに追加される予定
} | ErrorBody;

export type OneResponseBody = {
  readonly type: "ok";
  readonly value: JsonValue;
} | ErrorBody;

export type ErrorBody = {
  readonly type: "error";
  readonly error: ResponseError;
};

export type OrderedMap<K, V> = ReadonlyMap<K, V>;
