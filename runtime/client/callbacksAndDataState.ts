import { ResponseError } from "../common.ts";
import {
  DataState,
  dataStateNone,
  Operation,
  updateDataState,
} from "./dataState.ts";

const callbackSetSymbol = Symbol("callbacks");
const dataStateSymbol = Symbol("resource");

/**
 * データの変更をしたときに通知するためのコールバック関数とデータ本体を保持する
 */
export type CallbacksAndDataState<Resource> = {
  readonly [callbackSetSymbol]: Set<() => void>;
  [dataStateSymbol]: DataState<Resource>;
};

/**
 * 取得要求ありのデータ状態を作成する
 */
export const createAndDataState = <Resource>(): CallbacksAndDataState<
  Resource
> => {
  return {
    [callbackSetSymbol]: new Set([]),
    [dataStateSymbol]: dataStateNone,
  };
};

export const createAndDataStateDoneResource = <Resource>(
  resource: Resource,
): CallbacksAndDataState<
  Resource
> => {
  return {
    [callbackSetSymbol]: new Set([]),
    [dataStateSymbol]: {
      data: resource,
      lastError: undefined,
      requestPhase: "done",
    },
  };
};

export const createAndDataStateDoneError = <Resource>(
  error: ResponseError,
): CallbacksAndDataState<
  Resource
> => {
  return {
    [callbackSetSymbol]: new Set([]),
    [dataStateSymbol]: {
      data: undefined,
      lastError: error,
      requestPhase: "done",
    },
  };
};

/**
 * 取得要求ありのデータ状態を作成する
 */
export const createOneCallbacksAndDataState = <Resource>(
  callback: () => void,
): CallbacksAndDataState<Resource> => {
  return {
    [callbackSetSymbol]: new Set([callback]),
    [dataStateSymbol]: dataStateNone,
  };
};

/**
 * 変更したときに呼ばれるコールバックを追加する
 */
export function addCallback<Resource>(
  callbacksAndDataState: CallbacksAndDataState<Resource>,
  callback: () => void,
): void {
  callbacksAndDataState[callbackSetSymbol].add(callback);
}

/**
 * 変更したときに呼ばれるコールバックを削除する
 */
export function deleteCallback<Resource>(
  callbacksAndDataState: CallbacksAndDataState<Resource>,
  callback: () => void,
): void {
  callbacksAndDataState[callbackSetSymbol].delete(callback);
}

export function getDataState<Resource>(
  callbacksAndDataState: CallbacksAndDataState<Resource>,
): DataState<Resource> {
  return callbacksAndDataState[dataStateSymbol];
}

function setDataState<Resource>(
  callbacksAndDataState: CallbacksAndDataState<Resource>,
  dataState: DataState<Resource>,
): void {
  callbacksAndDataState[dataStateSymbol] = dataState;

  for (const callback of callbacksAndDataState[callbackSetSymbol]) {
    callback();
  }
}

export function updateDataStateInCallbacksAndDataState<Resource>(
  callbacksAndResource: CallbacksAndDataState<Resource>,
  operation: Operation<Resource>,
): void {
  setDataState(
    callbacksAndResource,
    updateDataState<Resource>(getDataState(callbacksAndResource), operation),
  );
}
