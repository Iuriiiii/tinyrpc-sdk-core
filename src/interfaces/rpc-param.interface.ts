import type { RequestBody } from "../types/mod.ts";
import type { RpcModuleInformation } from "./rpc-module-information.interface.ts";

/**
 * The RPC function parameter.
 */
export interface RpcParam<T extends object> {
    /**
     * All information related with server comunication.
     */
    communication: RpcModuleInformation<T>;
    /**
     * Aditional request information to be used on fetch.
     */
    request: RequestBody;
}
