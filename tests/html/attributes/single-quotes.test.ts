import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats single quotes correctly", async () => {
  // ARRANGE
  const code = `<img src="test.png" alt='John "ShotGun" Nelson'>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(
    `"<img src="test.png" alt='John "ShotGun" Nelson' />"`
  );
});
