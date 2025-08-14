import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats classes with leading dashes correctly", async () => {
  // ARRANGE
  const code = `
<my-tag class="__prefix1__foo __prefix1__bar __prefix2__foo prefix2 prefix2--something --prefix2--something-else"></my-tag>

<my-tag class="--prefix1--foo --prefix1--bar --prefix2--foo prefix2 prefix2__something __prefix2__something_else"></my-tag>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<my-tag
  class="__prefix1__foo __prefix1__bar __prefix2__foo prefix2 prefix2--something --prefix2--something-else"
></my-tag>

<my-tag
  class="--prefix1--foo --prefix1--bar --prefix2--foo prefix2 prefix2__something __prefix2__something_else"
></my-tag>"`);
});
