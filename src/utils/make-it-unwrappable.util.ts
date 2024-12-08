import type { MethodResponse } from "../interfaces/mod.ts";
import type { Unwrappable } from "../types/mod.ts";

export function makeItUnwrappable<
  T extends MethodResponse<unknown>,
  K = T extends MethodResponse<infer U> ? U : never,
>(promisedValue: Promise<T>): Unwrappable<T, K> {
  const result = promisedValue as Unwrappable<T, K>;
  result.unwrap = (async () => (await promisedValue).result) as () => Promise<K>;

  return result;
}