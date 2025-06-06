/** generated by
 * - https://jsr.io/@narumincho/commection@0.0.2
 * - https://jsr.io/@narumincho/js-ts-code-generator@0.8.2
 * Do not edit!
 *
 * @module
 */

import * as a from "../common/id.ts";
import * as b from "../common/type.ts";
import * as c from "../common/filterType.ts";
import * as d from "../../../runtime/common.ts";
import * as e from "../../../runtime/server.ts";
import * as f from "../common/filterSearchParamsCodec.ts";
export type Implement<Context extends unknown> = {
  readonly getCollectionByIdSet: (
    a: ReadonlySet<a.CollectionId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.CollectionId, b.Collection | Error>>;
  readonly getCollectionByFilter: (
    a: c.CollectionFilter,
    b: Context,
  ) => Promise<d.OrderedMap<a.CollectionId, b.Collection | Error>>;
  readonly getBrandByIdSet: (
    a: ReadonlySet<a.BrandId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.BrandId, b.Brand | Error>>;
  readonly getBrandByFilter: (
    a: c.BrandFilter,
    b: Context,
  ) => Promise<d.OrderedMap<a.BrandId, b.Brand | Error>>;
  readonly getAccountByIdSet: (
    a: ReadonlySet<a.AccountId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.AccountId, b.Account | Error>>;
  readonly getAccountByFilter: (
    a: c.AccountFilter,
    b: Context,
  ) => Promise<d.OrderedMap<a.AccountId, b.Account | Error>>;
  readonly getMyAccount: (a: Context) => Promise<b.Account>;
  readonly getAccountPrivateByIdSet: (
    a: ReadonlySet<a.AccountId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.AccountId, b.AccountPrivate | Error>>;
  readonly getDesignerByIdSet: (
    a: ReadonlySet<a.DesignerId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.DesignerId, b.Designer | Error>>;
  readonly getItemByIdSet: (
    a: ReadonlySet<a.ItemId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.ItemId, b.Item | Error>>;
  readonly getItemByFilter: (
    a: c.ItemFilter,
    b: Context,
  ) => Promise<d.OrderedMap<a.ItemId, b.Item | Error>>;
  readonly getItemImageByIdSet: (
    a: ReadonlySet<a.ItemId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.ItemId, b.ItemImage | Error>>;
  readonly getItemEventByIdSet: (
    a: ReadonlySet<a.ItemEventId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.ItemEventId, b.ItemEvent | Error>>;
  readonly getItemEventByFilter: (
    a: c.ItemEventFilter,
    b: Context,
  ) => Promise<d.OrderedMap<a.ItemEventId, b.ItemEvent | Error>>;
  readonly getItemEventTypeByIdSet: (
    a: ReadonlySet<a.ItemEventTypeId>,
    b: Context,
  ) => Promise<ReadonlyMap<a.ItemEventTypeId, b.ItemEventType | Error>>;
  readonly getItemEventTypeByFilter: (
    a: c.ItemEventTypeFilter,
    b: Context,
  ) => Promise<d.OrderedMap<a.ItemEventTypeId, b.ItemEventType | Error>>;
};

export const handle = async <Context extends unknown>(
  parameter: {
    readonly implement: Implement<Context>;
    readonly request: Request;
    readonly context: Context;
    readonly prefix: string;
  },
): Promise<Response> => {
  try {
    const url: URL = new URL(parameter.request.url);
    switch (e.startWithAndPickToEnd(url.pathname, parameter.prefix)) {
      case "/collection": {
        const idSet: ReadonlySet<a.CollectionId> = new Set(
          url.searchParams.getAll("id").map(
            d.assertBrandString<a.CollectionId>,
          ),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getCollectionByIdSet(
            idSet,
            parameter.context,
          ),
        );
      }
      case "/collectionList": {
        return e.createByFilterResponse(
          await parameter.implement.getCollectionByFilter(
            f.collectionFilterFromSearchParams(url.searchParams),
            parameter.context,
          ),
        );
      }
      case "/brand": {
        const idSet: ReadonlySet<a.BrandId> = new Set(
          url.searchParams.getAll("id").map(d.assertBrandString<a.BrandId>),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getBrandByIdSet(idSet, parameter.context),
        );
      }
      case "/brandList": {
        return e.createByFilterResponse(
          await parameter.implement.getBrandByFilter(
            f.brandFilterFromSearchParams(url.searchParams),
            parameter.context,
          ),
        );
      }
      case "/account": {
        const idSet: ReadonlySet<a.AccountId> = new Set(
          url.searchParams.getAll("id").map(d.assertBrandString<a.AccountId>),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getAccountByIdSet(idSet, parameter.context),
        );
      }
      case "/myAccount": {
        return e.createOneResponse({
          type: "ok",
          value: await parameter.implement.getMyAccount(parameter.context),
        });
      }
      case "/accountList": {
        return e.createByFilterResponse(
          await parameter.implement.getAccountByFilter(
            f.accountFilterFromSearchParams(url.searchParams),
            parameter.context,
          ),
        );
      }
      case "/accountPrivate": {
        const idSet: ReadonlySet<a.AccountId> = new Set(
          url.searchParams.getAll("id").map(d.assertBrandString<a.AccountId>),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getAccountPrivateByIdSet(
            idSet,
            parameter.context,
          ),
        );
      }
      case "/designer": {
        const idSet: ReadonlySet<a.DesignerId> = new Set(
          url.searchParams.getAll("id").map(d.assertBrandString<a.DesignerId>),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getDesignerByIdSet(
            idSet,
            parameter.context,
          ),
        );
      }
      case "/item": {
        const idSet: ReadonlySet<a.ItemId> = new Set(
          url.searchParams.getAll("id").map(d.assertBrandString<a.ItemId>),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getItemByIdSet(idSet, parameter.context),
        );
      }
      case "/itemList": {
        return e.createByFilterResponse(
          await parameter.implement.getItemByFilter(
            f.itemFilterFromSearchParams(url.searchParams),
            parameter.context,
          ),
        );
      }
      case "/itemImage": {
        const idSet: ReadonlySet<a.ItemId> = new Set(
          url.searchParams.getAll("id").map(d.assertBrandString<a.ItemId>),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getItemImageByIdSet(
            idSet,
            parameter.context,
          ),
        );
      }
      case "/itemEvent": {
        const idSet: ReadonlySet<a.ItemEventId> = new Set(
          url.searchParams.getAll("id").map(d.assertBrandString<a.ItemEventId>),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getItemEventByIdSet(
            idSet,
            parameter.context,
          ),
        );
      }
      case "/itemEventList": {
        return e.createByFilterResponse(
          await parameter.implement.getItemEventByFilter(
            f.itemEventFilterFromSearchParams(url.searchParams),
            parameter.context,
          ),
        );
      }
      case "/itemEventType": {
        const idSet: ReadonlySet<a.ItemEventTypeId> = new Set(
          url.searchParams.getAll("id").map(
            d.assertBrandString<a.ItemEventTypeId>,
          ),
        );
        return e.createByIdSetResponse(
          idSet,
          await parameter.implement.getItemEventTypeByIdSet(
            idSet,
            parameter.context,
          ),
        );
      }
      case "/itemEventTypeList": {
        return e.createByFilterResponse(
          await parameter.implement.getItemEventTypeByFilter(
            f.itemEventTypeFilterFromSearchParams(url.searchParams),
            parameter.context,
          ),
        );
      }
    }
    throw new e.NotFoundError("notFound path");
  } catch (error) {
    const responseError: d.ResponseError = e.errorToResponseError(
      d.unknownToError(error),
    );
    const body: d.ErrorBody = { type: "error", error: responseError };
    return e.createJsonResponse(
      body,
      responseError.code
        ? e.responseErrorTypeToHttpStatusCode(responseError.code)
        : "InternalServerError",
    );
  }
};
