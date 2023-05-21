export type Server<ImplementType, RequestExpr> = {
  readonly schema: Schema<ImplementType, RequestExpr>;
  readonly implementation: ImplementType;
};

export type Schema<ImplementType, RequestExpr> = {
  readonly name: string;
  readonly implementType: PhantomData<ImplementType>;
  readonly requestExpr: PhantomData<RequestExpr>;
};

export type PhantomData<T> = {
  /** Do not create with this field */
  readonly __bland: T;
};
