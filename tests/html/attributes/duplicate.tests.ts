import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats duplicate attributes correctly", async () => {
  // ARRANGE
  const code = `<a href="1" href="2">123</a>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`"<a href="1" href="2">123</a>"`);
});
