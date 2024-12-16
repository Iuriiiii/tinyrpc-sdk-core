import { isObject } from "@online/is";

export function normalizeObject<T>(
  clazz: T,
  valueOrValues: object | object[],
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
