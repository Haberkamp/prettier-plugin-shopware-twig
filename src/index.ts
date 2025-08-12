const PARSER_IDENTIFIER = "shopware-twig";
const AST_FORMAT = "shopware-twig-ast";
import { type Plugin } from "prettier";

const plugin: Plugin = {
  languages: [
    {
      name: "ShopwareTwig",
      parsers: [PARSER_IDENTIFIER],
    },
  ],
  parsers: {
    [PARSER_IDENTIFIER]: {
      parse: () => null,
      astFormat: AST_FORMAT,
      locStart: () => 0,
      locEnd: () => 0,
    },
  },
  printers: {
    [AST_FORMAT]: {
      print: () => "",
    },
  },
};

export default plugin;
