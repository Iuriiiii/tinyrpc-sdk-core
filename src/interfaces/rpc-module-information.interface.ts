import type { RpcInstanceData } from "./rpc-instance-data.interface.ts";

export interface RpcModuleInformation<T extends object> {
    m: string;
    fn: string;
    args: unknown[];
    instance: RpcInstanceData<T>;
}
