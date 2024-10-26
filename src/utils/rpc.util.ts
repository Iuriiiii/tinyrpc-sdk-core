import { deserializeValue, serializeValue } from "@online/bigserializer";
import type { MapStructure, RequestBody } from "../types/mod.ts";
import { readMap } from "./read-map.util.ts";
import { writeMap } from "./write-map.util.ts";

interface RpcInstanceData<T extends object> {
  parent: T;
  keys: MapStructure<T>;
}

function getHost(value: string, https = false) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return "http" + (https ? "s" : "") + "://" + value;
}

const HOST = getHost("127.0.0.1");
const UE = (_: unknown, v: unknown) => v === undefined ? "[UNDFN]" : v;
const headers = { "content-type": "application/json" } as const;
const method = "POST" as const;

function getBody(value: object, request: RequestBody) {
  const body = JSON.stringify(value, UE);
  return {
    method,
    headers,
    body,
    ...request,
  } satisfies RequestInit as RequestInit;
}

export async function rpc<T, K extends object = object>(
  m: string,
  fn: string,
  args: unknown[],
  req: RequestBody = {},
  { parent, keys }: RpcInstanceData<K> = { parent: {} as K, keys: [] },
): Promise<T> {
  const mbr = readMap(parent, keys);
  const _args = serializeValue(args);
  const request = await fetch(HOST, getBody({ m, fn, args: _args, mbr }, req));

  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const serialized = await request.json() as T;
  const deserialized = deserializeValue<T>(serialized);

  return deserialized;
}
