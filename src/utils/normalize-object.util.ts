import { isPlainObject } from "@online/is";
import type { ClassOrInterface } from "../types/mod.ts";

// deno-lint-ignore no-explicit-any
export function normalizeObject<T extends { new (...args: any[]): any }>(
  clazz: T,
  valueOrValues: ClassOrInterface<T> | ClassOrInterface<T>[],
): T | T[] {
  if (Array.isArray(valueOrValues)) {
    return valueOrValues.flatMap((value) => normalizeObject(clazz, value));
  }

  if (isPlainObject(valueOrValues)) {
    return Object.assign(new clazz(), valueOrValues);
  }

  return valueOrValues;
}
