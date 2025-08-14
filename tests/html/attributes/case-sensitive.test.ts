import { it, expect } from "vitest";
import * as prettier from "prettier";

it("keeps the case of the attribute name", async () => {
  // ARRANGE
  const code = `<div CaseSensitive="true"></div>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toBe('<div CaseSensitive="true"></div>');
});
