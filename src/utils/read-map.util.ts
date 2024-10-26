import type { MapStructure } from "../types/mod.ts";
import { objectPick } from "./object-pick.util.ts";

export function readMap<T extends object>(
  target: object,
  map: MapStructure<T>,
) {
  if (target instanceof Array) {
    if (target.length === 0) {
      return target;
    }
    const result: unknown[] = [];

    for (const element of target) {
      result.push(readMap(element, map));
    }

    return result;
  }

  const _true = map.filter((item) => typeof item === "string");
  const _false = map.filter((item) => typeof item !== "string");
  const clone = objectPick(target, _true);

  for (const childObject of _false) {
    const childObjectEntries: [string, object][] = Object.entries(childObject);

    for (const [key, value] of childObjectEntries) {
      // @ts-ignore: index access
      clone[key] = readMap(target[key], value);
    }
  }

  return clone;
}
