import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import {
  hello,
  Impliment,
  textIsEmpty,
  textJoin,
  textLiteral,
} from "./example.ts";

const impliment: Impliment = {
  hello: () => Promise.resolve("ok!!!"),
};

Deno.test("text is empty", async () => {
  assertEquals(await textIsEmpty(textLiteral("")).evaluate(impliment), true);
});

Deno.test("text join", async () => {
  assertEquals(
    await textJoin(textLiteral("sample: "), hello).evaluate(impliment),
    "sample: ok!!!",
  );
});
