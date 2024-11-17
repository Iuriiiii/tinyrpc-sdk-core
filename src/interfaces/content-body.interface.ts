import type { FormdataRpcVersion } from "../enums/mod.ts";

export interface ContentBody {
  ["!"]: FormdataRpcVersion;
  ["#"]: number;
  ["$"]: string;
  ["&"]: object;
  ["%"]: object;
}
