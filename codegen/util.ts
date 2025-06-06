import {
  identifierFromString,
  type Type as TsType,
} from "@narumincho/js-ts-code-generator";
import { object } from "@narumincho/js-ts-code-generator/type";
import type { Type } from "./schema.ts";

export const firstLowerCase = (s: string): string => {
  const first = s.at(0);
  if (first) {
    return first.toLowerCase() + s.slice(1);
  }
  return "";
};

export const firstUpperCase = (s: string): string => {
  const first = s.at(0);
  if (first) {
    return first.toUpperCase() + s.slice(1);
  }
  return "";
};

export const typeToTsType = (type: Type, idSpecifier: string): TsType => {
  switch (type.type) {
    case "string":
      return { type: "String" };
    case "boolean":
      return { type: "Boolean" };
    case "integer":
      return { type: "Number" };
    case "ref":
      return {
        type: "ImportedType",
        importedType: {
          moduleName: idSpecifier,
          nameAndArguments: {
            name: identifierFromString(type.name),
            arguments: [],
          },
        },
      };
    case "object":
      return object(
        type.fields.map((field) => ({
          name: {
            type: "string",
            value: field.name,
          },
          type: typeToTsType(field.type, idSpecifier),
        })),
      );
  }
};
