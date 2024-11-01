import { deserializeValue, serializeValue } from "@online/bigserializer";
import type { RequestBody } from "../types/mod.ts";
import { readMap } from "./read-map.util.ts";
import { HOST as GLOBAL_HOST } from "../singletons/mod.ts";
import type {
  JsonRpcParam,
  MethodResponse,
  RpcServerResponse,
} from "../interfaces/mod.ts";
import { writeMap } from "./write-map.util.ts";
import { HttpError } from "../classes/mod.ts";
import { getHost } from "./get-host.util.ts";

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

/**
 * @param param Information to perform the request to the RPC server
 * @returns An object with an `error` member and a `result` member.
 */
export async function jsonRpc<
  T,
  E extends HttpError = HttpError,
  K extends object = object,
>(
  param: JsonRpcParam<K>,
): Promise<MethodResponse<T, E>> {
  const { communication, request: req } = param;
  const { m, fn, args, instance: { parent, keys } } = communication;
  const HOST = getHost(GLOBAL_HOST.host, GLOBAL_HOST.https);
  const mbr = readMap(parent, keys);
  const _args = serializeValue(args);
  const request = await fetch(HOST, getBody({ m, fn, args: _args, mbr }, req));

  if (!request.ok) {
    return {
      result: {} as T,
      error: new HttpError(request.status, request.statusText) as E,
    };
  }

  const serialized = await request.json() as T;
  const { result, updates } = deserializeValue<RpcServerResponse<T>>(
    serialized,
  );

  writeMap(parent, updates);
  return { result };
}
