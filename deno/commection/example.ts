import { createPhantomData, PhantomData } from "../phantom.ts";

export type RequestExpr<T> = UntypedRequestExpr & PhantomData<T>;

const typeAssert = <T>(untyped: UntypedRequestExpr): RequestExpr<T> =>
  untyped as RequestExpr<T>;

export type UntypedRequestExpr =
  | {
      readonly type: "hello";
    }
  | {
      readonly type: "textLiteral";
      readonly value: string;
    }
  | {
      readonly type: "textJoin";
      readonly left: RequestExpr<string>;
      readonly right: RequestExpr<string>;
    }
  | {
      readonly type: "textIsEmpty";
      readonly expr: RequestExpr<string>;
    }
  | {
      readonly type: "if";
      readonly condition: RequestExpr<boolean>;
      readonly thenExpr: UntypedRequestExpr;
      readonly elseExpr: UntypedRequestExpr;
    }
  | {
      readonly type: "optionalMatch";
      readonly optional: UntypedRequestExpr;
      readonly some: (value: UntypedRequestExpr) => UntypedRequestExpr;
      readonly none: UntypedRequestExpr;
    }
  | {
      readonly type: "literal";
      readonly value: unknown;
    };

export const evaluate = async <T>(
  implement: Implement,
  expr: RequestExpr<T>
): Promise<T> => {
  switch (expr.type) {
    case "hello": {
      const result: string = await implement.hello();
      return result as T;
    }
    case "textLiteral": {
      const result: string = expr.value;
      return result as T;
    }
    case "textJoin": {
      const result: string =
        (await evaluate(implement, expr.left)) +
        (await evaluate(implement, expr.right));
      return result as T;
    }
    case "textIsEmpty": {
      const result: boolean =
        (await evaluate(implement, expr.expr)).length === 0;
      return result as T;
    }
    case "if": {
      const condition = await evaluate(implement, expr.condition);
      if (condition) {
        return await evaluate(implement, typeAssert<T>(expr.thenExpr));
      }
      return await evaluate(implement, typeAssert<T>(expr.elseExpr));
    }
    case "optionalMatch": {
      const optional = await evaluate(implement, typeAssert(expr.optional));
      if (optional === undefined) {
        const result = await evaluate(implement, typeAssert<T>(expr.none));
        return result;
      }
      const result = await evaluate<T>(
        implement,
        typeAssert(
          expr.some({
            type: "literal",
            value: optional,
          })
        )
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
  right: RequestExpr<string>
): RequestExpr<string> =>
  typeAssert({
    type: "textJoin",
    left,
    right,
  });

export const textIsEmpty = (expr: RequestExpr<string>): RequestExpr<boolean> =>
  typeAssert({
    type: "textIsEmpty",
    expr,
  });

export const ifExpr = <R>(parameter: {
  readonly condition: RequestExpr<boolean>;
  readonly thenExpr: RequestExpr<R>;
  readonly elseExpr: RequestExpr<R>;
}): RequestExpr<R> => ({
  type: "if",
  condition: parameter.condition,
  thenExpr: parameter.thenExpr,
  elseExpr: parameter.elseExpr,
  ...createPhantomData<R>(),
});

export const optionalMatch = <T, R>(parameter: {
  readonly optional: RequestExpr<T | undefined>;
  readonly some: (value: RequestExpr<T>) => RequestExpr<R>;
  readonly none: RequestExpr<R>;
}): RequestExpr<R> => ({
  type: "optionalMatch",
  optional: parameter.optional,
  some: (v) => parameter.some(typeAssert(v)),
  none: parameter.none,
  ...createPhantomData<R>(),
});

export type Implement = {
  readonly hello: () => Promise<string>;
};
