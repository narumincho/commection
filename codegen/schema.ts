export type SchemaInput = {
  readonly resources: ReadonlyArray<ResourceInput>;
};

export type ResourceInput = {
  readonly name: string;
  readonly mainFields: ReadonlyArray<FieldInput>;
  /**
   * リソースの取得がフィールドによって違う場合に使う
   *
   * 画像とか. 権限チェックを別にしたいときとか
   * @default []
   */
  readonly subFields?: ReadonlyArray<{
    readonly name: string;
    readonly fields: ReadonlyArray<FieldInput>;
    readonly filterApi: boolean;
    readonly byIdSetApi: boolean;
  }>;
  readonly filterApi: boolean;
  readonly byIdSetApi: boolean;
  readonly oneApi?: ReadonlySet<string>;
};

export type Type =
  | { readonly type: "string" }
  | { readonly type: "integer" }
  | {
    readonly type: "boolean";
  }
  | {
    readonly type: "ref";
    readonly name: string;
  }
  | {
    readonly type: "object";
    readonly fields: ReadonlyArray<{
      readonly name: string;
      readonly type: Type;
    }>;
  };

export type FieldInput = {
  readonly name: string;
  readonly type: Type;
  /**
   * @default true
   */
  readonly required?: boolean;
  /**
   * @default ""
   */
  readonly note?: string;
};

export type Schema = {
  readonly resources: ReadonlyArray<Resource>;
};

export type Resource = {
  readonly main: boolean;
  readonly name: string;
  readonly idName: string;
  readonly fields: ReadonlyArray<Field>;
  readonly filterApi: boolean;
  readonly byIdSetApi: boolean;
  readonly oneApi: ReadonlySet<string>;
};

export type Field = {
  readonly name: string;
  readonly type: Type;
  readonly required: boolean;
  readonly note: string;
};

export const schemaInputToSchema = (schemaInput: SchemaInput): Schema => {
  return {
    resources: schemaInput.resources
      .flatMap((resourceInput): ReadonlyArray<Resource> => [
        {
          main: true,
          name: resourceInput.name,
          idName: `${resourceInput.name}Id`,
          fields: resourceInput.mainFields.map(fieldInputToField),
          filterApi: resourceInput.filterApi,
          byIdSetApi: resourceInput.byIdSetApi,
          oneApi: resourceInput.oneApi ?? new Set(),
        },
        ...(resourceInput.subFields ?? []).map((subField): Resource => ({
          main: false,
          name: `${resourceInput.name}${subField.name}`,
          idName: `${resourceInput.name}Id`,
          fields: subField.fields.map(fieldInputToField),
          filterApi: subField.filterApi,
          byIdSetApi: subField.byIdSetApi,
          oneApi: new Set(),
        })),
      ]),
  };
};

const fieldInputToField = (
  fieldInput: FieldInput,
): Field => {
  return {
    name: fieldInput.name,
    type: fieldInput.type,
    required: fieldInput.required ?? true,
    note: fieldInput.note ?? "",
  };
};
