import {
  type Definition,
  definitionFunction,
  definitionVariable,
  type Expr,
  identifierFromString,
  type Module,
  type Statement,
  type VariableDefinition,
} from "@narumincho/js-ts-code-generator";
import type { Resource, Schema } from "../schema.ts";
import * as expr from "@narumincho/js-ts-code-generator/expr";
import * as type from "@narumincho/js-ts-code-generator/type";
import * as statement from "@narumincho/js-ts-code-generator/statement";
import { firstLowerCase } from "../util.ts";
import {
  createResourceAndCallbacksMapPropertyName,
  createStorePropertyName,
} from "./subscribe.ts";
import {
  createFilterTypeName,
  filterToSearchParamsFunctionName,
} from "../common.ts";

export type ReactNeedSpecifier = {
  readonly runtimeStore: string;
  readonly runtimeCallbacksAndDataStateMap: string;
  readonly runtimeCallbacksAndDataState: string;
  readonly runtimeDataState: string;
  readonly runtimeReact: string;
  readonly generatedId: string;
  readonly generatedType: string;
  readonly generatedFilterType: string;
  readonly generatedFilterSearchParamsCodec: string;
  readonly generatedRequest: string;
  readonly generatedSubscribe: string;
  readonly react: string;
};

export const generateReactSubscribeCode = ({ specifier, schema }: {
  readonly specifier: ReactNeedSpecifier;
  readonly schema: Schema;
}): Module => {
  return {
    definitionList: [
      definitionVariable(createCommectionContextVariable(specifier)),
      crateCommectionProvider(specifier),
      createUseCommectionFunction(specifier),
      createUseResourceFunction(specifier),
      ...schema.resources.flatMap((resource) =>
        createHookFunctionsFromResource({ resource, specifier })
      ),
    ],
    statementList: [],
  };
};

const commectionContextName = identifierFromString("CommectionContext");

const createCommectionContextVariable = (
  specifier: ReactNeedSpecifier,
): VariableDefinition => ({
  name: commectionContextName,
  type: undefined,
  document: `commection のデータの保管庫を作る.
storybookのようなコンポーネントのサンプルデータを表示するために分けることもできる`,
  export: false,
  expr: expr.call({
    type: "WithTypeArguments",
    withTypeArguments: {
      expr: {
        type: "ImportedVariable",
        importedVariable: {
          moduleName: specifier.react,
          name: identifierFromString("createContext"),
        },
      },
      types: [type.union([{
        type: "ImportedType",
        importedType: {
          moduleName: specifier.generatedSubscribe,
          nameAndArguments: {
            name: identifierFromString("CommectionState"),
            arguments: [],
          },
        },
      }, { type: "Undefined" }])],
    },
  }, [{ type: "UndefinedLiteral" }]),
});

const commectionProviderName = identifierFromString("CommectionProvider");

const crateCommectionProvider = (specifier: ReactNeedSpecifier): Definition => {
  const bearerTokenVariable = expr.get(
    expr.variable(identifierFromString("props")),
    "bearerToken",
  );
  return definitionFunction({
    name: commectionProviderName,
    document: `commection のデータの保管庫を作る.

storybookのようなコンポーネントのサンプルデータを表示するために分けることもできる
`,
    export: true,
    returnType: undefined,
    parameterList: [{
      name: identifierFromString("props"),
      type: type.object([{
        name: { type: "string", value: "bearerToken" },
        type: type.union([{ type: "String" }, { type: "Undefined" }]),
      }, {
        name: { type: "string", value: "children" },
        type: {
          type: "ImportedType",
          importedType: {
            moduleName: specifier.react,
            nameAndArguments: {
              name: identifierFromString("ReactNode"),
              arguments: [],
            },
          },
        },
      }]),
      document: "",
    }],
    statementList: [
      statement.variableDefinition({
        name: identifierFromString("ref"),
        type: undefined,
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.react,
            name: identifierFromString("useRef"),
          },
        }, [
          expr.call(
            {
              type: "ImportedVariable",
              importedVariable: {
                moduleName: specifier.generatedSubscribe,
                name: identifierFromString("createCommectionState"),
              },
            },
            [bearerTokenVariable],
          ),
        ]),
      }),
      statement.evaluateExpr(expr.call({
        type: "ImportedVariable",
        importedVariable: {
          moduleName: specifier.react,
          name: identifierFromString("useEffect"),
        },
      }, [
        expr.lambda({
          parameterList: [],
          returnType: undefined,
          statementList: [
            statement.if({
              condition: expr.notEqual(
                expr.get(
                  expr.get(
                    expr.variable(identifierFromString("ref")),
                    "current",
                  ),
                  "bearerToken",
                ),
                bearerTokenVariable,
              ),
              thenStatementList: [
                statement.set({
                  target: expr.get(
                    expr.variable(identifierFromString("ref")),
                    "current",
                  ),
                  expr: expr.call(
                    {
                      type: "ImportedVariable",
                      importedVariable: {
                        moduleName: specifier.generatedSubscribe,
                        name: identifierFromString("createCommectionState"),
                      },
                    },
                    [bearerTokenVariable],
                  ),
                  operatorMaybe: undefined,
                }),
              ],
            }),
          ],
        }),
        expr.arrayLiteral([{ expr: bearerTokenVariable, spread: false }]),
      ])),
      statement.return(expr.call({
        type: "ImportedVariable",
        importedVariable: {
          moduleName: specifier.react,
          name: identifierFromString("createElement"),
        },
      }, [
        expr.get(expr.variable(commectionContextName), "Provider"),
        expr.objectLiteral([
          {
            type: "KeyValue",
            keyValue: {
              key: expr.stringLiteral("value"),
              value: expr
                .get(expr.variable(identifierFromString("ref")), "current"),
            },
          },
        ]),
        expr.get(
          expr.variable(identifierFromString("props")),
          "children",
        ),
      ])),
    ],
  });
};

const createUseCommectionFunction = (
  specifier: ReactNeedSpecifier,
): Definition => {
  return definitionFunction({
    name: identifierFromString("useCommection"),
    document: "",
    export: true,
    returnType: type.union([{
      type: "ImportedType",
      importedType: {
        moduleName: specifier.generatedSubscribe,
        nameAndArguments: {
          name: identifierFromString("CommectionState"),
          arguments: [],
        },
      },
    }]),
    parameterList: [],
    statementList: [
      statement.variableDefinition({
        name: identifierFromString("state"),
        type: undefined,
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.react,
            name: identifierFromString("useContext"),
          },
        }, [
          expr.variable(commectionContextName),
        ]),
      }),
      statement.if({
        condition: expr.logicalNot(
          expr.variable(identifierFromString("state")),
        ),
        thenStatementList: [
          {
            type: "ThrowError",
            expr: {
              type: "New",
              callExpr: {
                expr: {
                  type: "GlobalObjects",
                  identifier: identifierFromString("Error"),
                },
                parameterList: [
                  expr.stringLiteral(
                    "need <CommectionProvider><Component /><CommectionProvider>",
                  ),
                ],
              },
            },
          },
        ],
      }),
      statement.return(expr.variable(identifierFromString("state"))),
    ],
  });
};

const createUseResourceFunction = (
  specifier: ReactNeedSpecifier,
): Definition => {
  return definitionFunction({
    export: false,
    name: identifierFromString("useResource"),
    typeParameterList: [{
      name: identifierFromString("Id"),
      constraint: {
        type: "String",
      },
    }, {
      name: identifierFromString("Resource"),
    }],
    parameterList: [{
      name: identifierFromString("id"),
      type: type.union([type.scopeInFile(identifierFromString("Id")), {
        type: "Undefined",
      }]),
      document: "ID 未指定であればリクエストは送られない",
    }, {
      name: identifierFromString("state"),
      type: {
        type: "ImportedType",
        importedType: {
          moduleName: specifier.generatedSubscribe,
          nameAndArguments: {
            name: identifierFromString("CommectionState"),
            arguments: [],
          },
        },
      },
      document: "",
    }, {
      name: identifierFromString("callbacksAndDataStateMap"),
      type: {
        type: "ImportedType",
        importedType: {
          moduleName: specifier.runtimeCallbacksAndDataStateMap,
          nameAndArguments: {
            name: identifierFromString("CallbacksAndDataStateMap"),
            arguments: [
              type.scopeInFile(identifierFromString("Id")),
              type.scopeInFile(identifierFromString("Resource")),
            ],
          },
        },
      },
      document: "",
    }],
    returnType: {
      type: "ImportedType",
      importedType: {
        moduleName: specifier.runtimeReact,
        nameAndArguments: {
          name: identifierFromString("HookResult"),
          arguments: [
            type.scopeInFile(identifierFromString("Resource")),
          ],
        },
      },
    },
    statementList: [
      useCallback({
        specifier,
        functionName: "subscribe",
        lambdaInput: {
          parameterList: [{
            name: identifierFromString("onStoreChange"),
            type: {
              type: "Function",
              functionType: {
                typeParameterList: [],
                parameterList: [],
                return: { type: "Void" },
              },
            },
          }],
          returnType: undefined,
          statementList: [
            statement.return({
              type: "ConditionalOperator",
              conditionalOperatorExpr: {
                condition: expr.variable(identifierFromString("id")),
                thenExpr: expr.call(
                  {
                    type: "ImportedVariable",
                    importedVariable: {
                      moduleName: specifier.generatedSubscribe,
                      name: identifierFromString(
                        "callbacksAndDataStateMapSubscribe",
                      ),
                    },
                  },
                  [expr.objectLiteral([
                    expr.memberKeyValue(
                      "state",
                      expr.variable(identifierFromString("state")),
                    ),
                    expr.memberKeyValue(
                      "callbacksAndDataStateMap",
                      expr.variable(
                        identifierFromString("callbacksAndDataStateMap"),
                      ),
                    ),
                    expr.memberKeyValue(
                      "key",
                      expr.variable(identifierFromString("id")),
                    ),
                    expr.memberKeyValue(
                      "onStoreChange",
                      expr.variable(
                        identifierFromString("onStoreChange"),
                      ),
                    ),
                  ])],
                ),
                elseExpr: expr.lambda({
                  parameterList: [],
                  returnType: undefined,
                  statementList: [],
                }),
              },
            }),
          ],
        },
        dependencies: [
          expr.variable(identifierFromString("id")),
          expr.variable(identifierFromString("callbacksAndDataStateMap")),
        ],
      }),
      statement.variableDefinition({
        name: identifierFromString("dataState"),
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.react,
            name: identifierFromString("useSyncExternalStore"),
          },
        }, [
          expr.variable(identifierFromString("subscribe")),
          expr.lambda({
            parameterList: [],
            returnType: undefined,
            statementList: [
              statement.if({
                condition: expr.logicalNot(
                  expr.variable(identifierFromString("id")),
                ),
                thenStatementList: [
                  statement.return({
                    type: "ImportedVariable",
                    importedVariable: {
                      moduleName: specifier.runtimeDataState,
                      name: identifierFromString("dataStateNone"),
                    },
                  }),
                ],
              }),
              statement.return(expr.call({
                type: "ImportedVariable",
                importedVariable: {
                  moduleName: specifier.runtimeCallbacksAndDataStateMap,
                  name: identifierFromString("getDataStateInMap"),
                },
              }, [
                expr.variable(identifierFromString("callbacksAndDataStateMap")),
                expr.variable(identifierFromString("id")),
              ])),
            ],
          }),
        ]),
      }),
      useCallback({
        specifier,
        functionName: "refetch",
        lambdaInput: {
          parameterList: [],
          returnType: undefined,
          statementList: [
            statement.if({
              condition: expr.variable(identifierFromString("id")),
              thenStatementList: [
                statement.evaluateExpr(expr.call({
                  type: "ImportedVariable",
                  importedVariable: {
                    moduleName: specifier.runtimeCallbacksAndDataStateMap,
                    name: identifierFromString("setWaitForRequest"),
                  },
                }, [
                  expr.variable(
                    identifierFromString("callbacksAndDataStateMap"),
                  ),
                  expr.variable(identifierFromString("id")),
                ])),
                statement.evaluateExpr(expr.call({
                  type: "ImportedVariable",
                  importedVariable: {
                    moduleName: specifier.generatedSubscribe,
                    name: identifierFromString("schedule"),
                  },
                }, [expr.variable(identifierFromString("state"))])),
              ],
            }),
          ],
        },
        dependencies: [
          expr.variable(identifierFromString("id")),
          expr.variable(identifierFromString("callbacksAndDataStateMap")),
        ],
      }),
      statement.variableDefinition({
        name: identifierFromString("result"),
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.react,
            name: identifierFromString("useMemo"),
          },
        }, [
          expr.lambda({
            parameterList: [],
            returnType: undefined,
            statementList: [statement.return(expr.objectLiteral([
              expr.memberKeyValue(
                "dataState",
                expr.variable(identifierFromString("dataState")),
              ),
              expr.memberKeyValue(
                "refetch",
                expr.variable(identifierFromString("refetch")),
              ),
            ]))],
          }),
          expr.arrayLiteral([
            {
              expr: expr.variable(identifierFromString("dataState")),
              spread: false,
            },
            {
              expr: expr.variable(identifierFromString("refetch")),
              spread: false,
            },
          ]),
        ]),
      }),
      statement.return(expr.variable(identifierFromString("result"))),
    ],
  });
};

const createHookFunctionsFromResource = (
  { resource, specifier }: {
    readonly resource: Resource;
    readonly specifier: ReactNeedSpecifier;
  },
): ReadonlyArray<Definition> => {
  return [
    ...resource.byIdSetApi
      ? [createByIdHookFunctionFromResource({ resource, specifier })]
      : [],
    ...resource.filterApi
      ? [
        createByFilterHookFunctionFromResource({
          resource,
          specifier,
          target: "idsByFilter",
        }),
        createByFilterHookFunctionFromResource({
          resource,
          specifier,
          target: "itemsByFilter",
        }),
      ]
      : [],
  ];
};

const createByIdHookFunctionFromResource = (
  { resource, specifier }: {
    readonly resource: Resource;
    readonly specifier: ReactNeedSpecifier;
  },
) => {
  return definitionFunction({
    export: true,
    document: `\`\`\`ts
use${resource.name}('a')
use${resource.name}('b')
use${resource.name}('c')
use${resource.name}('c')
\`\`\`
は
\`\`\`ts
await fetch('/commection/${firstLowerCase(resource.name)}?id=a&id=b&id=c')
\`\`\`

のようにまとめてリクエストを送られる
`,
    name: identifierFromString(`use${resource.name}`),
    parameterList: [{
      name: identifierFromString("id"),
      document: "ID 未指定であればリクエストは送られない",
      type: type.union([{
        type: "ImportedType",
        importedType: {
          moduleName: specifier.generatedId,
          nameAndArguments: {
            name: identifierFromString(resource.idName),
            arguments: [],
          },
        },
      }, { type: "Undefined" }]),
    }],
    returnType: {
      type: "ImportedType",
      importedType: {
        moduleName: specifier.runtimeReact,
        nameAndArguments: {
          name: identifierFromString("HookResult"),
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
    },
    statementList: [
      statement.variableDefinition({
        name: identifierFromString("state"),
        expr: expr.call(
          expr.variable(identifierFromString("useCommection")),
          [],
        ),
      }),
      statement.variableDefinition({
        name: identifierFromString("result"),
        expr: expr.call(expr.variable(identifierFromString("useResource")), [
          expr.variable(identifierFromString("id")),
          expr.variable(identifierFromString("state")),
          resource.filterApi
            ? expr.get(
              expr.get(
                expr.variable(identifierFromString("state")),
                createStorePropertyName(resource.name),
              ),
              "itemById",
            )
            : expr.get(
              expr.variable(identifierFromString("state")),
              createResourceAndCallbacksMapPropertyName(resource.name),
            ),
        ]),
      }),
      statement.return(expr.variable(identifierFromString("result"))),
    ],
  });
};

const createByFilterHookFunctionFromResource = (
  { resource, specifier, target }: {
    readonly resource: Resource;
    readonly specifier: ReactNeedSpecifier;
    readonly target: "idsByFilter" | "itemsByFilter";
  },
) => {
  const callbacksAndDataStateMap = expr.get(
    expr.get(
      expr.variable(identifierFromString("state")),
      createStorePropertyName(resource.name),
    ),
    target,
  );
  return definitionFunction({
    export: true,
    name: identifierFromString(
      target === "idsByFilter"
        ? `use${resource.name}Ids`
        : `use${resource.name}Array`,
    ),
    document: target === "idsByFilter"
      ? `指定したフィルターの条件を満たす ${resource.name} を取得しその ID を配列として返す.

IDを返すので Resource のデータが変わっても IDが変わらなければ再レンダリングされない`
      : `指定したフィルターの条件を満たす ${resource.name} を取得し配列として返す.

どれか1つでもResource のデータが変わったら再レンダリングされるので, 並び替えや集計処理をしないのなら {@link use${resource.name}Ids}を使うことをおすすめします`,
    parameterList: [{
      name: identifierFromString("filter"),
      document: "フィルター",
      type: {
        type: "ImportedType",
        importedType: {
          moduleName: specifier.generatedFilterType,
          nameAndArguments: {
            name: createFilterTypeName(resource.name),
            arguments: [],
          },
        },
      },
    }],
    returnType: {
      type: "ImportedType",
      importedType: {
        moduleName: specifier.runtimeReact,
        nameAndArguments: {
          name: identifierFromString("HookResult"),
          arguments: [type.ReadonlyArray(
            {
              type: "ImportedType",
              importedType: target === "idsByFilter"
                ? {
                  moduleName: specifier.generatedId,
                  nameAndArguments: {
                    name: identifierFromString(resource.idName),
                    arguments: [],
                  },
                }
                : {
                  moduleName: specifier.runtimeStore,
                  nameAndArguments: {
                    name: identifierFromString("ItemsByFilterItem"),
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
          )],
        },
      },
    },
    statementList: [
      statement.variableDefinition({
        name: identifierFromString("state"),
        expr: expr.call(
          expr.variable(identifierFromString("useCommection")),
          [],
        ),
      }),
      statement.variableDefinition({
        name: identifierFromString("filterString"),
        expr: expr.callMethod(
          expr.call({
            type: "ImportedVariable",
            importedVariable: {
              moduleName: specifier.generatedFilterSearchParamsCodec,
              name: filterToSearchParamsFunctionName(resource.name),
            },
          }, [
            expr.variable(identifierFromString("filter")),
          ]),
          "toString",
          [],
        ),
      }),
      useCallback({
        specifier,
        functionName: "subscribe",
        lambdaInput: {
          parameterList: [
            {
              name: identifierFromString("onStoreChange"),
              type: {
                type: "Function",
                functionType: {
                  parameterList: [],
                  return: { type: "Void" },
                  typeParameterList: [],
                },
              },
            },
          ],
          returnType: undefined,
          statementList: [statement.return(expr.call({
            type: "ImportedVariable",
            importedVariable: {
              moduleName: specifier.generatedSubscribe,
              name: identifierFromString("callbacksAndDataStateMapSubscribe"),
            },
          }, [expr.objectLiteral([
            expr.memberKeyValue(
              "state",
              expr.variable(identifierFromString("state")),
            ),
            expr.memberKeyValue(
              "callbacksAndDataStateMap",
              callbacksAndDataStateMap,
            ),
            expr.memberKeyValue(
              "key",
              expr.variable(identifierFromString("filterString")),
            ),
            expr.memberKeyValue(
              "onStoreChange",
              expr.variable(
                identifierFromString("onStoreChange"),
              ),
            ),
          ])]))],
        },
        dependencies: [
          expr.variable(identifierFromString("filterString")),
          expr.variable(identifierFromString("state")),
        ],
      }),
      statement.variableDefinition({
        name: identifierFromString("dataState"),
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.react,
            name: identifierFromString("useSyncExternalStore"),
          },
        }, [
          expr.variable(identifierFromString("subscribe")),
          expr.lambda({
            parameterList: [],
            returnType: undefined,
            statementList: [statement.return(expr.call({
              type: "ImportedVariable",
              importedVariable: {
                moduleName: specifier.runtimeCallbacksAndDataStateMap,
                name: identifierFromString("getDataStateInMap"),
              },
            }, [
              callbacksAndDataStateMap,
              expr.variable(identifierFromString("filterString")),
            ]))],
          }),
        ]),
      }),
      useCallback({
        specifier,
        functionName: "refetch",
        lambdaInput: {
          parameterList: [],
          returnType: undefined,
          statementList: [
            statement.evaluateExpr(expr.call({
              type: "ImportedVariable",
              importedVariable: {
                moduleName: specifier.runtimeCallbacksAndDataStateMap,
                name: identifierFromString("setWaitForRequest"),
              },
            }, [
              callbacksAndDataStateMap,
              expr.variable(identifierFromString("filterString")),
            ])),
            statement.evaluateExpr(expr.call({
              type: "ImportedVariable",
              importedVariable: {
                moduleName: specifier.generatedSubscribe,
                name: identifierFromString("schedule"),
              },
            }, [expr.variable(identifierFromString("state"))])),
          ],
        },
        dependencies: [],
      }),
      statement.variableDefinition({
        name: identifierFromString("result"),
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.react,
            name: identifierFromString("useMemo"),
          },
        }, [
          expr.lambda({
            parameterList: [],
            returnType: undefined,
            statementList: [statement.return(expr.objectLiteral([
              expr.memberKeyValue(
                "dataState",
                expr.variable(identifierFromString("dataState")),
              ),
              expr.memberKeyValue(
                "refetch",
                expr.variable(identifierFromString("refetch")),
              ),
            ]))],
          }),
          expr.arrayLiteral([
            {
              spread: false,
              expr: expr.variable(identifierFromString("dataState")),
            },
            {
              spread: false,
              expr: expr.variable(identifierFromString("refetch")),
            },
          ]),
        ]),
      }),
      statement.return(expr.variable(identifierFromString("result"))),
    ],
  });
};

const useCallback = ({ specifier, functionName, lambdaInput, dependencies }: {
  readonly specifier: ReactNeedSpecifier;
  readonly functionName: string;
  readonly lambdaInput: expr.LambdaInput;
  readonly dependencies: ReadonlyArray<Expr>;
}): Statement => {
  return statement.variableDefinition({
    name: identifierFromString(functionName),
    expr: expr.call({
      type: "ImportedVariable",
      importedVariable: {
        moduleName: specifier.react,
        name: identifierFromString("useCallback"),
      },
    }, [
      expr.lambda(lambdaInput),
      expr.arrayLiteral(dependencies.map((expr) => ({ expr, spread: false }))),
    ]),
  });
};
