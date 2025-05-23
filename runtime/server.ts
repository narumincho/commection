import type {
  ByIdSetResponseBody,
  JsonValue,
  OneResponseBody,
  ResponseError,
  ResponseErrorType,
} from "./common.ts";

export const startWithAndPickToEnd = (
  str: string,
  start: string,
): string | undefined => {
  if (str.startsWith(start)) {
    return str.slice(start.length);
  }
  return undefined;
};

/**
 * 鍵からアカウントを特定できなかった場合に投げるエラー
 *
 * このエラーを受け取ったクライアントは, 保存された鍵を削除して, ログイン画面を表示する
 */
export class InvalidAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAuthError";
  }
}

/**
 * 鍵が必要な操作を行おうとしたが, 鍵がなかった場合に投げるエラー
 */
export class NeedAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NeedAuthError";
  }
}

/**
 * 鍵があるが, その鍵での操作が許可されていなかった場合に投げるエラー
 */
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * リソースが見つからなかった場合に投げるエラー
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * パラメーターの指定方法が間違っていたときに投げるエラー
 */
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export const errorToResponseError = (error: Error): ResponseError => {
  if (error instanceof InvalidAuthError) {
    return {
      message: error.message,
      code: "invalidAuth",
    };
  }
  if (error instanceof NeedAuthError) {
    return {
      message: error.message,
      code: "needAuth",
    };
  }
  if (error instanceof ForbiddenError) {
    return {
      message: error.message,
      code: "forbidden",
    };
  }
  if (error instanceof NotFoundError) {
    return {
      message: error.message,
      code: "notFound",
    };
  }
  if (error instanceof BadRequestError) {
    return {
      message: error.message,
      code: "badRequest",
    };
  }
  return {
    message: error.message,
  };
};

export const createByIdSetResponse = <
  Id extends string,
  Resource extends JsonValue,
>(
  idSet: ReadonlySet<Id>,
  result: ReadonlyMap<Id, Resource | Error>,
): Response => {
  const body: ByIdSetResponseBody = {
    type: "ok",
    data: [...idSet].map((id) => {
      const value = result.get(id);
      if (value instanceof Error) {
        return {
          id,
          type: "error",
          error: errorToResponseError(value),
        };
      }
      if (value === undefined) {
        return {
          id,
          type: "error",
          error: errorToResponseError(new NotFoundError("Not Found")),
        };
      }
      return {
        id,
        type: "ok",
        value,
      };
    }),
  };
  return createJsonResponse(body, "Ok");
};

export const createByFilterResponse = <
  Id extends string,
  Resource extends JsonValue,
>(
  result: ReadonlyMap<Id, Resource | Error>,
): Response => {
  return createJsonResponse({
    type: "ok",
    data: [...result].map(([id, value]) => {
      if (value instanceof Error) {
        return {
          id,
          type: "error",
          error: errorToResponseError(value),
        };
      }
      if (value === undefined) {
        return {
          id,
          type: "error",
          error: errorToResponseError(new NotFoundError("Not Found")),
        };
      }
      return {
        id,
        type: "ok",
        value,
      };
    }),
  }, "Ok");
};

export const createOneResponse = (
  data: OneResponseBody,
): Response => {
  return createJsonResponse(data, "Ok");
};

export const responseErrorTypeToHttpStatusCode = (
  responseErrorType: ResponseErrorType,
): HttpStatusCode => {
  switch (responseErrorType) {
    case "invalidAuth":
    case "needAuth":
      return "Unauthorized";
    case "forbidden":
      return "Forbidden";
    case "notFound":
      return "NotFound";
    case "badRequest":
      return "BadRequest";
  }
};

type HttpStatusCode =
  | "Ok"
  | "BadRequest"
  | "Unauthorized"
  | "Forbidden"
  | "NotFound"
  | "InternalServerError";

const statusCodeNumber = (code: HttpStatusCode): number => {
  switch (code) {
    case "Ok":
      return 200;
    case "BadRequest":
      return 400;
    case "Unauthorized":
      return 401;
    case "Forbidden":
      return 403;
    case "NotFound":
      return 404;
    case "InternalServerError":
      return 500;
  }
};

export const createJsonResponse = (
  data: JsonValue,
  status: HttpStatusCode,
): Response => {
  return new Response(safeJsonStringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    status: statusCodeNumber(status),
  });
};

const safeJsonStringify = (data: JsonValue): string => JSON.stringify(data);
