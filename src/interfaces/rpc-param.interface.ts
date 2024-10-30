import type { RequestBody } from "../types/mod.ts";
import type { RpcModuleInformation } from "./rpc-module-information.interface.ts";

export interface RpcParam<T extends object> {
    communication: RpcModuleInformation<T>;
    request: RequestBody;
}
