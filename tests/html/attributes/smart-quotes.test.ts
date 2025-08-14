import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats smart quotes correctly", async () => {
  // ARRANGE
  const code = `
<div 
    smart-quotes='123 " 456'
    smart-quotes="123 ' 456"
    smart-quotes='123 &apos;&quot; 456'
></div>
`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<div
  smart-quotes='123 " 456'
  smart-quotes="123 ' 456"
  smart-quotes="123 '&quot; 456"
></div>"`);
});
