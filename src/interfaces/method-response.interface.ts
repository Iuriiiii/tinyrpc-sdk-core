import type { HttpError } from "../classes/mod.ts";

export interface MethodResponse<R, E extends HttpError = HttpError> {
  /**
   * The server response.
   */
  result: R;
  /**
   * The error, if any, extends `HttpError`;
   */
  error?: E;
}
