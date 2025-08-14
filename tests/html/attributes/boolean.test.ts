import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats boolean attributes", async () => {
  // ARRANGE
  const code = `
<button type="submit">This is valid.</button>
<button type="submit" disabled>This is valid.</button>
<button type="submit" disabled="">This is valid.</button>
<button type="submit" disabled="disabled">This is valid.</button>
<button type="submit" disabled=true>This is valid. This will be disabled.</button>
<button type="submit" disabled='true'>This is valid. This will be disabled.</button>
<button type="submit" disabled="true">This is valid. This will be disabled.</button>
<button type="submit" disabled=false>This is valid. This will be disabled.</button>
<button type="submit" disabled="false">This is valid. This will be disabled.</button>
<button type="submit" disabled='false'>This is valid. This will be disabled.</button>
<button type="submit" disabled=hahah>This is valid. This will be disabled.</button>
<button type="submit" disabled='hahah'>This is valid. This will be disabled.</button>
<button type="submit" disabled="hahah">This is valid. This will be disabled.</button>
<input type="checkbox" checked disabled name="cheese">
<input type="checkbox" checked="checked" disabled="disabled" name="cheese">
<input type='checkbox' checked="" disabled="" name=cheese >
<div lang=""></div>`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<button type="submit">This is valid.</button>
<button type="submit" disabled>This is valid.</button>
<button type="submit" disabled="">This is valid.</button>
<button type="submit" disabled="disabled">This is valid.</button>
<button type="submit" disabled="true">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="true">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="true">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="false">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="false">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="false">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="hahah">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="hahah">
  This is valid. This will be disabled.
</button>
<button type="submit" disabled="hahah">
  This is valid. This will be disabled.
</button>
<input type="checkbox" checked disabled name="cheese" />
<input type="checkbox" checked="checked" disabled="disabled" name="cheese" />
<input type="checkbox" checked="" disabled="" name="cheese" />
<div lang=""></div>"
`);
});
