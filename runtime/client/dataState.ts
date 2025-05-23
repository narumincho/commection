import type { RequestPhase } from "../client.ts";
import type { ResponseError } from "../common.ts";

export type DataState<out Resource> = {
  readonly requestPhase: RequestPhase;
  readonly lastError: ResponseError | undefined;
  readonly data: Resource | undefined;
};

export const dataStateNone: DataState<never> = {
  requestPhase: "waitForRequest",
  lastError: undefined,
  data: undefined,
};

export type Operation<Resource> = {
  readonly type: "requesting" | "waitForRequest";
} | {
  readonly type: "ok";
  readonly data: Resource;
} | {
  readonly type: "error";
  readonly error: ResponseError;
} | {
  readonly type: "updateData";
  readonly func: (prev: Resource | undefined) => Resource | undefined;
};

export const updateDataState = <Resource>(
  prev: DataState<Resource>,
  operation: Operation<Resource>,
): DataState<Resource> => {
  switch (operation.type) {
    case "waitForRequest":
      return {
        requestPhase: "waitForRequest",
        lastError: prev.lastError,
        data: prev.data,
      };
    case "requesting":
      return {
        requestPhase: "requesting",
        lastError: prev.lastError,
        data: prev.data,
      };
    case "ok":
      return {
        requestPhase: "done",
        lastError: undefined,
        data: operation.data,
      };
    case "error":
      return {
        requestPhase: "done",
        lastError: operation.error,
        data: prev.data,
      };
    case "updateData":
      return {
        requestPhase: "done",
        data: operation.func(prev.data),
        lastError: prev.lastError,
      };
  }
};
