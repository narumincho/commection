/**
 * 構造化されたJSON
 */
export type StructuredJsonValue =
  | {
    /**
     * string
     */
    readonly type: "string";
    /**
     * string
     */
    readonly value: string;
    readonly [Symbol.toStringTag]: "*coreType.StructuredJsonValue";
  }
  | {
    /**
     * array
     */
    readonly type: "array";
    /**
     * array
     */
    readonly value: globalThis.ReadonlyArray<StructuredJsonValue>;
    readonly [Symbol.toStringTag]: "*coreType.StructuredJsonValue";
  }
  | {
    /**
     * boolean
     */
    readonly type: "boolean";
    /**
     * boolean
     */
    readonly value: boolean;
    readonly [Symbol.toStringTag]: "*coreType.StructuredJsonValue";
  }
  | {
    /**
     * null
     */
    readonly type: "null";
    readonly [Symbol.toStringTag]: "*coreType.StructuredJsonValue";
  }
  | {
    /**
     * number
     */
    readonly type: "number";
    /**
     * number
     */
    readonly value: number;
    readonly [Symbol.toStringTag]: "*coreType.StructuredJsonValue";
  }
  | {
    /**
     * object
     */
    readonly type: "object";
    /**
     * object
     */
    readonly value: globalThis.ReadonlyMap<string, StructuredJsonValue>;
    readonly [Symbol.toStringTag]: "*coreType.StructuredJsonValue";
  };
/**
 * 構造化されたJSON
 */
export const StructuredJsonValue: {
  /**
   * string
   */
  readonly string: (a: string) => StructuredJsonValue;
  /**
   * array
   */
  readonly array: (
    a: globalThis.ReadonlyArray<StructuredJsonValue>,
  ) => StructuredJsonValue;
  /**
   * boolean
   */
  readonly boolean: (a: boolean) => StructuredJsonValue;
  /**
   * null
   */
  readonly null: StructuredJsonValue;
  /**
   * number
   */
  readonly number: (a: number) => StructuredJsonValue;
  /**
   * object
   */
  readonly object: (
    a: globalThis.ReadonlyMap<string, StructuredJsonValue>,
  ) => StructuredJsonValue;
} = {
  string: (p: string): StructuredJsonValue => ({
    type: "string",
    value: p,
    [Symbol.toStringTag]: "*coreType.StructuredJsonValue",
  }),
  array: (
    p: globalThis.ReadonlyArray<StructuredJsonValue>,
  ): StructuredJsonValue => ({
    type: "array",
    value: p,
    [Symbol.toStringTag]: "*coreType.StructuredJsonValue",
  }),
  boolean: (p: boolean): StructuredJsonValue => ({
    type: "boolean",
    value: p,
    [Symbol.toStringTag]: "*coreType.StructuredJsonValue",
  }),
  null: { type: "null", [Symbol.toStringTag]: "*coreType.StructuredJsonValue" },
  number: (p: number): StructuredJsonValue => ({
    type: "number",
    value: p,
    [Symbol.toStringTag]: "*coreType.StructuredJsonValue",
  }),
  object: (
    p: globalThis.ReadonlyMap<string, StructuredJsonValue>,
  ): StructuredJsonValue => ({
    type: "object",
    value: p,
    [Symbol.toStringTag]: "*coreType.StructuredJsonValue",
  }),
};

export type RawJsonValue =
  | null
  | string
  | number
  | boolean
  | {
    readonly [K in string]: RawJsonValue;
  }
  | ReadonlyArray<RawJsonValue>;

export const jsonParse = (value: string): RawJsonValue | undefined => {
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("json のパースエラー", e);
    return undefined;
  }
};

export const structuredJsonParse = (
  value: string,
): StructuredJsonValue | undefined => {
  const rawJson = jsonParse(value);
  if (rawJson === undefined) {
    return undefined;
  }
  return rawJsonToStructuredJsonValue(rawJson);
};

export const rawJsonToStructuredJsonValue = (
  rawJson: RawJsonValue,
): StructuredJsonValue => {
  if (rawJson === null) {
    return StructuredJsonValue.null;
  }
  if (typeof rawJson === "boolean") {
    return StructuredJsonValue.boolean(rawJson);
  }
  if (typeof rawJson === "string") {
    return StructuredJsonValue.string(rawJson);
  }
  if (typeof rawJson === "number") {
    return StructuredJsonValue.number(rawJson);
  }
  if (rawJson instanceof Array) {
    return StructuredJsonValue.array(rawJson.map(rawJsonToStructuredJsonValue));
  }
  return StructuredJsonValue.object(
    new Map(
      Object.entries(rawJson).map(([k, v]) => [
        k,
        rawJsonToStructuredJsonValue(v),
      ]),
    ),
  );
};

export const jsonStringify = (
  jsonValue: RawJsonValue,
  indent = false,
): string => {
  if (indent) {
    return JSON.stringify(jsonValue, undefined, 2);
  }
  return JSON.stringify(jsonValue);
};

export const structuredJsonStringify = (
  structuredJsonValue: StructuredJsonValue,
  indent = false,
): string => {
  return jsonStringify(
    structuredJsonValueToRawJson(structuredJsonValue),
    indent,
  );
};

export const structuredJsonValueToRawJson = (
  structuredJsonValue: StructuredJsonValue,
): RawJsonValue => {
  switch (structuredJsonValue.type) {
    case "null":
      return null;
    case "string":
      return structuredJsonValue.value;
    case "number":
      return structuredJsonValue.value;
    case "boolean":
      return structuredJsonValue.value;
    case "array":
      return structuredJsonValue.value.map(structuredJsonValueToRawJson);
    case "object":
      return Object.fromEntries(
        [...structuredJsonValue.value.entries()].map(
          ([k, v]) => [k, structuredJsonValueToRawJson(v)],
        ),
      );
  }
};
