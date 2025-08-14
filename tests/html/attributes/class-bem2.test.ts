import { it, expect } from "vitest";
import * as prettier from "prettier";

it("formats BEM classes correctly", async () => {
  // ARRANGE
  const code = `
<div class="news__header widget__content">
  <div class="news__tabs">
    <h1 class="news__tab-wrapper news__head-item">
      <a
        class="home-link home-link_blue_yes news__tab news__tab_selected_yes mix-tabber__tab mix-tabber__tab_selected_yes"
        tabindex="0"
        aria-selected="true"
        aria-controls="news_panel_news"
        data-key="news"
        id="news_tab_news"
        data-stat-link="news.tab.link.news"
        data-stat-select="news.tab.select.news"
        target="_blank"
        role="tab"
        href="https://yandex.ru/news?msid=1581089780.29024.161826.172442&mlid=1581088893.glob_225"
        rel="noopener"
        >...</a
      >
    </h1>
  </div>
</div>
`;

  // ACT
  const result = await prettier.format(code, {
    parser: "shopware-twig",
    plugins: ["./src/index.js"],
  });

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
"<div class="news__header widget__content">
  <div class="news__tabs">
    <h1 class="news__tab-wrapper news__head-item">
      <a
        class="home-link home-link_blue_yes news__tab news__tab_selected_yes mix-tabber__tab mix-tabber__tab_selected_yes"
        tabindex="0"
        aria-selected="true"
        aria-controls="news_panel_news"
        data-key="news"
        id="news_tab_news"
        data-stat-link="news.tab.link.news"
        data-stat-select="news.tab.select.news"
        target="_blank"
        role="tab"
        href="https://yandex.ru/news?msid=1581089780.29024.161826.172442&mlid=1581088893.glob_225"
        rel="noopener"
        >...</a
      >
    </h1>
  </div>
</div>"`);
});
