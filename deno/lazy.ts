export const createLazy = <T>(
  getFunction: () => T,
): Lazy<T> => {
  let value: T | undefined = undefined;
  return {
    value: () => {
      if (value === undefined) {
        const v = getFunction();
        value = v;
        return v;
      }
      return value;
    },
  };
};

export type Lazy<T> = { readonly value: () => T };
