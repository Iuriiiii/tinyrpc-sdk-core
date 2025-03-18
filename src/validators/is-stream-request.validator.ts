import type { FormdataRpcParam } from "../interfaces/mod.ts";

export function isStreamRequest(param: FormdataRpcParam) {
  const { args } = param;
  const keys = Object.keys(args);

  // @ts-ignore: index access
  return { status: keys.length === 1 && args[keys[0]] instanceof ReadableStream, key: keys[0]! };
}
