export interface RpcResponseBody {
  /**
   * The serialized content body (see `ContentBody` interface)
   */
  X: Uint8Array;
  /**
   * The serialized string database
   */
  S: Uint8Array;
  /**
   * The serialized object database
   */
  O: Uint8Array;
}
