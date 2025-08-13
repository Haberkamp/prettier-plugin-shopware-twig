import { it, expect } from "vitest";
import * as prettier from "prettier";

it.each(["{% parent() %}", "{% parent()%}", "{%parent()%}"])(
  "removes the whitespace between the function call and the delimiters: %s",
  async (code) => {
    // ACT
    const result = await prettier.format(code, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    // ASSERT
    expect(result).toBe("{% parent() %}");
  }
);

it("removes the whitespace inside the parameter list", async () => {
  // ARRANGE
  const code = "{% parent(     ) %}";

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toBe("{% parent() %}");
});

it("removes the whitespace between the function identifier and the parameter list", async () => {
  // ARRANGE
  const code = "{% parent  () %}";

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toBe("{% parent() %}");
});
