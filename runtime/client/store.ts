import {
  type CallbacksAndDataState,
  createAndDataStateDoneResource,
  getDataState,
  updateDataStateInCallbacksAndDataState,
} from "./callbacksAndDataState.ts";
import type { CallbacksAndDataStateMap } from "./callbacksAndDataStateMap.ts";
import type { DataState } from "./dataState.ts";
import type { DataOrError, FilterResponse } from "./request.ts";

/**
 * よくある
 * - リソースのIDに対する取得状態と正規化されたキャッシュ
 * - 検索条件によるID一覧の取得状態とキャッシュ
 * を管理する
 *
 * @module
 */

export type Store<Id, Resource> = {
  readonly itemById: CallbacksAndDataStateMap<
    Id,
    Resource
  >;
  readonly idsByFilter: CallbacksAndDataStateMap<
    string,
    ReadonlyArray<Id>
  >;
  readonly itemsByFilter: CallbacksAndDataStateMap<
    string,
    ReadonlyArray<ItemsByFilterItem<Id, Resource>>
  >;
};

export type ItemsByFilterItem<Id, Resource> = {
  readonly id: Id;
  readonly resource: DataState<Resource>;
};

export function createStore<Id, Resource>(): Store<Id, Resource> {
  return {
    idsByFilter: new Map(),
    itemById: new Map(),
    itemsByFilter: new Map(),
  };
}

/**
 * 取得したデータ1つをキャッシュに保存する
 */
export function setItem<Id, Resource>(
  store: Store<Id, Resource>,
  id: Id,
  resource: Resource,
): void {
  const callbacksAndResource = store.itemById.get(id);
  if (!callbacksAndResource) {
    return;
  }
  updateDataStateInCallbacksAndDataState(callbacksAndResource, {
    data: resource,
    type: "ok",
  });
  store.itemsByFilter.forEach((callbacksAndResource) => {
    const dataState = getDataState(callbacksAndResource);
    if (
      dataState.data?.some((item) => item.id === id)
    ) {
      updateDataStateInCallbacksAndDataState(callbacksAndResource, {
        type: "updateData",
        func: (data) =>
          data?.map((item): {
            readonly id: Id;
            readonly resource: DataState<Resource>;
          } =>
            item.id === id
              ? {
                id,
                resource: {
                  requestPhase: "done",
                  lastError: undefined,
                  data: resource,
                },
              }
              : item
          ),
      });
    }
  });
}

/**
 * 取得した一覧データをキャッシュに保存する
 */
export function setItemsByFilter<Id, Resource>(
  store: Store<Id, Resource>,
  filter: string,
  items: ReadonlyArray<ItemsByFilterItem<Id, Resource>>,
): void {
  const callbacksAndResource = store.itemsByFilter.get(filter);
  if (!callbacksAndResource) {
    // callbacksAndResource がないということは 取得要求もないということなので何もしない
    return;
  }
  updateDataStateInCallbacksAndDataState(callbacksAndResource, {
    data: items,
    type: "ok",
  });
  const idsCallbacksAndResource = store.idsByFilter.get(filter);
  if (!idsCallbacksAndResource) {
    return;
  }
  updateDataStateInCallbacksAndDataState(idsCallbacksAndResource, {
    data: items.map((item) => item.id),
    type: "ok",
  });
}

/**
 * 取得状態が waitForRequest なものを探し, データを取得し, 取得したデータを保存する
 *
 * データの取得関数は渡す
 */
export function scanWaitForRequest<Id, Resource>(
  store: Store<Id, Resource>,
  multipleRequest: (
    ids: ReadonlySet<Id>,
  ) => Promise<ReadonlyMap<Id, DataOrError<Resource>>>,
  filterRequest: (filter: string) => Promise<FilterResponse<Id, Resource>>,
): void {
  scanWaitForRequestByIds(store.itemById, multipleRequest);

  const filterStrings: ReadonlyArray<string> = [
    ...[...store.idsByFilter].flatMap((
      [filterString, callbacksAndResource],
    ) =>
      getDataState(callbacksAndResource).requestPhase === "waitForRequest"
        ? [filterString]
        : []
    ),
    ...[...store.itemsByFilter].flatMap((
      [filterString, callbacksAndResource],
    ) =>
      getDataState(callbacksAndResource).requestPhase === "waitForRequest"
        ? [filterString]
        : []
    ),
  ];
  for (const filterString of filterStrings) {
    filterRequest(filterString).then((response) => {
      const idsCallbackAndResource = store.idsByFilter.get(
        filterString,
      );
      if (idsCallbackAndResource) {
        updateDataStateInCallbacksAndDataState(idsCallbackAndResource, {
          type: "ok",
          data: response.data.map((e) => e.id),
        });
      } else {
        store.idsByFilter.set(
          filterString,
          createAndDataStateDoneResource(response.data.map((e) => e.id)),
        );
      }

      const itemsCallbackAndResource = store.itemsByFilter.get(
        filterString,
      );
      if (itemsCallbackAndResource) {
        updateDataStateInCallbacksAndDataState(
          itemsCallbackAndResource,
          {
            type: "ok",
            data: response.data.map((e): ItemsByFilterItem<Id, Resource> => ({
              id: e.id,
              resource: e.type === "ok"
                ? { requestPhase: "done", data: e.value, lastError: undefined }
                : { requestPhase: "done", data: undefined, lastError: e.error },
            })),
          },
        );
      } else {
        store.itemsByFilter.set(
          filterString,
          createAndDataStateDoneResource(
            response.data.map((e): ItemsByFilterItem<Id, Resource> => ({
              id: e.id,
              resource: e.type === "ok"
                ? { requestPhase: "done", data: e.value, lastError: undefined }
                : { requestPhase: "done", data: undefined, lastError: e.error },
            })),
          ),
        );
      }
    });
  }
}

export const scanWaitForRequestByIds = <Id, Resource>(
  byIdCallbacksAndDataStateMap: CallbacksAndDataStateMap<Id, Resource>,
  multipleRequest: (
    ids: ReadonlySet<Id>,
  ) => Promise<ReadonlyMap<Id, DataOrError<Resource>>>,
): void => {
  const ids = [...byIdCallbacksAndDataStateMap].flatMap(
    ([id, callbacksAndResource]) => {
      if (
        getDataState(callbacksAndResource).requestPhase === "waitForRequest"
      ) {
        updateDataStateInCallbacksAndDataState(callbacksAndResource, {
          type: "requesting",
        });
        return [id];
      }
      return [];
    },
  );
  if (ids.length > 0) {
    multipleRequest(new Set(ids)).then((response) => {
      response.forEach((value, id) => {
        const callbacksAndResource = byIdCallbacksAndDataStateMap.get(id);
        if (callbacksAndResource) {
          updateDataStateInCallbacksAndDataState(
            callbacksAndResource,
            value.type === "ok"
              ? {
                type: "ok",
                data: value.data,
              }
              : {
                type: "error",
                error: value.error,
              },
          );
        }
      });
    });
  }
};

export const scanWaitForRequestOne = <Resource>(
  callbacksAndDataState: CallbacksAndDataState<Resource> | undefined,
  request: () => Promise<DataOrError<Resource>>,
): void => {
  if (!callbacksAndDataState) {
    return;
  }
  if (
    getDataState(callbacksAndDataState).requestPhase === "waitForRequest"
  ) {
    updateDataStateInCallbacksAndDataState(
      callbacksAndDataState,
      { type: "requesting" },
    );
    request().then((response) => {
      updateDataStateInCallbacksAndDataState(
        callbacksAndDataState,
        response,
      );
    });
  }
};
