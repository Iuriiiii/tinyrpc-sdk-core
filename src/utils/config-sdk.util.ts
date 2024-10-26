import type { HostOptions } from "../interfaces/mod.ts";
import { HOST } from "../singletons/mod.ts";

export function configSdk(options: HostOptions) {
    Object.assign(HOST, options);
}
