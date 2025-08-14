import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats class names correctly", async () => {
  // ARRANGE
  const code = `
<div aria-hidden="true" class="border rounded-1 flex-shrink-0 bg-gray px-1 loooooooooooooooooooooooong">
</div>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<div
  aria-hidden="true"
  class="border rounded-1 flex-shrink-0 bg-gray px-1 loooooooooooooooooooooooong"
></div>"`);
});
