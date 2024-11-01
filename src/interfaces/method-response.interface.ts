import type { HttpError } from "../classes/mod.ts";

export interface MethodResponse<K, E extends HttpError = HttpError> {
  /**
   * The server response.
   */
  result: K;
  /**
   * The error, if any, extends `HttpError`;
   */
  error?: E;
}
