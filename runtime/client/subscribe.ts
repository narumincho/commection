export type RequestQuery = {
  readonly type: "multipleById";
  readonly resourceName: string;
  readonly ids: ReadonlySet<string>;
} | {
  readonly type: "filter";
  readonly resourceName: string;
  readonly filter: object;
} | {
  readonly type: "oneApi";
  readonly resourceName: string;
};

export type RequestingState = {};

export const createHttpRequestPlan = (
  // requestQueryList: ReadonlyArray<RequestQuery>,
): ReadonlyArray<RequestQuery> => {
  // TODO
  return [];
};
