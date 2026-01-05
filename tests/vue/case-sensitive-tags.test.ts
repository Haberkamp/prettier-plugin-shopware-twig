import { describe, expect, it } from "vitest";
import * as prettier from "prettier";

const format = (input: string) =>
  prettier.format(input, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
    printWidth: 80,
  });

describe("Vue case-sensitive tags (ported from Prettier)", () => {
  it("preserves Input component tag name", async () => {
    const input = `<Input></Input>`;
    const result = await format(input);
    expect(result).toMatchInlineSnapshot(`"<Input></Input>"`);
  });

  it("preserves Table component tag name in template", async () => {
    // Arrange
    const input = `<template>
  <Table></Table>
</template>`;

    // Act
    const result = await format(input);

    // Assert
    expect(result).toMatchInlineSnapshot(`
      "<template>
        <Table></Table>
      </template>"
    `);
  });
});
