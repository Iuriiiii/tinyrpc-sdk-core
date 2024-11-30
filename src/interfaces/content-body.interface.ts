import type { FormdataRpcVersion } from "../enums/mod.ts";

export interface ContentBody {
  /**
   * The request version
   */
  ["!"]: FormdataRpcVersion;

  /**
   * Request time
   */
  ["#"]: number;

  /**
   * Module and method, a single string
   * with a dot as divisor:
   * MODULE.METHOD
   */
  ["$"]: string;

  /**
   * Method arguments
   */
  ["&"]: object;

  /**
   * Instance map (links)
   * This is an object containing all members selected by the server
   */
  ["%"]: object;

  /**
   * Context, basically the class constructor arguments
   */
  ["="]: unknown[];
}
