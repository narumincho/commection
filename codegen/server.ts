import {
  type ArrayItem,
  type Identifier,
  identifierFromString,
  type Module,
  type Pattern,
  type Statement,
  type Type as TsType,
  type TypeAlias,
  type VariableDefinition,
} from "@narumincho/js-ts-code-generator";
import * as type from "@narumincho/js-ts-code-generator/type";
import * as expr from "@narumincho/js-ts-code-generator/expr";
import * as statement from "@narumincho/js-ts-code-generator/statement";

import type { Resource, Schema, Type } from "./schema.ts";
import { firstLowerCase } from "./util.ts";

type ServerNeedSpecifier = {
  readonly runtimeCommon: string;
  readonly runtimeServer: string;
  readonly generatedId: string;
  readonly generatedType: string;
  readonly generatedFilterType: string;
  readonly generatedFilterSearchParamsCodec: string;
  readonly naruminchoHttpServer: string;
};

export const generateServerCode = ({ specifier, schema }: {
  readonly specifier: ServerNeedSpecifier;
  readonly schema: Schema;
}): Module => {
  return {
    definitionList: [
      {
        type: "typeAlias",
        typeAlias: implementTypeAlias({ specifier, schema }),
      },
      { type: "variable", variable: operationsVariable({ specifier, schema }) },
    ],
    statementList: [],
  };
};

export const implementTypeAlias = ({ specifier, schema }: {
  readonly specifier: ServerNeedSpecifier;
  readonly schema: Schema;
}): TypeAlias => ({
  export: true,
  name: identifierFromString("Implement"),
  document: "",
  namespace: [],
  typeParameterList: [{ name: identifierFromString("Context") }],
  type: type.object(schema.resources.flatMap((
    resource,
  ): ReadonlyArray<type.MemberInput> => [
    ...resource.byIdSetApi
      ? [
        {
          name: { type: "string", value: `get${resource.name}ByIdSet` },
          document: "",
          required: true,
          type: {
            type: "Function",
            functionType: {
              typeParameterList: [],
              parameterList: [
                type.ReadonlySet({
                  type: "ImportedType",
                  importedType: {
                    moduleName: specifier.generatedId,
                    nameAndArguments: {
                      name: identifierFromString(resource.idName),
                      arguments: [],
                    },
                  },
                }),
                type.scopeInFile(identifierFromString("Context")),
              ],
              return: type.Promise(
                type.ReadonlyMap(
                  {
                    type: "ImportedType",
                    importedType: {
                      moduleName: specifier.generatedId,
                      nameAndArguments: {
                        name: identifierFromString(resource.idName),
                        arguments: [],
                      },
                    },
                  },
                  type.union(
                    [{
                      type: "ImportedType",
                      importedType: {
                        moduleName: specifier.generatedType,
                        nameAndArguments: {
                          name: identifierFromString(`${resource.name}`),
                          arguments: [],
                        },
                      },
                    }, {
                      type: "ScopeInGlobal",
                      typeNameAndArguments: {
                        name: identifierFromString("Error"),
                        arguments: [],
                      },
                    }],
                  ),
                ),
              ),
            },
          },
        } satisfies type.MemberInput,
      ]
      : [],
    ...resource.filterApi
      ? [
        {
          name: { type: "string", value: `get${resource.name}ByFilter` },
          document: "",
          required: true,
          type: {
            type: "Function",
            functionType: {
              typeParameterList: [],
              parameterList: [
                {
                  type: "ImportedType",
                  importedType: {
                    moduleName: specifier.generatedFilterType,
                    nameAndArguments: {
                      name: identifierFromString(`${resource.name}Filter`),
                      arguments: [],
                    },
                  },
                },
                type.scopeInFile(identifierFromString("Context")),
              ],
              return: type.Promise({
                type: "ImportedType",
                importedType: {
                  moduleName: specifier.runtimeCommon,
                  nameAndArguments: {
                    name: identifierFromString("OrderedMap"),
                    arguments: [
                      {
                        type: "ImportedType",
                        importedType: {
                          moduleName: specifier.generatedId,
                          nameAndArguments: {
                            name: identifierFromString(resource.idName),
                            arguments: [],
                          },
                        },
                      },
                      type.union([{
                        type: "ImportedType",
                        importedType: {
                          moduleName: specifier.generatedType,
                          nameAndArguments: {
                            name: identifierFromString(`${resource.name}`),
                            arguments: [],
                          },
                        },
                      }, {
                        type: "ScopeInGlobal",
                        typeNameAndArguments: {
                          name: identifierFromString("Error"),
                          arguments: [],
                        },
                      }]),
                    ],
                  },
                },
              }),
            },
          },
        } satisfies type.MemberInput,
      ]
      : [],
    ...[...resource.oneApi].map((oneApiName): type.MemberInput => ({
      name: { type: "string", value: `get${oneApiName}` },
      type: {
        type: "Function",
        functionType: {
          typeParameterList: [],
          parameterList: [
            {
              type: "ScopeInFile",
              typeNameAndArguments: {
                name: identifierFromString("Context"),
                arguments: [],
              },
            },
          ],
          return: type.Promise(
            {
              type: "ImportedType",
              importedType: {
                moduleName: specifier.generatedType,
                nameAndArguments: {
                  name: identifierFromString(`${resource.name}`),
                  arguments: [],
                },
              },
            },
          ),
        },
      },
    })),
  ])),
});

const typeToTsType = (
  cType: Type,
  specifier: ServerNeedSpecifier,
): TsType => {
  switch (cType.type) {
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
          moduleName: specifier.generatedId,
          nameAndArguments: {
            name: identifierFromString(cType.name),
            arguments: [],
          },
        },
      };
    case "object":
      return type.object(cType.fields.map((field) => ({
        name: {
          type: "string",
          value: field.name,
        },
        type: typeToTsType(field.type, specifier),
      })));
  }
};

const operationsVariable = ({ specifier, schema }: {
  readonly specifier: ServerNeedSpecifier;
  readonly schema: Schema;
}): VariableDefinition => {
  return {
    export: true,
    name: identifierFromString("operations"),
    type: undefined,
    document: `HTTP サーバーの operations

https://jsr.io/@narumincho/http-server を使って処理することができる`,

    expr: expr.arrayLiteral(
      schema.resources.flatMap((resource): ReadonlyArray<ArrayItem> => [
        ...(resource.byIdSetApi
          ? [
            {
              expr: expr.call(
                expr.get({
                  type: "ImportedVariable",
                  importedVariable: {
                    moduleName: specifier.naruminchoHttpServer,
                    name: identifierFromString("operation"),
                  },
                }, "get"),
                [expr.objectLiteral([
                  expr.memberKeyValue(
                    "path",
                    expr.stringLiteral(`/${firstLowerCase(resource.name)}`),
                  ),
                  expr.memberKeyValue(
                    "queryParameters",
                    expr.objectLiteral([
                      expr.memberKeyValue(
                        "id",
                        expr.callMethod(
                          {
                            type: "ImportedVariable",
                            importedVariable: {
                              moduleName: specifier.naruminchoHttpServer,
                              name: identifierFromString("query"),
                            },
                          },
                          "array",
                          [expr.objectLiteral([
                            expr.memberKeyValue("deprecated", {
                              type: "BooleanLiteral",
                              bool: false,
                            }),
                            expr.memberKeyValue(
                              "description",
                              expr.stringLiteral(""),
                            ),
                            expr.memberKeyValue(
                              "example",
                              expr.arrayLiteral([]),
                            ),
                            expr.memberKeyValue(
                              "queryItemType",
                              expr.callMethod(
                                {
                                  type: "ImportedVariable",
                                  importedVariable: {
                                    moduleName: specifier.naruminchoHttpServer,
                                    name: identifierFromString("query"),
                                  },
                                },
                                "string",
                                [],
                              ),
                            ),
                          ])],
                        ),
                      ),
                    ]),
                  ),
                  expr.memberKeyValue(
                    "responses",
                    expr.arrayLiteral([{
                      spread: false,
                      expr: expr.call(
                        expr.get({
                          type: "ImportedVariable",
                          importedVariable: {
                            moduleName: specifier.naruminchoHttpServer,
                            name: identifierFromString("response"),
                          },
                        }, "ok"),
                        [expr.objectLiteral([
                          expr.memberKeyValue("headers", expr.arrayLiteral([])),
                          expr.memberKeyValue(
                            "description",
                            expr.stringLiteral(""),
                          ),
                          expr.memberKeyValue(
                            "content",
                            expr.arrayLiteral([{
                              spread: false,
                              expr: expr.call(
                                expr.get({
                                  type: "ImportedVariable",
                                  importedVariable: {
                                    moduleName: specifier.naruminchoHttpServer,
                                    name: identifierFromString("body"),
                                  },
                                }, "applicationJson"),
                                [expr.call(
                                  expr.get({
                                    type: "ImportedVariable",
                                    importedVariable: {
                                      moduleName:
                                        specifier.naruminchoHttpServer,
                                      name: identifierFromString("json"),
                                    },
                                  }, "object"),
                                  [expr.objectLiteral([])],
                                )],
                              ),
                            }]),
                          ),
                        ])],
                      ),
                    }]),
                  ),
                  expr.memberKeyValue(
                    "handler",
                    expr.lambda({
                      parameterList: [{
                        name: identifierFromString("parameter"),
                        type: undefined,
                      }],
                      returnType: undefined,
                      statementList: [
                        statement.return(
                          expr.call(
                            expr.get(
                              expr.get(
                                expr.variable(
                                  identifierFromString("parameter"),
                                ),
                                "response",
                              ),
                              "200",
                            ),
                            [
                              expr.objectLiteral([]),
                              expr.stringLiteral("application/json"),
                              expr.objectLiteral([]),
                            ],
                          ),
                        ),
                      ],
                    }),
                  ),
                ])],
              ),
              spread: false,
            } satisfies ArrayItem,
          ]
          : []),
        ...(resource.filterApi
          ? [
            {
              expr: expr.call(
                expr.get({
                  type: "ImportedVariable",
                  importedVariable: {
                    moduleName: specifier.naruminchoHttpServer,
                    name: identifierFromString("operation"),
                  },
                }, "get"),
                [expr.objectLiteral([
                  expr.memberKeyValue(
                    "path",
                    expr.stringLiteral(`/${firstLowerCase(resource.name)}List`),
                  ),
                  expr.memberKeyValue(
                    "responses",
                    expr.arrayLiteral([{
                      spread: false,
                      expr: expr.call(
                        expr.get({
                          type: "ImportedVariable",
                          importedVariable: {
                            moduleName: specifier.naruminchoHttpServer,
                            name: identifierFromString("response"),
                          },
                        }, "ok"),
                        [expr.objectLiteral([
                          expr.memberKeyValue("headers", expr.arrayLiteral([])),
                          expr.memberKeyValue(
                            "description",
                            expr.stringLiteral(""),
                          ),
                          expr.memberKeyValue(
                            "content",
                            expr.arrayLiteral([{
                              spread: false,
                              expr: expr.call(
                                expr.get({
                                  type: "ImportedVariable",
                                  importedVariable: {
                                    moduleName: specifier.naruminchoHttpServer,
                                    name: identifierFromString("body"),
                                  },
                                }, "applicationJson"),
                                [expr.call(
                                  expr.get({
                                    type: "ImportedVariable",
                                    importedVariable: {
                                      moduleName:
                                        specifier.naruminchoHttpServer,
                                      name: identifierFromString("json"),
                                    },
                                  }, "object"),
                                  [expr.objectLiteral([])],
                                )],
                              ),
                            }]),
                          ),
                        ])],
                      ),
                    }]),
                  ),
                  expr.memberKeyValue(
                    "handler",
                    expr.lambda({
                      parameterList: [{
                        name: identifierFromString("parameter"),
                        type: undefined,
                      }],
                      returnType: undefined,
                      statementList: [
                        statement.return(
                          expr.call(
                            expr.get(
                              expr.get(
                                expr.variable(
                                  identifierFromString("parameter"),
                                ),
                                "response",
                              ),
                              "200",
                            ),
                            [
                              expr.objectLiteral([]),
                              expr.stringLiteral("application/json"),
                              expr.objectLiteral([]),
                            ],
                          ),
                        ),
                      ],
                    }),
                  ),
                ])],
              ),
              spread: false,
            } satisfies ArrayItem,
          ]
          : []),
      ]),
    ),
  };
};

const handleFunctionBody = ({ schema, specifier }: {
  readonly schema: Schema;
  readonly specifier: ServerNeedSpecifier;
}): ReadonlyArray<Statement> => {
  return [
    {
      type: "VariableDefinition",
      variableDefinitionStatement: {
        name: identifierFromString("url"),
        isConst: true,
        type: {
          type: "ScopeInGlobal",
          typeNameAndArguments: {
            name: identifierFromString("URL"),
            arguments: [],
          },
        },
        expr: expr.newURL(
          expr.get(
            expr.get(
              expr.variable(identifierFromString("parameter")),
              "request",
            ),
            "url",
          ),
        ),
      },
    },
    {
      type: "Switch",
      switchStatement: {
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.runtimeServer,
            name: identifierFromString("startWithAndPickToEnd"),
          },
        }, [
          expr.get(expr.variable(identifierFromString("url")), "pathname"),
          expr.get(expr.variable(identifierFromString("parameter")), "prefix"),
        ]),
        patternList: schema.resources.flatMap<Pattern>((
          resource,
        ): ReadonlyArray<Pattern> => [
          ...(resource.byIdSetApi
            ? [
              {
                caseString: `/${firstLowerCase(resource.name)}`,
                statementList: callByIdSet({
                  specifier,
                  idName: identifierFromString(resource.idName),
                  implementName: `get${resource.name}ByIdSet`,
                }),
              } satisfies Pattern,
            ]
            : []),
          ...([...resource.oneApi].map((oneApiName) => ({
            caseString: `/${firstLowerCase(oneApiName)}`,
            statementList: [statement.return(expr.call(
              {
                type: "ImportedVariable",
                importedVariable: {
                  moduleName: specifier.runtimeServer,
                  name: identifierFromString("createOneResponse"),
                },
              },
              [expr.objectLiteral([
                {
                  type: "KeyValue",
                  keyValue: {
                    key: expr.stringLiteral("type"),
                    value: expr.stringLiteral("ok"),
                  },
                },
                {
                  type: "KeyValue",
                  keyValue: {
                    key: expr.stringLiteral("value"),
                    value: {
                      type: "UnaryOperator",
                      unaryOperatorExpr: {
                        operator: "await",
                        expr: (expr.callMethod(
                          expr.get(
                            expr.variable(identifierFromString("parameter")),
                            "implement",
                          ),
                          `get${oneApiName}`,
                          [
                            expr.get(
                              expr.variable(
                                identifierFromString("parameter"),
                              ),
                              "context",
                            ),
                          ],
                        )),
                      },
                    },
                  },
                },
              ])],
            ))],
          } satisfies Pattern))),
          ...(resource.filterApi
            ? [
              {
                caseString: `/${firstLowerCase(resource.name)}List`,
                statementList: callByFilter({ resource, specifier }),
              } satisfies Pattern,
            ]
            : []),
        ]),
      },
    },
    {
      type: "ThrowError",
      expr: {
        type: "New",
        callExpr: {
          expr: {
            type: "ImportedVariable",
            importedVariable: {
              moduleName: specifier.runtimeServer,
              name: identifierFromString("NotFoundError"),
            },
          },
          parameterList: [expr.stringLiteral("notFound path")],
        },
      },
    },
  ];
};

const callByIdSet = (
  { specifier, idName, implementName }: {
    readonly specifier: ServerNeedSpecifier;
    readonly idName: Identifier;
    readonly implementName: string;
  },
): ReadonlyArray<Statement> => {
  return [
    {
      type: "VariableDefinition",
      variableDefinitionStatement: {
        name: identifierFromString("idSet"),
        isConst: true,
        type: type.ReadonlySet({
          type: "ImportedType",
          importedType: {
            moduleName: specifier.generatedId,
            nameAndArguments: {
              name: idName,
              arguments: [],
            },
          },
        }),
        expr: expr.newSet(
          expr.arrayMap(
            expr.callMethod(
              expr.get(
                expr.variable(identifierFromString("url")),
                "searchParams",
              ),
              "getAll",
              [expr.stringLiteral("id")],
            ),
            {
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
                    moduleName: specifier.generatedId,
                    nameAndArguments: {
                      name: idName,
                      arguments: [],
                    },
                  },
                }],
              },
            },
          ),
        ),
      },
    },
    statement.return(expr.call({
      type: "ImportedVariable",
      importedVariable: {
        moduleName: specifier.runtimeServer,
        name: identifierFromString("createByIdSetResponse"),
      },
    }, [expr.variable(identifierFromString("idSet")), {
      type: "UnaryOperator",
      unaryOperatorExpr: {
        operator: "await",
        expr: expr.callMethod(
          expr.get(
            expr.variable(identifierFromString("parameter")),
            "implement",
          ),
          implementName,
          [
            expr.variable(identifierFromString("idSet")),
            expr.get(
              expr.variable(identifierFromString("parameter")),
              "context",
            ),
          ],
        ),
      },
    }])),
  ];
};

const callByFilter = (
  { specifier, resource }: {
    readonly specifier: ServerNeedSpecifier;
    readonly resource: Resource;
  },
): ReadonlyArray<Statement> => {
  return [statement.return(expr.call({
    type: "ImportedVariable",
    importedVariable: {
      moduleName: specifier.runtimeServer,
      name: identifierFromString("createByFilterResponse"),
    },
  }, [{
    type: "UnaryOperator",
    unaryOperatorExpr: {
      operator: "await",
      expr: expr.callMethod(
        expr.get(
          expr.variable(identifierFromString("parameter")),
          "implement",
        ),
        `get${resource.name}ByFilter`,
        [
          expr.call(
            {
              type: "ImportedVariable",
              importedVariable: {
                moduleName: specifier.generatedFilterSearchParamsCodec,
                name: identifierFromString(
                  `${firstLowerCase(resource.name)}FilterFromSearchParams`,
                ),
              },
            },
            [
              expr.get(
                expr.variable(identifierFromString("url")),
                "searchParams",
              ),
            ],
          ),
          expr.get(
            expr.variable(identifierFromString("parameter")),
            "context",
          ),
        ],
      ),
    },
  }]))];
};
