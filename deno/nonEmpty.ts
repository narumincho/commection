export type NonEmptyString = string & { _nonEmptyStringBland: never };

export const nonEmptyStringFrom = (
  value: string,
): NonEmptyString | undefined => {
  if (value.length === 0) {
    return undefined;
  }
  return value as NonEmptyString;
};
