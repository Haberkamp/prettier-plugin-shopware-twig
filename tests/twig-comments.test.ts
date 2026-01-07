import { describe, expect, it } from "vitest";
import * as prettier from "prettier";

describe("Twig comments", () => {
  it("formats a simple comment", async () => {
    const input = "{# This is a comment #}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`"{# This is a comment #}"`);
  });

  it("formats a deprecation comment with special characters", async () => {
    const input = "{# @deprecated tag:v6.8.0 - Use `mt-button` instead. #}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(
      `"{# @deprecated tag:v6.8.0 - Use \`mt-button\` instead. #}"`
    );
  });

  it("preserves comment before an element on same line", async () => {
    const input = "{# Comment #}<p>Hello</p>";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`"{# Comment #}<p>Hello</p>"`);
  });

  it("preserves comment after an element on same line", async () => {
    const input = "<p></p>{# Comment #}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`"<p></p>{# Comment #}"`);
  });

  it("puts comment on new line when originally on new line", async () => {
    const input = `<p></p>
{# Comment #}`;

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"<p></p>
{# Comment #}"
`);
  });

  it("formats comment inside a twig block", async () => {
    const input = "{% block content %}{# TODO: refactor #}<div>Hi</div>{% endblock %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    // Note: siblings within a block stay on the same line (existing behavior)
    expect(result).toMatchInlineSnapshot(`
"{% block content %}
{# TODO: refactor #}<div>Hi</div>
{% endblock %}"
`);
  });

  it("formats multiple comments in sequence on same line", async () => {
    const input = "{# First #}{# Second #}{# Third #}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(
      `"{# First #}{# Second #}{# Third #}"`
    );
  });

  it("formats comment with extra internal whitespace", async () => {
    // Parser trims the content, so extra spaces around content are normalized
    const input = "{#    spaced out    #}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`"{# spaced out #}"`);
  });

  it("formats empty comment", async () => {
    const input = "{##}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    // Empty comment should still render with single space padding
    expect(result).toMatchInlineSnapshot(`"{#  #}"`);
  });

  it("formats comment between sibling elements on same line", async () => {
    const input = "<div>A</div>{# separator #}<div>B</div>";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(
      `"<div>A</div>{# separator #}<div>B</div>"`
    );
  });
});

