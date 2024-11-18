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
   * Arguments
   */
  ["&"]: object;
  /**
   * Instance map
   */
  ["%"]: object;
}
