import {
  addCallback,
  type CallbacksAndDataState,
  createAndDataStateDoneError,
  createAndDataStateDoneResource,
  createOneCallbacksAndDataState,
  deleteCallback,
  getDataState,
  updateDataStateInCallbacksAndDataState,
} from "./callbacksAndDataState.ts";
import { type DataState, dataStateNone } from "./dataState.ts";

export type CallbacksAndDataStateMap<Id, Resource> = Map<
  Id,
  CallbacksAndDataState<Resource>
>;

export const addCallbackInMap = <Id, Resource>(
  map: CallbacksAndDataStateMap<Id, Resource>,
  id: Id,
  callback: () => void,
): void => {
  const callbacksAndResource = map.get(id);
  if (callbacksAndResource) {
    addCallback(callbacksAndResource, callback);
  } else {
    map.set(id, createOneCallbacksAndDataState(callback));
  }
};

export const deleteCallbackInMap = <Id, Resource>(
  map: CallbacksAndDataStateMap<Id, Resource>,
  id: Id,
  callback: () => void,
): void => {
  const callbacksAndResource = map.get(id);
  if (!callbacksAndResource) {
    return;
  }
  deleteCallback(callbacksAndResource, callback);
};

/**
 * "waitForRequest" (取得待ち)状態にして, 再取得されるようにする
 */
export const setWaitForRequest = <Id, Resource>(
  map: CallbacksAndDataStateMap<Id, Resource>,
  id: Id,
): void => {
  const callbacksAndResource = map.get(id);
  if (!callbacksAndResource) {
    return;
  }
  updateDataStateInCallbacksAndDataState(callbacksAndResource, {
    type: "waitForRequest",
  });
};

export const setData = <Id, Resource>(
  map: CallbacksAndDataStateMap<Id, Resource>,
  id: Id,
  data: Resource,
): void => {
  const callbacksAndResource = map.get(id);
  if (!callbacksAndResource) {
    map.set(id, createAndDataStateDoneResource(data));
    return;
  }
  updateDataStateInCallbacksAndDataState(callbacksAndResource, {
    type: "ok",
    data,
  });
};

export const setError = <Id, Resource>(
  map: CallbacksAndDataStateMap<Id, Resource>,
  id: Id,
  error: Error,
): void => {
  const callbacksAndResource = map.get(id);
  if (!callbacksAndResource) {
    map.set(id, createAndDataStateDoneError(error));
    return;
  }
  updateDataStateInCallbacksAndDataState(callbacksAndResource, {
    type: "error",
    error: error,
  });
};

export const getDataStateInMap = <Id, Resource>(
  map: CallbacksAndDataStateMap<Id, Resource>,
  id: Id,
): DataState<Resource> => {
  const c = map.get(id);
  return c ? getDataState(c) : dataStateNone;
};
