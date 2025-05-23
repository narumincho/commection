import { Module } from "@narumincho/js-ts-code-generator";
import { generateSubscribeCode } from "./client/subscribe.ts";
import { generateRequestCode } from "./client/request.ts";
import { Schema } from "./schema.ts";
import { generateReactSubscribeCode } from "./client/react.ts";

export type ClientNeedSpecifier = {
  readonly generatedId: string;
  readonly generatedType: string;
  readonly generatedFilterType: string;
  readonly generatedFilterSearchParamsCodec: string;
  readonly runtimeRequest: string;
  readonly runtimeStore: string;
  readonly runtimeCallbacksAndDataStateMap: string;
  readonly runtimeCallbacksAndDataState: string;
  readonly runtimeDataState: string;
  readonly runtimeReact: string;
};

export const generateClientCode = ({ specifier, schema, serverUrlPrefix }: {
  readonly specifier: ClientNeedSpecifier;
  readonly schema: Schema;
  readonly serverUrlPrefix: string;
}): ReadonlyMap<string, Module> => {
  return new Map([
    ["request.ts", generateRequestCode({ schema, specifier, serverUrlPrefix })],
    [
      "subscribe.ts",
      generateSubscribeCode({
        specifier: {
          ...specifier,
          generatedRequest: "./request.ts",
        },
        schema,
      }),
    ],
    [
      "react.ts",
      generateReactSubscribeCode({
        specifier: {
          ...specifier,
          generatedRequest: "./request.ts",
          generatedSubscribe: "./subscribe.ts",
          react: "react",
        },
        schema,
      }),
    ],
  ]);
};
