import type { ContentBody, ContentResponse, FormdataRpcParam, MethodResponse } from "../interfaces/mod.ts";
import { readMap } from "./read-map.util.ts";
import { SDK as SDK_SETTINGS } from "../singletons/mod.ts";
import { writeMap } from "./write-map.util.ts";
import { HttpError } from "../classes/mod.ts";
import { getHost } from "./get-host.util.ts";
import { pack, unpack } from "@online/packager";
import { encodeBase64 } from "@std/encoding";
import { isStreamRequest, isStreamResponse } from "../validators/mod.ts";

const method = "POST" as const;

function cleanObject(param: Record<string, unknown>, db = new Map()) {
  const result: Record<string, unknown> = {};

  for (const key of Object.getOwnPropertyNames(param)) {
    const value = param[key];

    if (Array.isArray(value)) {
      if (!db.has(value)) {
        db.set(value, value);
      }

      result[key] = value;
      continue;
    }

    if (typeof value === "object" && value && !Array.isArray(value)) {
      if (db.has(value)) {
        result[key] = db.get(value);
        continue;
      }

      const cleanMember = cleanObject(value as Record<string, unknown>, db);
      result[key] = cleanMember;
      db.set(value, cleanMember);
      continue;
    }

    if (param[key] !== undefined) {
      result[key] = param[key];
    }
  }

  return result;
}

/**
 * @param param Information to perform the request to the RPC server
 * @returns An object with an `error` member and a `result` member.
 */
export async function rawRpc<T, E extends HttpError = HttpError>(param: FormdataRpcParam): Promise<MethodResponse<T, E>> {
  const host = getHost(SDK_SETTINGS.host, SDK_SETTINGS.https);
  const { args, updates: { parent, keys }, request, connection, context, voidIt } = param;
  const instanceMap = readMap(parent, keys);
  const { status: isStream, key } = isStreamRequest(param);
  const cleanArguments = cleanObject(args as Record<string, string>);
  const body = isStream
    // @ts-ignore: index access
    ? args[key]
    : pack(
      {
        "&": cleanArguments,
        "%": instanceMap,
      } satisfies ContentBody,
      { serializers: SDK_SETTINGS.serializers },
    );

  const headers: Record<string, string> = {
    "content-type": isStream ? "application/raw-stream" : "application/raw",
    "x-t-con": `${connection.module}.${connection.method}`,
    "x-t-arg": encodeBase64(pack(context)),
  };

  if (isStream) {
    headers["transfer-encoding"] = "chunked";
  }

  const response = await fetch(host, { ...request, body, method, headers });

  if (!response.ok) {
    const errorMessage = (await response.text()).replace(/\w+:\s/, "").trim();
    return { result: {} as T, error: new HttpError(response.status, `${response.statusText} - ${errorMessage}`) as E, response };
  }

  if (isStreamResponse(response)) {
    return { result: voidIt ? void 0 as T : response.body! as T, response };
  }

  const serialized = await response.bytes();
  const { result, updates } = unpack<ContentResponse<T>>(serialized, { deserializers: SDK_SETTINGS.deserializers });

  writeMap(parent, updates);
  return { result: voidIt ? void 0 as T : result, response };
}
