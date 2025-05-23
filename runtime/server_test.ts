import { assertEquals } from "jsr:@std/assert";
import { startWithAndPickToEnd } from "./server.ts";

Deno.test("startWithAndPickToEnd ok", () => {
  assertEquals(startWithAndPickToEnd("/sample/value", "/sample"), "/value");
});

Deno.test("startWithAndPickToEnd include", () => {
  assertEquals(startWithAndPickToEnd("/sample/value", "sample"), undefined);
});

Deno.test("startWithAndPickToEnd not include", () => {
  assertEquals(startWithAndPickToEnd("/sample/value", "foo"), undefined);
});
