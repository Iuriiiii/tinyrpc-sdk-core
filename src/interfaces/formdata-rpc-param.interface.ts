import type { RequestBody } from "../types/mod.ts";
import type { RpcConnection } from "./rpc-connection.interface.ts";
import type { RpcInstanceData } from "./rpc-instance-data.interface.ts";

/**
 * The RPC function parameter.
 */
export interface FormdataRpcParam {
  /**
   * Information related with the server function to call.
   */
  connection: RpcConnection;

  /**
   * Arguments to send back to server.
   */
  args: object;

  /**
   * Information about the current instance.
   */
  updates: RpcInstanceData<object>;

  /**
   * Aditional request information to be used on fetch.
   */
  request: RequestBody;

  /**
   * Constructor arguments.
   */
  context: unknown[];

  /**
   * Delete the result field, for internal purposes.
   */
  makeVoid: boolean;
}
