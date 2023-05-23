import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import {
  evaluate,
  hello,
  ifExpr,
  Impliment,
  optionalMatch,
  textIsEmpty,
  textJoin,
  textLiteral,
} from "./example.ts";

const impliment: Impliment = {
  hello: () => Promise.resolve("ok!!!"),
};

Deno.test("text is empty", async () => {
  assertEquals(await evaluate(impliment, textIsEmpty(textLiteral(""))), true);
});

Deno.test("text join", async () => {
  assertEquals(
    await evaluate(impliment, textJoin(textLiteral("sample: "), hello)),
    "sample: ok!!!",
  );
});

Deno.test("if", async () => {
  assertEquals(
    await evaluate(
      impliment,
      ifExpr({
        condition: textIsEmpty(textLiteral("aa")),
        thenExpr: textLiteral("T"),
        elseExpr: textLiteral("F"),
      }),
    ),
    "F",
  );
});

Deno.test("optional match", async () => {
  assertEquals(
    await evaluate(
      impliment,
      optionalMatch<string, string>({
        optional: textLiteral("aa"),
        some: (value) => textJoin(textLiteral("Some("), value),
        none: textLiteral("None"),
      }),
    ),
    "Some(aa",
  );
});
