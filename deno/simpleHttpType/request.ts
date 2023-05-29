import { Lazy } from "../lazy.ts";
import { StructuredJsonValue } from "../typedJson.ts";
import { SimpleUrl } from "./url.ts";

export type SimpleRequest =
  | SimpleRequestGet
  | SimpleRequestOption
  | SimpleRequestPost;

export type SimpleRequestGet = {
  readonly method: "get";
  readonly url: SimpleUrl;
};

export type SimpleRequestOption = {
  readonly method: "option";
  readonly url: SimpleUrl;
};

export type SimpleRequestPost = {
  readonly method: "post";
  readonly url: SimpleUrl;
  readonly bodyLazy: Lazy<StructuredJsonValue>;
};

export type SimpleRequestHeader = {
  readonly authorizationBearerValue: string | undefined;
};
