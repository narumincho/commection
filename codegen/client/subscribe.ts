import {
  definitionFunction,
  definitionTypeAlias,
  definitionVariable,
  FunctionDefinition,
  Identifier,
  identifierFromString,
  Member,
  Module,
  Statement,
  Type as TsType,
  TypeAlias,
} from "@narumincho/js-ts-code-generator";
import * as type from "@narumincho/js-ts-code-generator/type";
import * as statement from "@narumincho/js-ts-code-generator/statement";
import * as expr from "@narumincho/js-ts-code-generator/expr";
import { Schema } from "../schema.ts";
import { firstLowerCase } from "../util.ts";
import {
  getByIdSetFunctionName,
  getResourceListByFilterFunctionName,
  oneApiFunctionName,
} from "./request.ts";
import { filterFromSearchParamsFunctionName } from "../common.ts";

export type SubscribeNeedSpecifier = {
  readonly runtimeStore: string;
  readonly runtimeCallbacksAndDataStateMap: string;
  readonly runtimeCallbacksAndDataState: string;
  readonly generatedId: string;
  readonly generatedType: string;
  readonly generatedFilterType: string;
  readonly generatedFilterSearchParamsCodec: string;
  readonly generatedRequest: string;
};

const scheduledSymbolIdentifier = identifierFromString(
  "scheduledSymbol",
);

export const generateSubscribeCode = ({ specifier, schema }: {
  readonly specifier: SubscribeNeedSpecifier;
  readonly schema: Schema;
}): Module => {
  return {
    definitionList: [
      definitionVariable({
        export: false,
        name: scheduledSymbolIdentifier,
        document: "",
        type: { type: "uniqueSymbol" },
        expr: expr.call({
          type: "GlobalObjects",
          identifier: identifierFromString("Symbol"),
        }, []),
      }),
      definitionTypeAlias(
        createCommectionStateType({ schema, specifier }),
      ),
      definitionFunction(createCreateCommectionStateFunctionDefinition({
        schema,
        specifier,
      })),
      definitionTypeAlias(
        createRequestFragmentType({ schema, specifier }),
      ),
      definitionFunction(createScheduleFunctionDefinition()),
      definitionFunction(
        createRequestIfNeedFunctionDefinition({ schema, specifier }),
      ),
      definitionFunction(
        createCallbacksAndDataStateMapSubscribe({ specifier }),
      ),
    ],
    statementList: [],
  };
};

export const createStorePropertyName = (
  name: string,
): string => (`${firstLowerCase(name)}Store`);

export const createResourceAndCallbacksMapPropertyName = (
  name: string,
) => identifierFromString(`${firstLowerCase(name)}AndCallbacksMap`);

const createOnePropertyName = (
  name: string,
) => identifierFromString(`${firstLowerCase(name)}`);

const createCommectionStateType = ({ specifier, schema }: {
  readonly specifier: SubscribeNeedSpecifier;
  readonly schema: Schema;
}): TypeAlias => {
  return {
    export: true,
    name: identifierFromString("CommectionState"),
    document: "Commection の状態",
    namespace: [],
    typeParameterList: [],
    type: type.object([
      ...schema.resources.flatMap((
        resource,
      ): ReadonlyArray<type.MemberInput> => [
        ...(resource.byIdSetApi && resource.filterApi
          ? [
            {
              name: {
                type: "string",
                value: createStorePropertyName(resource.name),
              },
              type: {
                type: "ImportedType",
                importedType: {
                  moduleName: specifier.runtimeStore,
                  nameAndArguments: {
                    name: identifierFromString("Store"),
                    arguments: [{
                      type: "ImportedType",
                      importedType: {
                        moduleName: specifier.generatedId,
                        nameAndArguments: {
                          name: identifierFromString(resource.idName),
                          arguments: [],
                        },
                      },
                    }, {
                      type: "ImportedType",
                      importedType: {
                        moduleName: specifier.generatedType,
                        nameAndArguments: {
                          name: identifierFromString(resource.name),
                          arguments: [],
                        },
                      },
                    }],
                  },
                },
              },
            } satisfies type.MemberInput,
          ]
          : []),
        ...(resource.byIdSetApi && !resource.filterApi
          ? [
            {
              name: {
                type: "string",
                value: createResourceAndCallbacksMapPropertyName(resource.name),
              },
              type: callbacksAndDataStateMapType({
                specifier,
                idName: identifierFromString(resource.idName),
                resourceName: identifierFromString(resource.name),
              }),
            } satisfies type.MemberInput,
          ]
          : []),
        ...[...resource.oneApi].map((name): type.MemberInput => ({
          name: {
            type: "string",
            value: createOnePropertyName(name),
          },
          readonly: false,
          type: type.union([{
            type: "ImportedType",
            importedType: {
              moduleName: specifier.runtimeCallbacksAndDataState,
              nameAndArguments: {
                name: identifierFromString("CallbacksAndDataState"),
                arguments: [{
                  type: "ImportedType",
                  importedType: {
                    moduleName: specifier.generatedType,
                    nameAndArguments: {
                      name: identifierFromString(resource.name),
                      arguments: [],
                    },
                  },
                }],
              },
            },
          }, {
            type: "Undefined",
          }]),
        })),
      ]),
      {
        name: {
          type: "string",
          value: identifierFromString("bearerToken"),
        },
        type: type.union([{ type: "String" }, { type: "Undefined" }]),
      },
      {
        name: {
          type: "symbolExpr",
          value: expr.variable(scheduledSymbolIdentifier),
        },
        readonly: false,
        type: { type: "Boolean" },
      },
    ]),
  };
};

const callbacksAndDataStateMapType = (
  { specifier, idName, resourceName }: {
    readonly specifier: SubscribeNeedSpecifier;
    readonly idName: Identifier;
    readonly resourceName: Identifier;
  },
): TsType => {
  return {
    type: "ImportedType",
    importedType: {
      moduleName: specifier.runtimeCallbacksAndDataStateMap,
      nameAndArguments: {
        name: identifierFromString("CallbacksAndDataStateMap"),
        arguments: [{
          type: "ImportedType",
          importedType: {
            moduleName: specifier.generatedId,
            nameAndArguments: {
              name: idName,
              arguments: [],
            },
          },
        }, {
          type: "ImportedType",
          importedType: {
            moduleName: specifier.generatedType,
            nameAndArguments: {
              name: resourceName,
              arguments: [],
            },
          },
        }],
      },
    },
  };
};

const createRequestFragmentType = ({ specifier, schema }: {
  readonly specifier: SubscribeNeedSpecifier;
  readonly schema: Schema;
}): TypeAlias => {
  return {
    export: true,
    name: identifierFromString("RequestFragment"),
    document: "",
    namespace: [],
    typeParameterList: [],
    type: type.union(schema.resources.flatMap((resource) => [
      type.object([
        {
          name: { type: "string", value: "resourceName" },
          document: "",
          required: true,
          type: { type: "StringLiteral", string: resource.name },
        },
        {
          name: { type: "string", value: "target" },
          document: "",
          required: true,
          type: type.union([
            ...resource.filterApi
              ? [
                type.object([
                  {
                    name: { type: "string", value: "type" },
                    document: "",
                    required: true,
                    type: { type: "StringLiteral", string: "filter" },
                  },
                  {
                    name: { type: "string", value: "filter" },
                    document: "",
                    required: true,
                    type: {
                      type: "ImportedType",
                      importedType: {
                        moduleName: specifier.generatedFilterType,
                        nameAndArguments: {
                          name: identifierFromString(
                            `${resource.name}Filter`,
                          ),
                          arguments: [],
                        },
                      },
                    },
                  },
                ]),
              ]
              : [],
            ...resource.byIdSetApi
              ? [
                type.object([
                  {
                    name: { type: "string", value: "type" },
                    document: "",
                    required: true,
                    type: { type: "StringLiteral", string: "byIdSet" },
                  },
                  {
                    name: { type: "string", value: "idSet" },
                    document: "",
                    required: true,
                    type: type.ReadonlySet({
                      type: "ImportedType",
                      importedType: {
                        moduleName: specifier.generatedId,
                        nameAndArguments: {
                          name: identifierFromString(resource.idName),
                          arguments: [],
                        },
                      },
                    }),
                  },
                ]),
              ]
              : [],
            ...[...resource.oneApi].map((name) =>
              type.object([{
                name: { type: "string", value: "type" },
                document: "",
                required: true,
                type: { type: "StringLiteral", string: "one" },
              }, {
                name: { type: "string", value: "name" },
                document: "",
                required: true,
                type: { type: "StringLiteral", string: name },
              }])
            ),
          ]),
        },
      ]),
    ])),
  };
};

const createCreateCommectionStateFunctionDefinition = (
  { specifier, schema }: {
    readonly specifier: SubscribeNeedSpecifier;
    readonly schema: Schema;
  },
): FunctionDefinition => {
  return {
    export: true,
    name: identifierFromString("createCommectionState"),
    document: "",
    isAsync: false,
    typeParameterList: [],
    parameterList: [{
      name: identifierFromString("bearerToken"),
      document: "",
      type: type.union([{ type: "String" }, { type: "Undefined" }]),
    }],
    returnType: type.scopeInFile(identifierFromString("CommectionState")),
    statementList: [statement.return(expr.objectLiteral([
      ...schema.resources.flatMap((
        resource,
      ): ReadonlyArray<Member> => [
        ...(resource.byIdSetApi && resource.filterApi
          ? [
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral(
                  createStorePropertyName(resource.name),
                ),
                value: expr.call({
                  type: "ImportedVariable",
                  importedVariable: {
                    moduleName: specifier.runtimeStore,
                    name: identifierFromString("createStore"),
                  },
                }, []),
              },
            } satisfies Member,
          ]
          : []),
        ...(resource.byIdSetApi && !resource.filterApi
          ? [
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral(
                  createResourceAndCallbacksMapPropertyName(resource.name),
                ),
                value: expr.newMap(expr.arrayLiteral([])),
              },
            } satisfies Member,
          ]
          : []),
        ...[...resource.oneApi].map((name): Member => ({
          type: "KeyValue",
          keyValue: {
            key: expr.stringLiteral(createOnePropertyName(name)),
            value: { type: "UndefinedLiteral" },
          },
        })),
      ]),
      {
        type: "KeyValue",
        keyValue: {
          key: expr.stringLiteral("bearerToken"),
          value: expr.variable(identifierFromString("bearerToken")),
        },
      },
      {
        type: "KeyValue",
        keyValue: {
          key: expr.variable(scheduledSymbolIdentifier),
          value: { type: "BooleanLiteral", bool: false },
        },
      },
    ]))],
  };
};

const createScheduleFunctionDefinition = (): FunctionDefinition => {
  return {
    export: true,
    name: identifierFromString("schedule"),
    document: "データを取得する関数を呼ぶように予定を立てる",
    isAsync: false,
    typeParameterList: [],
    parameterList: [{
      name: identifierFromString("state"),
      document: "",
      type: type.scopeInFile(identifierFromString("CommectionState")),
    }],
    returnType: { type: "Void" },
    statementList: [
      statement.if({
        condition: {
          type: "Get",
          getExpr: {
            expr: expr.variable(identifierFromString("state")),
            propertyExpr: expr.variable(scheduledSymbolIdentifier),
          },
        },
        thenStatementList: [{ type: "ReturnVoid" }],
      }),
      statement.set({
        target: {
          type: "Get",
          getExpr: {
            expr: expr.variable(identifierFromString("state")),
            propertyExpr: expr.variable(scheduledSymbolIdentifier),
          },
        },
        expr: { type: "BooleanLiteral", bool: true },
        operatorMaybe: undefined,
      }),
      statement.evaluateExpr(expr.call({
        type: "GlobalObjects",
        identifier: identifierFromString("setTimeout"),
      }, [
        expr.lambda({
          isAsync: false,
          parameterList: [],
          returnType: { type: "Void" },
          typeParameterList: [],
          statementList: [
            statement.evaluateExpr(
              expr.call(
                expr.variable(identifierFromString("requestIfNeed")),
                [expr.variable(identifierFromString("state"))],
              ),
            ),
            statement.set({
              target: {
                type: "Get",
                getExpr: {
                  expr: expr.variable(identifierFromString("state")),
                  propertyExpr: expr.variable(scheduledSymbolIdentifier),
                },
              },
              expr: { type: "BooleanLiteral", bool: false },
              operatorMaybe: undefined,
            }),
          ],
        }),
        expr.numberLiteral(100),
      ])),
    ],
  };
};

const createRequestIfNeedFunctionDefinition = ({ specifier, schema }: {
  readonly specifier: SubscribeNeedSpecifier;
  readonly schema: Schema;
}): FunctionDefinition => {
  return {
    export: false,
    name: identifierFromString("requestIfNeed"),
    document: "リクエストが必要ならリクエストする",
    isAsync: false,
    typeParameterList: [],
    parameterList: [{
      name: identifierFromString("state"),
      document: "",
      type: type.scopeInFile(identifierFromString("CommectionState")),
    }],
    returnType: { type: "Void" },
    statementList: schema.resources.flatMap((
      resource,
    ): ReadonlyArray<Statement> => [
      ...(resource.byIdSetApi && resource.filterApi
        ? [
          statement.evaluateExpr(expr.call({
            type: "ImportedVariable",
            importedVariable: {
              moduleName: specifier.runtimeStore,
              name: identifierFromString("scanWaitForRequest"),
            },
          }, [
            expr.get(
              expr.variable(identifierFromString("state")),
              createStorePropertyName(resource.name),
            ),
            expr.lambda({
              parameterList: [{
                name: identifierFromString("idSet"),
                type: undefined,
              }],
              returnType: undefined,
              statementList: [statement.return(expr.call({
                type: "ImportedVariable",
                importedVariable: {
                  moduleName: specifier.generatedRequest,
                  name: getByIdSetFunctionName(resource.name),
                },
              }, [
                expr.variable(identifierFromString("idSet")),
                expr.get(
                  expr.variable(identifierFromString("state")),
                  "bearerToken",
                ),
              ]))],
            }),
            expr.lambda({
              parameterList: [{
                name: identifierFromString("filterString"),
                type: undefined,
              }],
              returnType: undefined,
              statementList: [
                statement.return(
                  expr.call(
                    {
                      type: "ImportedVariable",
                      importedVariable: {
                        moduleName: specifier.generatedRequest,
                        name: getResourceListByFilterFunctionName(
                          resource.name,
                        ),
                      },
                    },
                    [
                      expr.call({
                        type: "ImportedVariable",
                        importedVariable: {
                          moduleName:
                            specifier.generatedFilterSearchParamsCodec,
                          name: filterFromSearchParamsFunctionName(
                            resource.name,
                          ),
                        },
                      }, [{
                        type: "New",
                        callExpr: {
                          expr: {
                            type: "GlobalObjects",
                            identifier: identifierFromString("URLSearchParams"),
                          },
                          parameterList: [
                            expr.variable(identifierFromString("filterString")),
                          ],
                        },
                      }]),
                      expr.get(
                        expr.variable(identifierFromString("state")),
                        "bearerToken",
                      ),
                    ],
                  ),
                ),
              ],
            }),
          ])),
        ]
        : []),
      ...(resource.byIdSetApi && !resource.filterApi
        ? [
          statement.evaluateExpr(expr.call({
            type: "ImportedVariable",
            importedVariable: {
              moduleName: specifier.runtimeStore,
              name: identifierFromString("scanWaitForRequestByIds"),
            },
          }, [
            expr.get(
              expr.variable(identifierFromString("state")),
              createResourceAndCallbacksMapPropertyName(resource.name),
            ),
            expr.lambda({
              parameterList: [{
                name: identifierFromString("idSet"),
                type: undefined,
              }],
              returnType: undefined,
              statementList: [statement.return(expr.call({
                type: "ImportedVariable",
                importedVariable: {
                  moduleName: specifier.generatedRequest,
                  name: getByIdSetFunctionName(resource.name),
                },
              }, [
                expr.variable(identifierFromString("idSet")),
                expr.get(
                  expr.variable(identifierFromString("state")),
                  "bearerToken",
                ),
              ]))],
            }),
          ])),
        ]
        : []),
      ...[...resource.oneApi].map((name): Statement =>
        statement.evaluateExpr(expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.runtimeStore,
            name: identifierFromString("scanWaitForRequestOne"),
          },
        }, [
          expr.get(
            expr.variable(identifierFromString("state")),
            createOnePropertyName(name),
          ),
          expr.lambda({
            parameterList: [],
            returnType: undefined,
            statementList: [statement.return(expr.call({
              type: "ImportedVariable",
              importedVariable: {
                moduleName: specifier.generatedRequest,
                name: oneApiFunctionName(name),
              },
            }, [
              expr.get(
                expr.variable(identifierFromString("state")),
                "bearerToken",
              ),
            ]))],
          }),
        ]))
      ),
    ]),
  };
};

const callbacksAndDataStateMapSubscribeFunctionName = identifierFromString(
  "callbacksAndDataStateMapSubscribe",
);

const createCallbacksAndDataStateMapSubscribe = (
  { specifier }: {
    readonly specifier: SubscribeNeedSpecifier;
  },
): FunctionDefinition => {
  const unsubscribeFunctionName = identifierFromString(`unsubscribe`);
  const parameter = expr.variable(identifierFromString("parameter"));
  return {
    isAsync: false,
    document: "",
    export: true,
    name: callbacksAndDataStateMapSubscribeFunctionName,
    typeParameterList: [
      { name: identifierFromString("Key") },
      { name: identifierFromString("Resource") },
    ],
    parameterList: [{
      name: identifierFromString("parameter"),
      document: "",
      type: type.object([
        {
          name: { type: "string", value: "state" },
          document: "",
          type: type.scopeInFile(identifierFromString("CommectionState")),
        },
        {
          name: { type: "string", value: "callbacksAndDataStateMap" },
          document: "",
          type: {
            type: "ImportedType",
            importedType: {
              moduleName: specifier.runtimeCallbacksAndDataStateMap,
              nameAndArguments: {
                name: identifierFromString("CallbacksAndDataStateMap"),
                arguments: [
                  type.scopeInFile(identifierFromString("Key")),
                  type.scopeInFile(identifierFromString("Resource")),
                ],
              },
            },
          },
        },
        {
          name: { type: "string", value: "key" },
          document: "",
          type: type.scopeInFile(identifierFromString("Key")),
        },
        {
          name: { type: "string", value: "onStoreChange" },
          document: "",
          type: {
            type: "Function",
            functionType: {
              typeParameterList: [],
              parameterList: [],
              return: { type: "Void" },
            },
          },
        },
      ]),
    }],
    returnType: {
      type: "Function",
      functionType: {
        typeParameterList: [],
        parameterList: [],
        return: { type: "Void" },
      },
    },
    statementList: [
      statement.evaluateExpr(
        expr.call(expr.variable(identifierFromString("schedule")), [
          expr.get(parameter, "state"),
        ]),
      ),
      statement.evaluateExpr(expr.call({
        type: "ImportedVariable",
        importedVariable: {
          moduleName: specifier.runtimeCallbacksAndDataStateMap,
          name: identifierFromString("addCallbackInMap"),
        },
      }, [
        expr.get(parameter, "callbacksAndDataStateMap"),
        expr.get(parameter, "key"),
        expr.get(parameter, "onStoreChange"),
      ])),
      statement.variableDefinition({
        name: unsubscribeFunctionName,
        isConst: true,
        type: {
          type: "Function",
          functionType: {
            typeParameterList: [],
            parameterList: [],
            return: { type: "Void" },
          },
        },
        expr: expr.lambda({
          parameterList: [],
          returnType: { type: "Void" },
          statementList: [
            statement.evaluateExpr(expr.call({
              type: "ImportedVariable",
              importedVariable: {
                moduleName: specifier.runtimeCallbacksAndDataStateMap,
                name: identifierFromString("deleteCallbackInMap"),
              },
            }, [
              expr.get(parameter, "callbacksAndDataStateMap"),
              expr.get(parameter, "key"),
              expr.get(parameter, "onStoreChange"),
            ])),
          ],
        }),
      }),
      statement.return(expr.variable(unsubscribeFunctionName)),
    ],
  };
};
