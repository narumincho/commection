import "package:meta/meta.dart";

export type RequestExpr<T> = {
  readonly type: "hello";
  readonly evaluate: (imp: Impliment) => Promise<T>;
} | {
  readonly type: "stringLiteral";
  readonly value: string;
  readonly evaluate: (imp: Impliment) => Promise<T>;
};

export const hello: RequestExpr<string> = {
  type: "hello",
  evaluate: async (impliment) => impliment.hello(),
};

export const stringLiteral = (value: string): RequestExpr<string> => ({
  type: "stringLiteral",
  value,
  evaluate: async (_) => value,
});

export type Impliment = {
  readonly hello: () => Promise<string>;
};

export const evaluate = async <T>(
  impliment: Impliment,
  expr: RequestExpr<T>,
): Promise<T> => {
  return expr.evaluate(impliment);
};
