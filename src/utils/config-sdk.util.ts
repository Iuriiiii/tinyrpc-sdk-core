import type { SdkOptions } from "../interfaces/mod.ts";
import { SDK } from "../singletons/mod.ts";

export function configSdk(options: SdkOptions) {
  Object.assign(SDK, options);
}
