import { DataState } from "./dataState.ts";

export type HookResult<T> = {
  readonly dataState: DataState<T>;
  readonly refetch: () => void;
};
