import {
  definitionFunction,
  type FunctionDefinition,
  type Identifier,
  identifierFromString,
  type Module,
  type Type as TsType,
} from "@narumincho/js-ts-code-generator";
import type { Schema } from "../schema.ts";
import * as type from "@narumincho/js-ts-code-generator/type";
import * as statement from "@narumincho/js-ts-code-generator/statement";
import * as expr from "@narumincho/js-ts-code-generator/expr";
import { firstLowerCase } from "../util.ts";

export type RequestNeedSpecifier = {
  readonly runtimeRequest: string;
  readonly generatedId: string;
  readonly generatedType: string;
  readonly generatedFilterType: string;
  readonly generatedFilterSearchParamsCodec: string;
};

export const generateRequestCode = (
  { specifier, schema, serverUrlPrefix }: {
    readonly specifier: RequestNeedSpecifier;
    readonly schema: Schema;
    readonly serverUrlPrefix: string;
  },
): Module => {
  return {
    definitionList: [
      {
        type: "variable",
        variable: {
          export: false,
          name: identifierFromString("prefix"),
          type: {
            type: "String",
          },
          document: "",
          expr: expr.stringLiteral(serverUrlPrefix),
        },
      },
      ...schema.resources.filter((resource) => resource.byIdSetApi).flatMap((
        resource,
      ) =>
        definitionFunction(getByIdSetFunction({
          specifier,
          name: resource.name,
          idName: identifierFromString(resource.idName),
        }))
      ),
      ...schema.resources.filter((resource) => resource.filterApi).map((
        resource,
      ) =>
        definitionFunction(getResourceListByFilterFunction({
          specifier,
          name: resource.name,
          idName: resource.idName,
          filterName: identifierFromString(`${resource.name}Filter`),
        }))
      ),
      ...schema.resources.flatMap((resource) =>
        [...resource.oneApi].map((name) =>
          definitionFunction(
            crateOneApiFunction({
              specifier,
              name,
              recourseName: resource.name,
            }),
          )
        )
      ),
    ],
    statementList: [],
  };
};

export const getByIdSetFunctionName = (name: string): Identifier =>
  identifierFromString(`get${name}ByIdSet`);

const getByIdSetFunction = ({ specifier, name, idName }: {
  readonly name: string;
  readonly idName: Identifier;
  readonly specifier: RequestNeedSpecifier;
}): FunctionDefinition => {
  const id: TsType = {
    type: "ImportedType",
    importedType: {
      moduleName: specifier.generatedId,
      nameAndArguments: {
        name: idName,
        arguments: [],
      },
    },
  };

  return {
    export: true,
    name: getByIdSetFunctionName(name),
    typeParameterList: [],
    document: "",
    isAsync: true,
    parameterList: [
      {
        name: identifierFromString("idSet"),
        type: type.ReadonlySet(id),
        document: "",
      },
      {
        name: identifierFromString("bearerToken"),
        type: type.union([{ type: "String" }, { type: "Undefined" }]),
        document: "",
      },
    ],
    returnType: type.Promise(
      type.ReadonlyMap(id, {
        type: "ImportedType",
        importedType: {
          moduleName: specifier.runtimeRequest,
          nameAndArguments: {
            name: identifierFromString("DataOrError"),
            arguments: [
              {
                type: "ImportedType",
                importedType: {
                  moduleName: specifier.generatedType,
                  nameAndArguments: {
                    name: identifierFromString(`${name}`),
                    arguments: [],
                  },
                },
              },
            ],
          },
        },
      }),
    ),
    statementList: [statement.return({
      type: "UnaryOperator",
      unaryOperatorExpr: {
        operator: "await",
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.runtimeRequest,
            name: identifierFromString("getResourceMultipleByIdSet"),
          },
        }, [
          expr.objectLiteral([
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
                key: expr.stringLiteral("idSet"),
                value: expr.variable(identifierFromString("idSet")),
              },
            },
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("prefix"),
                value: expr.variable(identifierFromString("prefix")),
              },
            },
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("resourceName"),
                value: expr.stringLiteral(firstLowerCase(name)),
              },
            },
          ]),
        ]),
      },
    })],
  };
};

export const getResourceListByFilterFunctionName = (name: string): Identifier =>
  identifierFromString(`get${name}ListByFilter`);

const getResourceListByFilterFunction = (
  { specifier, name, idName, filterName }: {
    readonly specifier: RequestNeedSpecifier;
    readonly name: string;
    readonly idName: string;
    readonly filterName: Identifier;
  },
): FunctionDefinition => {
  return {
    export: true,
    isAsync: true,
    name: getResourceListByFilterFunctionName(name),
    document: "",
    typeParameterList: [],
    parameterList: [
      {
        name: identifierFromString("filter"),
        type: {
          type: "ImportedType",
          importedType: {
            moduleName: specifier.generatedFilterType,
            nameAndArguments: {
              name: filterName,
              arguments: [],
            },
          },
        },
        document: "",
      },
      {
        name: identifierFromString("bearerToken"),
        type: type.union([{ type: "String" }, { type: "Undefined" }]),
        document: "",
      },
    ],
    returnType: type.Promise(
      {
        type: "ImportedType",
        importedType: {
          moduleName: specifier.runtimeRequest,
          nameAndArguments: {
            name: identifierFromString("FilterResponse"),
            arguments: [
              {
                type: "ImportedType",
                importedType: {
                  moduleName: specifier.generatedId,
                  nameAndArguments: {
                    name: identifierFromString(idName),
                    arguments: [],
                  },
                },
              },
              {
                type: "ImportedType",
                importedType: {
                  moduleName: specifier.generatedType,
                  nameAndArguments: {
                    name: identifierFromString(`${name}`),
                    arguments: [],
                  },
                },
              },
            ],
          },
        },
      },
    ),
    statementList: [statement.return({
      type: "UnaryOperator",
      unaryOperatorExpr: {
        operator: "await",
        expr: expr.call({
          type: "ImportedVariable",
          importedVariable: {
            moduleName: specifier.runtimeRequest,
            name: identifierFromString("getResourceListByFilter"),
          },
        }, [
          expr.objectLiteral([
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("prefix"),
                value: expr.variable(identifierFromString("prefix")),
              },
            },
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("resourceName"),
                value: expr.stringLiteral(firstLowerCase(name)),
              },
            },
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("searchParams"),
                value: expr.call({
                  type: "ImportedVariable",
                  importedVariable: {
                    moduleName: specifier.generatedFilterSearchParamsCodec,
                    name: identifierFromString(
                      `${firstLowerCase(name)}FilterToSearchParams`,
                    ),
                  },
                }, [expr.variable(identifierFromString("filter"))]),
              },
            },
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("bearerToken"),
                value: expr.variable(identifierFromString("bearerToken")),
              },
            },
          ]),
        ]),
      },
    })],
  };
};

export const oneApiFunctionName = (name: string) =>
  identifierFromString(`get${name}`);

const crateOneApiFunction = ({ specifier, name, recourseName }: {
  readonly specifier: RequestNeedSpecifier;
  readonly name: string;
  readonly recourseName: string;
}): FunctionDefinition => {
  return {
    export: true,
    name: oneApiFunctionName(name),
    document: "",
    isAsync: true,
    typeParameterList: [],
    parameterList: [{
      name: identifierFromString("bearerToken"),
      type: type.union([{ type: "String" }, { type: "Undefined" }]),
      document: "",
    }],
    returnType: type.Promise({
      type: "ImportedType",
      importedType: {
        moduleName: specifier.runtimeRequest,
        nameAndArguments: {
          name: identifierFromString("DataOrError"),
          arguments: [{
            type: "ImportedType",
            importedType: {
              moduleName: specifier.generatedType,
              nameAndArguments: {
                name: identifierFromString(`${recourseName}`),
                arguments: [],
              },
            },
          }],
        },
      },
    }),
    statementList: [
      statement.return({
        type: "UnaryOperator",
        unaryOperatorExpr: {
          operator: "await",
          expr: expr.call({
            type: "ImportedVariable",
            importedVariable: {
              moduleName: specifier.runtimeRequest,
              name: identifierFromString("getOneApi"),
            },
          }, [expr.objectLiteral([
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("prefix"),
                value: expr.variable(identifierFromString("prefix")),
              },
            },
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("name"),
                value: expr.stringLiteral(firstLowerCase(name)),
              },
            },
            {
              type: "KeyValue",
              keyValue: {
                key: expr.stringLiteral("bearerToken"),
                value: expr.variable(identifierFromString("bearerToken")),
              },
            },
          ])]),
        },
      }),
    ],
  };
};
