export function writeMap(
  target: object,
  map: object,
) {
  for (const [key, value] of Object.entries(map)) {
    // @ts-ignore: index access
    if (value instanceof Object && target[key] instanceof Object) {
      // @ts-ignore: index access
      writeMap(target[key], value);
      continue;
    }

    // @ts-ignore: index access
    target[key] = value;
  }
}
