import {
  ArrayItem,
  Definition,
  definitionTypeAlias,
  FunctionDefinition,
  Identifier,
  identifierFromString,
  Member,
  Module,
  Statement,
  TypeAlias,
} from "@narumincho/js-ts-code-generator";
import * as type from "@narumincho/js-ts-code-generator/type";
import * as expr from "@narumincho/js-ts-code-generator/expr";
import * as statement from "@narumincho/js-ts-code-generator/statement";
import type { FieldInput, Resource, Schema } from "./schema.ts";
import { firstLowerCase, typeToTsType } from "./util.ts";

type Specifier = {
  readonly runtimeCommon: string;
  readonly idModulePath: string;
};

export const generateCommonCode = (
  { schema, specifier }: { schema: Schema; specifier: Specifier },
): {
  readonly id: Module;
  readonly type: Module;
  readonly filterType: Module;
  readonly filterSearchParamsCodec: Module;
} => {
  return {
    id: {
      definitionList: schema.resources.filter((resource) => resource.main).map((
        resource,
      ): Definition =>
        definitionTypeAlias({
          export: true,
          name: identifierFromString(resource.idName),
          document: "",
          namespace: [],
          typeParameterList: [],
          type: {
            type: "Intersection",
            intersectionType: {
              left: { type: "String" },
              right: type.object([{
                name: {
                  type: "string",
                  value: resource.idName,
                },
                type: { type: "uniqueSymbol" },
              }]),
            },
          },
        })
      ),
      statementList: [],
    },
    type: {
      definitionList: schema.resources.flatMap((resource) => [
        createTypeDefinition(resource.name, [{
          name: "id",
          type: { type: "ref", name: resource.idName },
        }, ...resource.fields], specifier.idModulePath),
      ]),
      statementList: [],
    },
    filterType: {
      definitionList: schema.resources.filter((resource) => resource.filterApi)
        .map((
          resource,
        ): Definition =>
          definitionTypeAlias(
            filterTypeAlias(resource, specifier.idModulePath),
          )
        ),
      statementList: [],
    },
    filterSearchParamsCodec: {
      definitionList: schema.resources.filter((resource) => resource.filterApi)
        .flatMap((
          resource,
        ): ReadonlyArray<Definition> => [{
          type: "function",
          function: filterFromSearchParamsFunctionDefinition({
            resource,
            specifier,
          }),
        }, {
          type: "function",
          function: filterToSearchParamsFunctionDefinition({
            resource,
            specifier,
          }),
        }]),
      statementList: [],
    },
  };
};

function createTypeDefinition(
  name: string,
  fields: ReadonlyArray<FieldInput>,
  idModulePath: string,
): Definition {
  return {
    type: "typeAlias",
    typeAlias: {
      export: true,
      name: identifierFromString(name),
      document: "",
      namespace: [],
      typeParameterList: [],
      type: type.object(
        fields.map((field) => {
          const required = field?.required ?? true;
          return ({
            name: {
              type: "string",
              value: field.name,
            },
            required,
            type: required
              ? typeToTsType(field.type, idModulePath)
              : type.union([
                typeToTsType(field.type, idModulePath),
                { type: "Null" },
              ]),
          });
        }),
      ),
    },
  };
}

export const createFilterTypeName = (name: string) =>
  identifierFromString(`${name}Filter`);

const filterTypeAlias = (
  resource: Resource,
  idModulePath: string,
): TypeAlias => ({
  export: true,
  name: createFilterTypeName(resource.name),
  document: "",
  namespace: [],
  typeParameterList: [],
  type: type.object(
    resource.fields.flatMap((field) =>
      field.type.type === "object" ? [] : ({
        name: { type: "string", value: field.name },
        required: false,
        type: type.union([
          typeToTsType(field.type, idModulePath),
          { type: "Undefined" },
        ]),
      })
    ),
  ),
});

export const filterFromSearchParamsFunctionName = (name: string): Identifier =>
  identifierFromString(`${firstLowerCase(name)}FilterFromSearchParams`);

const filterFromSearchParamsFunctionDefinition = (
  { resource, specifier }: { specifier: Specifier; resource: Resource },
): FunctionDefinition => {
  return {
    export: true,
    isAsync: false,
    name: filterFromSearchParamsFunctionName(resource.name),
    document: "",
    parameterList: [
      {
        name: identifierFromString("searchParams"),
        document: "",
        type: {
          type: "ScopeInGlobal",
          typeNameAndArguments: {
            name: identifierFromString("URLSearchParams"),
            arguments: [],
          },
        },
      },
    ],
    returnType: {
      type: "ImportedType",
      importedType: {
        moduleName: "./filterType.ts",
        nameAndArguments: {
          name: identifierFromString(`${resource.name}Filter`),
          arguments: [],
        },
      },
    },
    typeParameterList: [],
    statementList: [
      ...resource.fields.flatMap<Statement>((field) => {
        const param = expr.callMethod(
          expr.variable(identifierFromString("searchParams")),
          "get",
          [expr.stringLiteral(field.name)],
        );
        switch (field.type.type) {
          case "string":
          case "ref":
          case "boolean":
            // searchParams.get("name")
            return [{
              type: "VariableDefinition",
              variableDefinitionStatement: {
                isConst: true,
                name: identifierFromString(field.name),
                type: type.union([
                  { type: "String" },
                  { type: "Null" },
                ]),
                expr: param,
              },
            }];
          case "integer":
            // Number.parseInt(searchParams.get("name"), 10)
            return [{
              type: "VariableDefinition",
              variableDefinitionStatement: {
                isConst: true,
                name: identifierFromString(field.name),
                type: type.union([{ type: "Number" }, { type: "Null" }]),
                expr: expr.callMethod(
                  {
                    type: "GlobalObjects",
                    identifier: identifierFromString("Number"),
                  },
                  "parseInt",
                  [
                    expr.nullishCoalescing(param, expr.stringLiteral("")),
                    expr.numberLiteral(10),
                  ],
                ),
              },
            }];
          case "object":
            return [];
        }
      }),
      statement.return({
        type: "ObjectLiteral",
        memberList: resource.fields.flatMap<Member>(
          (field): [Member] | [] => {
            switch (field.type.type) {
              case "string":
                return [{
                  type: "KeyValue",
                  keyValue: {
                    key: expr.stringLiteral(field.name),
                    // name ?? undefined
                    value: expr.nullishCoalescing(
                      expr.variable(
                        identifierFromString(field.name),
                      ),
                      { type: "UndefinedLiteral" },
                    ),
                  },
                }];
              case "integer":
                return [{
                  type: "KeyValue",
                  keyValue: {
                    key: expr.stringLiteral(field.name),
                    value: {
                      type: "ConditionalOperator",
                      conditionalOperatorExpr: {
                        condition: expr.callMethod(
                          {
                            type: "GlobalObjects",
                            identifier: identifierFromString("Number"),
                          },
                          "isNaN",
                          [
                            expr.variable(identifierFromString(field.name)),
                          ],
                        ),
                        thenExpr: expr.variable(
                          identifierFromString(field.name),
                        ),
                        elseExpr: { type: "UndefinedLiteral" },
                      },
                    },
                  },
                }];
              case "boolean":
                return [{
                  type: "KeyValue",
                  keyValue: {
                    key: expr.stringLiteral(field.name),
                    value: {
                      type: "ConditionalOperator",
                      conditionalOperatorExpr: {
                        condition: expr.equal(
                          expr.variable(identifierFromString(field.name)),
                          expr.stringLiteral("true"),
                        ),
                        thenExpr: { type: "BooleanLiteral", bool: true },
                        elseExpr: {
                          type: "ConditionalOperator",
                          conditionalOperatorExpr: {
                            condition: expr.equal(
                              expr.variable(identifierFromString(field.name)),
                              expr.stringLiteral("false"),
                            ),
                            thenExpr: { type: "BooleanLiteral", bool: false },
                            elseExpr: { type: "UndefinedLiteral" },
                          },
                        },
                      },
                    },
                  },
                }];
              case "object":
                return [];
              case "ref":
                return [{
                  type: "KeyValue",
                  keyValue: {
                    key: expr.stringLiteral(field.name),
                    // typeof name === "string" ? assertBrandString<Type>(name) : undefined
                    value: {
                      type: "ConditionalOperator",
                      conditionalOperatorExpr: {
                        condition: expr.equal(
                          expr.typeofExpr(expr.variable(
                            identifierFromString(field.name),
                          )),
                          expr.stringLiteral("string"),
                        ),
                        thenExpr: {
                          type: "Call",
                          callExpr: {
                            expr: {
                              type: "WithTypeArguments",
                              withTypeArguments: {
                                expr: {
                                  type: "ImportedVariable",
                                  importedVariable: {
                                    moduleName: specifier.runtimeCommon,
                                    name: identifierFromString(
                                      "assertBrandString",
                                    ),
                                  },
                                },
                                types: [{
                                  type: "ImportedType",
                                  importedType: {
                                    moduleName: "./id.ts",
                                    nameAndArguments: {
                                      name: identifierFromString(
                                        field.type.name,
                                      ),
                                      arguments: [],
                                    },
                                  },
                                }],
                              },
                            },
                            parameterList: [
                              expr.variable(identifierFromString(field.name)),
                            ],
                          },
                        },
                        elseExpr: { type: "UndefinedLiteral" },
                      },
                    },
                  },
                }];
            }
          },
        ),
      }),
    ],
  };
};

export const filterToSearchParamsFunctionName = (name: string): Identifier =>
  identifierFromString(`${firstLowerCase(name)}FilterToSearchParams`);

const filterToSearchParamsFunctionDefinition = (
  { resource }: { specifier: Specifier; resource: Resource },
): FunctionDefinition => {
  return {
    export: true,
    isAsync: false,
    name: filterToSearchParamsFunctionName(resource.name),
    document: "",
    parameterList: [
      {
        name: identifierFromString("filter"),
        document: "",
        type: {
          type: "ImportedType",
          importedType: {
            moduleName: "./filterType.ts",
            nameAndArguments: {
              name: identifierFromString(
                `${resource.name}Filter`,
              ),
              arguments: [],
            },
          },
        },
      },
    ],
    returnType: {
      type: "ScopeInGlobal",
      typeNameAndArguments: {
        name: identifierFromString("URLSearchParams"),
        arguments: [],
      },
    },
    typeParameterList: [],
    statementList: [
      statement.return({
        type: "New",
        callExpr: {
          expr: {
            type: "GlobalObjects",
            identifier: identifierFromString("URLSearchParams"),
          },
          parameterList: [expr.arrayLiteral(
            resource.fields.flatMap<ArrayItem>(
              (field): [ArrayItem] | [] => {
                switch (field.type.type) {
                  case "string":
                    return [{
                      spread: true,
                      expr: {
                        type: "ConditionalOperator",
                        conditionalOperatorExpr: {
                          condition: expr.equal(
                            expr.get(
                              expr.variable(identifierFromString("filter")),
                              field.name,
                            ),
                            { type: "UndefinedLiteral" },
                          ),
                          thenExpr: expr.arrayLiteral([]),
                          elseExpr: expr.arrayLiteral([{
                            spread: false,
                            expr: expr.arrayLiteral([
                              {
                                spread: false,
                                expr: expr.stringLiteral(field.name),
                              },
                              {
                                spread: false,
                                expr: expr.get(
                                  expr.variable(identifierFromString("filter")),
                                  field.name,
                                ),
                              },
                            ]),
                          }]),
                        },
                      },
                    }];
                  case "integer":
                  case "boolean":
                    return [{
                      spread: true,
                      expr: {
                        type: "ConditionalOperator",
                        conditionalOperatorExpr: {
                          condition: expr.equal(
                            expr.get(
                              expr.variable(identifierFromString("filter")),
                              field.name,
                            ),
                            { type: "UndefinedLiteral" },
                          ),
                          thenExpr: expr.arrayLiteral([]),
                          elseExpr: expr.arrayLiteral([{
                            spread: false,
                            expr: expr.arrayLiteral([
                              {
                                spread: false,
                                expr: expr.stringLiteral(field.name),
                              },
                              {
                                spread: false,
                                expr: expr.callMethod(
                                  expr.get(
                                    expr.variable(
                                      identifierFromString("filter"),
                                    ),
                                    field.name,
                                  ),
                                  "toString",
                                  [],
                                ),
                              },
                            ]),
                          }]),
                        },
                      },
                    }];
                  case "object":
                    return [];
                  case "ref":
                    return [{
                      spread: true,
                      expr: {
                        type: "ConditionalOperator",
                        conditionalOperatorExpr: {
                          condition: expr.equal(
                            expr.get(
                              expr.variable(identifierFromString("filter")),
                              field.name,
                            ),
                            { type: "UndefinedLiteral" },
                          ),
                          thenExpr: expr.arrayLiteral([]),
                          elseExpr: expr.arrayLiteral([{
                            spread: false,
                            expr: expr.arrayLiteral([
                              {
                                spread: false,
                                expr: expr.stringLiteral(field.name),
                              },
                              {
                                spread: false,
                                expr: expr.get(
                                  expr.variable(identifierFromString("filter")),
                                  field.name,
                                ),
                              },
                            ]),
                          }]),
                        },
                      },
                    }];
                }
              },
            ),
          )],
        },
      }),
    ],
  };
};
