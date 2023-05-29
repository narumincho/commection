export type PhantomData<T> = {
  /** Do not create with this field */
  readonly __bland: T;
};

/**
 * 👻👻👻
 */
export const createPhantomData = <T>(): PhantomData<T> => ({
  __bland: undefined as T,
});
