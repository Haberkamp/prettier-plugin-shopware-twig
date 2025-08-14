import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats standalone next marker correctly", async () => {
  const code = `
<div></div
>
<span></span>
<div></div
    
    
           >
<span></span>
<div></div
>

<span></span>

<div>
  <a href="#123123123123123131231312321312312312312312312312312313123123123123123"
    >123123123123</a
  >

  123123
</div>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<div></div>
<span></span>
<div></div>
<span></span>
<div></div>

<span></span>

<div>
  <a
    href="#123123123123123131231312321312312312312312312312312313123123123123123"
    >123123123123</a
  >

  123123
</div>"`);
});
