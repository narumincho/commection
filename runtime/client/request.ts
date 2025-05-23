import {
  type ByFilterResponseBody,
  type ByIdSetResponseBody,
  type OneResponseBody,
  type ResponseError,
  unknownToError,
} from "../common.ts";

export type DataOrError<T> = {
  readonly type: "ok";
  readonly data: T;
} | {
  readonly type: "error";
  readonly error: ResponseError;
};

export type FilterResponse<Id, Resource> = {
  readonly type: "ok";
  readonly data: ReadonlyArray<
    {
      readonly id: Id;
      readonly type: "ok";
      readonly value: Resource;
    } | {
      readonly id: Id;
      readonly type: "error";
      readonly error: ResponseError;
    }
  >;
  // ページング情報がここに追加される予定
};

export const getResourceListByFilter = async <Id extends string, Resource>(
  { prefix, resourceName, searchParams, bearerToken }: {
    prefix: string;
    resourceName: string;
    searchParams: URLSearchParams;
    bearerToken: string | undefined;
  },
): Promise<FilterResponse<Id, Resource>> => {
  const response: ByFilterResponseBody = await (await fetch(
    `${prefix}/${resourceName}List${
      searchParams.size === 0 ? "" : `?${searchParams}`
    }`,
    {
      headers: createHeaders(bearerToken),
    },
  )).json();
  if (response.type === "error") {
    throw new Error(response.error.message);
  }
  return response as FilterResponse<Id, Resource>;
};

export const createHeaders = (
  bearerToken: string | undefined,
): { Authorization?: string } => {
  return bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {};
};

/**
 * 指定したIDのリソースを取得する
 */
export const getResourceMultipleByIdSet = async <Id extends string, Resource>(
  { idSet, resourceName, bearerToken, prefix }: {
    readonly idSet: ReadonlySet<Id>;
    readonly bearerToken: string | undefined;
    readonly resourceName: string;
    readonly prefix: string;
    // そのうち decoder を渡す
  },
): Promise<ReadonlyMap<Id, DataOrError<Resource>>> => {
  try {
    const searchParams = new URLSearchParams(
      [...idSet].map((id) => ["id", id]),
    );
    const response: ByIdSetResponseBody = await (await fetch(
      `${prefix}/${resourceName}${
        searchParams.size === 0 ? "" : `?${searchParams}`
      }`,
      {
        headers: createHeaders(bearerToken),
      },
    )).json();
    if (response.type === "error") {
      throw new Error(response.error.message);
    }
    const map = new Map(response.data.map((data) => [data.id, data]));

    return new Map(
      [...idSet].map((id): [Id, DataOrError<Resource>] => {
        const data = map.get(id);
        if (data === undefined) {
          return [id, { type: "error", error: { message: "Not Responded" } }];
        }
        if (data.type === "error") {
          return [id, { type: "error", error: data.error }];
        }
        return [id, { type: "ok", data: data.value as Resource }];
      }),
    );
  } catch (e) {
    return new Map(
      [...idSet].map((
        id,
      ) => [id, { type: "error", error: unknownToError(e) }]),
    );
  }
};

export const getOneApi = async <Resource>(
  { name, bearerToken, prefix }: {
    readonly bearerToken: string | undefined;
    readonly name: string;
    readonly prefix: string;
    // そのうち decoder を渡す
  },
): Promise<DataOrError<Resource>> => {
  try {
    const response: OneResponseBody = await (await fetch(
      `${prefix}/${name}`,
      {
        headers: createHeaders(bearerToken),
      },
    )).json();
    if (response.type === "error") {
      return { type: "error", error: response.error };
    }
    return { type: "ok", data: response.value as Resource };
  } catch (e) {
    return { type: "error", error: { message: `${e}` } };
  }
};
