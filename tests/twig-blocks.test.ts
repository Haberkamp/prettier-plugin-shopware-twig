import { it, expect } from "vitest";
import * as prettier from "prettier";

it.each([
  "{%block my_block %}{% endblock %}",
  "{% block my_block%}{% endblock %}",
  "{% block my_block %}{%endblock %}",
  "{% block my_block %}{% endblock%}",
])("formats spaces inside statement delimiters: %s", async (code) => {
  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchSnapshot();
});

it("removes the spaces inside empty block statements", async () => {
  const code = "{% block my_block %}       {% endblock %}";

  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  expect(result).toMatchInlineSnapshot(`"{% block my_block %}{% endblock %}"`);
});
