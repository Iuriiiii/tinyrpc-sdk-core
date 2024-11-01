import { deserializeValue, serializeValue } from "@online/bigserializer";
import { readMap } from "./read-map.util.ts";
import { HOST as GLOBAL_HOST } from "../singletons/mod.ts";
import type {
  FormdataRpcParam,
  MethodResponse,
  RpcServerResponse,
} from "../interfaces/mod.ts";
import { writeMap } from "./write-map.util.ts";
import { HttpError } from "../classes/mod.ts";
import { FormdataRpcVersion } from "../enums/mod.ts";
import { getHost } from "./get-host.util.ts";

const headers = { "content-type": 'multipart/form-data; boundary="0cfb94056aa06ac4802b9bd8f064fd00a719d2851a52a07e4eb844f68b4861bd"' } as const;
const method = "POST" as const;

function insertObject(
  target: FormData,
  source: object,
  prefix: string,
) {
  for (const [key, value] of Object.entries(source)) {
    target.append(`${prefix}${key}`, JSON.stringify(serializeValue(value)));
  }
}

/**
 * @param param Information to perform the request to the RPC server
 * @returns An object with an `error` member and a `result` member.
 */
export async function formdataRpc<
  T,
  E extends HttpError = HttpError,
>(
  param: FormdataRpcParam,
): Promise<MethodResponse<T, E>> {
  const body = new FormData();
  const HOST = getHost(GLOBAL_HOST.host, GLOBAL_HOST.https);
  const { args, updates: { parent, keys }, request: req, connection } = param;
  const instanceMap = readMap(parent, keys);

  body.set("!", FormdataRpcVersion.v1);
  body.set("#", `${Date.now()}`);
  body.set("$", [connection.module, connection.method].join("."));
  insertObject(body, args, ".");
  insertObject(body, instanceMap, "-");

  const request = await fetch(
    HOST,
    { ...req, body, method, headers },
  );

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
