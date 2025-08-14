import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats attributes without quotes correctly", async () => {
  // ARRANGE
  const code = `<p title=Title>String</p>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`"<p title="Title">String</p>"`);
});
