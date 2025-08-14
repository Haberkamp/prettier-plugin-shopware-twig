import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats classes with colons correctly", async () => {
  // ARRANGE
  const code = `<my-tag class="md:foo-bg md:foo-color md:foo--sub-bg md:foo--sub-color xl:foo xl:prefix2 --prefix2--something-else unrelated_class_to_fill_80_chars"></my-tag>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<my-tag
  class="md:foo-bg md:foo-color md:foo--sub-bg md:foo--sub-color xl:foo xl:prefix2 --prefix2--something-else unrelated_class_to_fill_80_chars"
></my-tag>"`);
});
