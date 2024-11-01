import { configSdk } from "../src/mod.ts";
import { assertObjectMatch } from "@std/assert";
import { HOST } from "../src/singletons/mod.ts";

Deno.test("Assign to host options", () => {
  configSdk({ host: "127.0.0.1", https: true });
  const host = HOST;
  assertObjectMatch(host, { host: "127.0.0.1", https: true });
});
