import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats BEM classes correctly", async () => {
  // ARRANGE
  const code = `
<div class="ProviderMeasuresContainer__heading-row
  d-flex
  flex-column flex-lg-row
  justify-content-start justify-content-lg-between
  align-items-start align-items-lg-center">Foo</div>

<div  class="a-bem-block a-bem-block--with-modifer ">
<div  class="a-bem-block__element a-bem-block__element--with-modifer also-another-block" >
<div  class="a-bem-block__element a-bem-block__element--with-modifer also-another-block__element">
</div></div> </div>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<div
  class="ProviderMeasuresContainer__heading-row d-flex flex-column flex-lg-row justify-content-start justify-content-lg-between align-items-start align-items-lg-center"
>
  Foo
</div>

<div class="a-bem-block a-bem-block--with-modifer">
  <div
    class="a-bem-block__element a-bem-block__element--with-modifer also-another-block"
  >
    <div
      class="a-bem-block__element a-bem-block__element--with-modifer also-another-block__element"
    ></div>
  </div>
</div>"`);
});
