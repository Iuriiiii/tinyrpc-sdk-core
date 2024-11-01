import type { MapStructure } from "../types/mod.ts";

export interface RpcInstanceData<T extends object> {
  parent: T;
  keys: MapStructure<T>;
}
