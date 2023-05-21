export type RequestExpr<T> = {
  readonly type: "hello";
  readonly evaluate: (imp: Impliment) => Promise<T>;
} | {
  readonly type: "textLiteral";
  readonly value: string;
  readonly evaluate: (imp: Impliment) => Promise<T>;
} | {
  readonly type: "textJoin";
  readonly left: RequestExpr<string>;
  readonly right: RequestExpr<string>;
  readonly evaluate: (imp: Impliment) => Promise<T>;
} | {
  readonly type: "textIsEmpty";
  readonly expr: RequestExpr<string>;
  readonly evaluate: (imp: Impliment) => Promise<T>;
};

export const hello: RequestExpr<string> = {
  type: "hello",
  evaluate: (impliment) => impliment.hello(),
};

export const textLiteral = (value: string): RequestExpr<string> => ({
  type: "textLiteral",
  value,
  evaluate: (_) => Promise.resolve(value),
});

export const textJoin = (
  left: RequestExpr<string>,
  right: RequestExpr<string>,
): RequestExpr<string> => ({
  type: "textJoin",
  left,
  right,
  evaluate: async (impliment) =>
    (await left.evaluate(impliment)) + (await right.evaluate(impliment)),
});

export const textIsEmpty = (
  expr: RequestExpr<string>,
): RequestExpr<boolean> => ({
  type: "textIsEmpty",
  expr,
  evaluate: async (impliment) => (await expr.evaluate(impliment)).length === 0,
});

export type Impliment = {
  readonly hello: () => Promise<string>;
};
