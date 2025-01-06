import { assertEquals } from "jsr:@std/assert";
import {
  evaluate,
  hello,
  ifExpr,
  Implement,
  optionalMatch,
  textIsEmpty,
  textJoin,
  textLiteral,
} from "./example.ts";

const implement: Implement = {
  hello: () => Promise.resolve("ok!!!"),
};

Deno.test("text is empty", async () => {
  assertEquals(await evaluate(implement, textIsEmpty(textLiteral(""))), true);
});

Deno.test("text join", async () => {
  assertEquals(
    await evaluate(implement, textJoin(textLiteral("sample: "), hello)),
    "sample: ok!!!"
  );
});

Deno.test("if true", async () => {
  assertEquals(
    await evaluate(
      implement,
      ifExpr({
        condition: textIsEmpty(textLiteral("")),
        thenExpr: textLiteral("T"),
        elseExpr: textLiteral("F"),
      })
    ),
    "T"
  );
});

Deno.test("if false", async () => {
  assertEquals(
    await evaluate(
      implement,
      ifExpr({
        condition: textIsEmpty(textLiteral("aa")),
        thenExpr: textLiteral("T"),
        elseExpr: textLiteral("F"),
      })
    ),
    "F"
  );
});

Deno.test("optional match", async () => {
  assertEquals(
    await evaluate(
      implement,
      optionalMatch<string, string>({
        optional: textLiteral("aa"),
        some: (value) => textJoin(textLiteral("Some("), value),
        none: textLiteral("None"),
      })
    ),
    "Some(aa"
  );
});
