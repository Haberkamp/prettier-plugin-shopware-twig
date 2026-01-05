import { describe, expect, it } from "vitest";
import * as prettier from "prettier";

describe("Twig if statements", () => {
  it("formats simple if statement with element child", async () => {
    const input = "{% if show %}<p>Hello</p>{% endif %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% if show %}
  <p>Hello</p>
{% endif %}"
`);
  });

  it("formats if statement with deeply nested elements", async () => {
    const input = "{% if visible %}<div><span><strong>Deep</strong></span></div>{% endif %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% if visible %}
  <div>
    <span>
      <strong>Deep</strong>
    </span>
  </div>
{% endif %}"
`);
  });

  it("formats if statement with single variable expression", async () => {
    const input = "{% if user %}<span>Welcome</span>{% endif %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% if user %}
  <span>Welcome</span>
{% endif %}"
`);
  });

  it("formats empty if statement (no children)", async () => {
    const input = "{% if x %}{% endif %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`"{% if x %}{% endif %}"`);
  });

  it("formats if statement nested inside a block", async () => {
    const input = "{% block content %}{% if active %}<p>Active</p>{% endif %}{% endblock %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% block content %}
  {% if active %}
    <p>Active</p>
  {% endif %}
{% endblock %}"
`);
  });

  it("formats block nested inside an if statement", async () => {
    const input = "{% if enabled %}{% block inner %}<div>Content</div>{% endblock %}{% endif %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% if enabled %}
  {% block inner %}
    <div>Content</div>
  {% endblock %}
{% endif %}"
`);
  });

  it("formats multiple sequential if statements", async () => {
    const input = "{% if a %}<p>A</p>{% endif %}{% if b %}<p>B</p>{% endif %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% if a %}
  <p>A</p>
{% endif %}
{% if b %}
  <p>B</p>
{% endif %}"
`);
  });

  it("formats if statement inside an HTML element", async () => {
    const input = "<div>{% if show %}<span>Shown</span>{% endif %}</div>";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"<div>
  {% if show %}
    <span>Shown</span>
  {% endif %}
</div>"
`);
  });

  it("formats nested if statements", async () => {
    const input = "{% if outer %}{% if inner %}<p>Nested</p>{% endif %}{% endif %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% if outer %}
  {% if inner %}
    <p>Nested</p>
  {% endif %}
{% endif %}"
`);
  });

  it("preserves whitespace normalization in if condition", async () => {
    const input = "{%  if   show   %}<p>Hello</p>{%   endif   %}";

    const result = await prettier.format(input, {
      parser: "shopware-twig",
      plugins: ["./src/index.js"],
    });

    expect(result).toMatchInlineSnapshot(`
"{% if show %}
  <p>Hello</p>
{% endif %}"
`);
  });
});

