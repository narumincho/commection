import {
  generateCodeAsString,
  type Module,
} from "@narumincho/js-ts-code-generator";
import { generateCommonCode } from "../codegen/common.ts";
import { type SchemaInput, schemaInputToSchema } from "../codegen/schema.ts";
import { generateServerCode } from "../codegen/server.ts";
import { generateClientCode } from "../codegen/client.ts";
import { join } from "jsr:@std/path";

const writeAndFormatCode = async (path: string, code: Module) => {
  await Deno.writeTextFile(
    path,
    generateCodeAsString({
      code,
      codeType: "TypeScript",
      generatedByLinks: ["https://jsr.io/@narumincho/commection@0.0.2"],
    }),
  );

  const process = new Deno.Command(Deno.execPath(), {
    args: ["fmt", path],
  }).spawn();

  await process.output();
};

const schemaInput: SchemaInput = {
  resources: [
    {
      name: "Collection",
      mainFields: [
        {
          name: "name",
          type: { type: "string" },
        },
        {
          name: "brandId",
          type: { type: "ref", name: "BrandId" },
        },
      ],
      byIdSetApi: true,
      filterApi: true,
    },
    {
      name: "Brand",
      mainFields: [
        {
          name: "name",
          type: { type: "string" },
        },
        {
          name: "designerId",
          type: { type: "ref", name: "DesignerId" },
        },
      ],
      byIdSetApi: true,
      filterApi: true,
    },
    {
      name: "Account",
      mainFields: [
        {
          name: "name",
          type: { type: "string" },
        },
        // 直和で表現したいが, 現状はサポートしていないので, 一旦オプショナルで表現
        {
          name: "designerId",
          required: false,
          type: {
            type: "ref",
            name: "DesignerId",
          },
        },
      ],
      subFields: [
        {
          name: "Private",
          fields: [
            {
              name: "lastOpenedCollectionId",
              type: { type: "ref", name: "CollectionId" },
              required: false,
            },
          ],
          byIdSetApi: true,
          filterApi: false,
        },
      ],
      byIdSetApi: true,
      filterApi: true,
      oneApi: new Set(["MyAccount"]),
    },
    {
      name: "Designer",
      mainFields: [
        {
          name: "name",
          type: { type: "string" },
        },
      ],
      byIdSetApi: true,
      filterApi: false,
    },
    {
      name: "Item",
      mainFields: [
        {
          name: "name",
          type: { type: "string" },
        },
        {
          name: "collectionId",
          type: { type: "ref", name: "CollectionId" },
        },
        {
          name: "lastEventDateTime",
          required: false,
          note:
            "最後に投稿されたアイテムイベントの作成日時. DateTime型ができるまで整数で表現. date.getTime() [ms]",
          type: { type: "integer" },
        },
      ],
      byIdSetApi: true,
      filterApi: true,
      subFields: [
        {
          name: "Image",
          fields: [{ name: "url", type: { type: "string" }, required: false }],
          byIdSetApi: true,
          filterApi: false,
        },
      ],
    },
    {
      name: "ItemEvent",
      mainFields: [
        {
          name: "note",
          type: { type: "string" },
        },
        {
          name: "typeId",
          type: { type: "ref", name: "ItemEventTypeId" },
        },
        {
          name: "itemId",
          type: { type: "ref", name: "ItemId" },
        },
        {
          name: "accountId",
          required: false,
          type: { type: "ref", name: "AccountId" },
        },
        {
          name: "createDateTime",
          note:
            "作成日時. DateTime型ができるまで整数で表現. date.getTime() [ms]",
          type: { type: "integer" },
        },
        {
          name: "date",
          note: "日付データ値",
          required: false,
          type: { type: "integer" },
        },
        {
          name: "imageUrl",
          note: "画像データ値",
          required: false,
          type: { type: "string" },
        },
      ],
      byIdSetApi: true,
      filterApi: true,
    },
    {
      name: "ItemEventType",
      mainFields: [
        {
          name: "name",
          type: { type: "string" },
        },
        {
          name: "canInputDesigner",
          type: { type: "boolean" },
        },
        {
          name: "canInputMaker",
          type: { type: "boolean" },
        },
        {
          name: "inputDate",
          type: { type: "boolean" },
        },
        {
          name: "inputImage",
          type: { type: "boolean" },
        },
        {
          name: "code",
          type: { type: "string" },
        },
      ],
      byIdSetApi: true,
      filterApi: true,
    },
  ],
};

const schema = schemaInputToSchema(schemaInput);

const { id, type, filterType, filterSearchParamsCodec } = generateCommonCode({
  schema,
  specifier: {
    runtimeCommon: "../../../runtime/common.ts",
    idModulePath: "./id.ts",
  },
});
const server = generateServerCode({
  specifier: {
    generatedId: "./common/id.ts",
    generatedType: "./common/type.ts",
    generatedFilterType: "./common/filterType.ts",
    generatedFilterSearchParamsCodec: "./common/filterSearchParamsCodec.ts",
    runtimeCommon: "../../runtime/common.ts",
    runtimeServer: "../../runtime/server.ts",
    naruminchoHttpServer: "@narumincho/http-server",
  },
  schema,
});

const clients = generateClientCode({
  serverUrlPrefix: "/commection",
  schema,
  specifier: {
    generatedId: "../common/id.ts",
    generatedType: "../common/type.ts",
    generatedFilterType: "../common/filterType.ts",
    generatedFilterSearchParamsCodec: "../common/filterSearchParamsCodec.ts",
    runtimeRequest: "../../../runtime/client/request.ts",
    runtimeStore: "../../../runtime/client/store.ts",
    runtimeCallbacksAndDataStateMap:
      "../../../runtime/client/callbacksAndDataStateMap.ts",
    runtimeCallbacksAndDataState:
      "../../../runtime/client/callbacksAndDataState.ts",
    runtimeDataState: "../../../runtime/client/dataState.ts",
    runtimeReact: "../../../runtime/client/react.ts",
  },
});

await Promise.all([
  writeAndFormatCode(
    "./example/generated/common/id.ts",
    id,
  ),
  writeAndFormatCode(
    "./example/generated/common/type.ts",
    type,
  ),
  writeAndFormatCode(
    "./example/generated/common/filterType.ts",
    filterType,
  ),
  writeAndFormatCode(
    "./example/generated/common/filterSearchParamsCodec.ts",
    filterSearchParamsCodec,
  ),
  writeAndFormatCode(
    "./example/generated/server.ts",
    server,
  ),
  ...[...clients].map(([name, module]) =>
    writeAndFormatCode(
      join("./example/generated/client", name),
      module,
    )
  ),
]);
