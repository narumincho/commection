import { assertEquals } from "jsr:@std/assert";
import { assertBrandString } from "../runtime/common.ts";
import type { AccountId } from "./generated/common/id.ts";
import type { Account } from "./generated/common/type.ts";
import { handle, type Implement } from "./generated/server/commection.ts";
import { assertSpyCallAsync, spy } from "jsr:@std/testing/mock";

Deno.test("getAccountById", async () => {
  const getAccountByIdSet = spy<
    unknown,
    [ReadonlySet<AccountId>, number],
    Promise<ReadonlyMap<AccountId, Account | Error>>
  > // deno-lint-ignore require-await
  (async (idSet) =>
    new Map(
      [...idSet].map((id): [AccountId, Account] => [id, { id, name: "test" }]),
    )
  );
  const implement: Implement<number> = {
    getCollectionByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getCollectionByFilter: () => {
      throw new Error("Function not implemented.");
    },
    getBrandByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getBrandByFilter: () => {
      throw new Error("Function not implemented.");
    },
    getAccountByIdSet,
    getAccountByFilter: () => {
      throw new Error("Function not implemented.");
    },
    getMyAccount: () => {
      throw new Error("Function not implemented.");
    },
    getAccountPrivateByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getDesignerByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getItemByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getItemByFilter: () => {
      throw new Error("Function not implemented.");
    },
    getItemImageByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getItemEventByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getItemEventByFilter: () => {
      throw new Error("Function not implemented.");
    },
    getItemEventTypeByIdSet: () => {
      throw new Error("Function not implemented.");
    },
    getItemEventTypeByFilter: () => {
      throw new Error("Function not implemented.");
    },
  };

  const resposne = await handle({
    implement,
    context: 123,
    prefix: "",
    request: new Request("https://example.com/account?id=sampleId"),
  });

  assertSpyCallAsync(getAccountByIdSet, 0, {
    args: [new Set([assertBrandString<AccountId>("sampleId")]), 123],
    returned: new Map([[assertBrandString<AccountId>("sampleId"), {
      id: assertBrandString<AccountId>("sampleId"),
      name: "test",
    }]]),
  });
  assertEquals(resposne.status, 200);
  assertEquals(await resposne.json(), {
    data: [
      {
        id: "sampleId",
        type: "ok",
        value: {
          id: "sampleId",
          name: "test",
        },
      },
    ],
    type: "ok",
  });
});
