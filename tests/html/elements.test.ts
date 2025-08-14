import { format } from "prettier";
import { it, expect } from "vitest";

it("indents content of html root", async () => {
  // ARRANGE
  const code = `<!doctype html>
<html>
<head></head>
<body></body>
</html>`;

  // ACT
  const result = await format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<!doctype html>
<html>
  <head></head>
  <body></body>
</html>"
  `);
});
