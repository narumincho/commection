export type RequestExpr<T> = UntypedRequestExpr & T;

const typeAssert = <T>(untyped: UntypedRequestExpr): RequestExpr<T> =>
  untyped as RequestExpr<T>;

export type UntypedRequestExpr = {
  readonly type: "hello";
} | {
  readonly type: "textLiteral";
  readonly value: string;
} | {
  readonly type: "textJoin";
  readonly left: RequestExpr<string>;
  readonly right: RequestExpr<string>;
} | {
  readonly type: "textIsEmpty";
  readonly expr: RequestExpr<string>;
} | {
  readonly type: "if";
  readonly condition: RequestExpr<boolean>;
  readonly thenExpr: UntypedRequestExpr;
  readonly elseExpr: UntypedRequestExpr;
} | {
  readonly type: "optionalMatch";
  readonly optional: UntypedRequestExpr;
  readonly some: (value: UntypedRequestExpr) => UntypedRequestExpr;
  readonly none: UntypedRequestExpr;
} | {
  readonly type: "literal";
  readonly value: UntypedRequestExpr;
};

export const evaluate = async <T>(
  impliment: Impliment,
  expr: RequestExpr<T>,
): Promise<T> => {
  switch (expr.type) {
    case "hello": {
      const result: string = await impliment.hello();
      return result as T;
    }
    case "textLiteral": {
      const result: string = expr.value;
      return result as T;
    }
    case "textJoin": {
      const result: string = (await evaluate(impliment, expr.left)) +
        (await evaluate(impliment, expr.right));
      return result as T;
    }
    case "textIsEmpty": {
      const result: boolean =
        (await evaluate(impliment, expr.expr)).length === 0;
      return result as T;
    }
    case "if": {
      const condition = await evaluate<T>(impliment, expr.condition);
      if (condition) {
        const result = await evaluate<T>(impliment, expr.thenExpr);
        return result;
      }
      const result = await evaluate<T>(impliment, expr.elseExpr);
      return result;
    }
    case "optionalMatch": {
      const optional = await evaluate(impliment, expr.optional);
      if (optional === undefined) {
        const result = await evaluate<T>(impliment, expr.none);
        return result;
      }
      const result = await evaluate<T>(
        impliment,
        expr.some({
          type: "literal",
          value: optional,
        }),
      );
      return result;
    }
    case "literal": {
      return expr.value as T;
    }
  }
};

export const hello: RequestExpr<string> = typeAssert<string>({
  type: "hello",
});

export const textLiteral = (value: string): RequestExpr<string> =>
  typeAssert<string>({
    type: "textLiteral",
    value,
  });

export const textJoin = (
  left: RequestExpr<string>,
  right: RequestExpr<string>,
): RequestExpr<string> =>
  typeAssert({
    type: "textJoin",
    left,
    right,
  });

export const textIsEmpty = (
  expr: RequestExpr<string>,
): RequestExpr<boolean> =>
  typeAssert({
    type: "textIsEmpty",
    expr,
  });

export const ifExpr = <R>(
  parameter: {
    readonly condition: RequestExpr<boolean>;
    readonly thenExpr: RequestExpr<R>;
    readonly elseExpr: RequestExpr<R>;
  },
): RequestExpr<R> => ({
  type: "if",
  condition: parameter.condition,
  thenExpr: parameter.thenExpr,
  elseExpr: parameter.elseExpr,
});

export const optionalMatch = <T, R>(
  parameter: {
    readonly optional: RequestExpr<T | undefined>;
    readonly some: (value: RequestExpr<T>) => RequestExpr<R>;
    readonly none: RequestExpr<R>;
  },
): RequestExpr<R> => ({
  type: "optionalMatch",
  optional: parameter.optional,
  some: (v) => parameter.some(v),
  none: parameter.none,
});

export type Impliment = {
  readonly hello: () => Promise<string>;
};
