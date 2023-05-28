import { NonEmptyString, nonEmptyStringFrom } from "../nonEmpty.ts";

/**
 * Structured, read-only URLs
 * where you don't have to worry about Trailing Slash or anything else
 */
export type SimpleUrl = {
  readonly origin: string;
  readonly pathSegments: ReadonlyArray<NonEmptyString>;
  readonly query: ReadonlyMap<NonEmptyString, string>;
};

export const urlToSimpleUrl = (url: URL): SimpleUrl => {
  return {
    origin: url.origin,
    pathSegments: url.pathname.split("/").flatMap(
      (item): [NonEmptyString] | [] => {
        const segment = nonEmptyStringFrom(item);
        if (segment === undefined) {
          return [];
        }
        return [segment];
      },
    ),
    query: new Map([...url.searchParams].flatMap((entriy) => {
      const key = nonEmptyStringFrom(entriy[0]);
      if (key === undefined) {
        return [];
      }
      return [[key, entriy[1]]];
    })),
  };
};

export const simpleUrlToUrlText = (simpleUrl: SimpleUrl): string => {
  const url = new URL(simpleUrl.origin);
  url.pathname = "/" + simpleUrl.pathSegments.join("/");
  for (const [queryKey, queryValue] of simpleUrl.query) {
    url.searchParams.set(queryKey, queryValue);
  }
  return url.toString();
};
