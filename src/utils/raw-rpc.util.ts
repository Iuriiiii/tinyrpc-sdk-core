import type {
  ContentBody,
  ContentResponse,
  FormdataRpcParam,
  MethodResponse,
} from "../interfaces/mod.ts";
import { readMap } from "./read-map.util.ts";
import { SDK as SDK_SETTINGS } from "../singletons/mod.ts";
import { writeMap } from "./write-map.util.ts";
import { HttpError } from "../classes/mod.ts";
import { FormdataRpcVersion } from "../enums/mod.ts";
import { getHost } from "./get-host.util.ts";
import { pack, unpack } from "@online/packager";

const headers = { "content-type": "application/raw" } as const;
const method = "POST" as const;

/**
 * @param param Information to perform the request to the RPC server
 * @returns An object with an `error` member and a `result` member.
 */
export async function rawRpc<
  T,
  E extends HttpError = HttpError,
>(param: FormdataRpcParam): Promise<MethodResponse<T, E>> {
  const HOST = getHost(SDK_SETTINGS.host, SDK_SETTINGS.https);
  const { args, updates: { parent, keys }, request: req, connection } = param;
  const instanceMap = readMap(parent, keys);
  const body = pack(
    {
      "!": FormdataRpcVersion.v1,
      "#": Date.now(),
      "$": `${connection.module}.${connection.method}`,
      "&": args,
      "%": instanceMap,
    } satisfies ContentBody,
    { serializers: SDK_SETTINGS.serializers },
  );

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

  const serialized = await request.bytes();
  const { result, updates } = unpack<ContentResponse<T>>(serialized, {
    deserializers: SDK_SETTINGS.deserializers,
  });

  writeMap(parent, updates);
  return { result };
}
