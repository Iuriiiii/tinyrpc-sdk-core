import { isObject } from "@online/is";
import type { ClassOrInterface } from "../types/mod.ts";

export function normalizeObject<T>(
  clazz: T,
  valueOrValues: ClassOrInterface<T> | ClassOrInterface<T>[],
): T | T[] {
  if (Array.isArray(valueOrValues)) {
    return valueOrValues.flatMap(() => normalizeObject(clazz, valueOrValues));
  }

  if (isObject(valueOrValues)) {
    // @ts-ignore: access to `deserialize`
    return clazz.deserialize(valueOrValues);
  }

  return valueOrValues;
}
