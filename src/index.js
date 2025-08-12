const PARSER_IDENTIFIER = "shopware-twig";
const AST_FORMAT = "shopware-twig-ast";

/**
 * @type {import("prettier").Plugin}
 */
const plugin = {
  languages: [
    {
      name: "ShopwareTwig",
      parsers: [PARSER_IDENTIFIER],
    },
  ],
  parsers: {
    [PARSER_IDENTIFIER]: {
      parse: () => ({
        type: "root",
        children: [],
      }),
      astFormat: AST_FORMAT,
      locStart: () => 0,
      locEnd: () => 0,
    },
  },
  printers: {
    [AST_FORMAT]: {
      print: () => "{% block my_block %}{% endblock %}",
    },
  },
};

export default plugin;
