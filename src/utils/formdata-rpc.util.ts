import type {
  ContentBody,
  ContentResponse,
  FormdataRpcParam,
  MethodResponse,
  ResponseBody,
  RpcServerResponse,
} from "../interfaces/mod.ts";
import { readMap } from "./read-map.util.ts";
import { HOST as GLOBAL_HOST } from "../singletons/mod.ts";
import { writeMap } from "./write-map.util.ts";
import { HttpError } from "../classes/mod.ts";
import { FormdataRpcVersion } from "../enums/mod.ts";
import { getHost } from "./get-host.util.ts";
import { type Database, deserialize, serialize } from "@online/tinyserializer";
import {
  uInt8ArrayDeserializer,
  uInt8ArraySerializer,
} from "@online/tinyserializers";

const headers = { "content-type": "application/raw" } as const;
const method = "POST" as const;

/**
 * @param param Information to perform the request to the RPC server
 * @returns An object with an `error` member and a `result` member.
 */
export async function formdataRpc<
  T,
  E extends HttpError = HttpError,
>(param: FormdataRpcParam): Promise<MethodResponse<T, E>> {
  const HOST = getHost(GLOBAL_HOST.host, GLOBAL_HOST.https);
  const { args, updates: { parent, keys }, request: req, connection } = param;
  const instanceMap = readMap(parent, keys);
  const contentBody = {
    "!": FormdataRpcVersion.v1,
    "#": Date.now(),
    "$": `${connection.module}.${connection.method}`,
    "&": args,
    "%": instanceMap,
  } satisfies ContentBody;

  const serializedContentBody = serialize(contentBody);
  const serializedObjectDatabase = serialize(
    serializedContentBody.objectDatabase,
  );
  const serializedStringDatabase = serialize(
    serializedContentBody.stringDatabase,
    { plainText: true },
  );

  const serializableBody = {
    X: serializedContentBody.value,
    S: serializedStringDatabase.value,
    O: serializedObjectDatabase.value,
  } satisfies ResponseBody;

  const { value: serializedBody } = serialize(serializableBody, {
    serializers: [uInt8ArraySerializer],
  });

  const request = await fetch(
    HOST,
    { ...req, body: serializedBody, method, headers },
  );

  if (!request.ok) {
    return {
      result: {} as T,
      error: new HttpError(request.status, request.statusText) as E,
    };
  }

  const serialized = await request.bytes();
  const { value } = deserialize<RpcServerResponse>(
    serialized,
  );
  const deserializedObjectDatabase = deserialize<Database<object>>(
    value.O,
    { deserializers: [uInt8ArrayDeserializer] },
  );
  const deserializedStringDatabase = deserialize<Database<string>>(
    value.S,
    { deserializers: [uInt8ArrayDeserializer] },
  );
  const { value: deserializedValue } = deserialize<ContentResponse<T>>(
    value.X,
    {
      objectDatabase: deserializedObjectDatabase.value,
      stringDatabase: deserializedStringDatabase.value,
    },
  );
  const { result, updates } = deserializedValue;

  writeMap(parent, updates);
  return { result };
}
