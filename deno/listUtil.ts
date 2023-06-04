/* 文字列の配列を比較し,
* - prefix に指定したもので始まっている場合は のこりの部分の配列を返す
* - 始まっていない場合は undefined を返す
*/
export const stringArrayMatchPrefix = (
  list: ReadonlyArray<string>,
  prefix: ReadonlyArray<string>,
): ReadonlyArray<string> | undefined => {
  for (let i = 0; i < prefix.length; i += 1) {
    if (list[i] !== prefix[i]) {
      return undefined;
    }
  }
  return list.slice(prefix.length);
};

/**
 * @example
 * stringArrayEqual(["a", "b"], ["a", "b"]) // true
 * stringArrayEqual(["b", "a"], ["a", "b"]) // false
 * stringArrayEqual(["a", "b"], []) // false
 */
export const stringArrayEqual = (
  a: ReadonlyArray<string>,
  b: ReadonlyArray<string>,
): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  for (const [index, aItem] of a.entries()) {
    if (aItem !== b[index]) {
      return false;
    }
  }
  return true;
};
