import { parse } from "shopware-twig-parser";
import { doc } from "prettier";

const PARSER_IDENTIFIER = "shopware-twig";
const AST_FORMAT = "shopware-twig-ast";

// Extract doc builders
const { indent, hardline } = doc.builders;

/**
 * Print function that properly traverses the AST
 * @param {import("prettier").AstPath} path
 * @param {object} options
 * @param {Function} print
 * @returns {import("prettier").Doc}
 */
function print(path, options, print) {
  const node = path.node;

  // Handle the root AST structure that contains rootNode
  if (node.rootNode && node.rootNode.type === "template") {
    return print("rootNode");
  }

  switch (node.type) {
    case "template":
      // For template nodes, print all children
      return path.map(print, "children");

    case "twig_statement_directive":
      // Handle function calls
      if (node.function) {
        const functionName = node.function.name;
        return `{% ${functionName}() %}`;
      }

      // Handle block statements
      const tagName = node.tag?.name;
      const variableName = node.variable?.content;

      if (tagName === "block") {
        const openTag = `{% block ${variableName} %}`;
        const closeTag = "{% endblock %}";

        if (node.children && node.children.length > 0) {
          // If there are nested children, print them with proper indentation
          const childrenDocs = path.map(print, "children");

          return [
            openTag,
            indent([hardline, childrenDocs]),
            hardline,
            closeTag,
          ];
        } else {
          // Empty block - no space between tags
          return [openTag, closeTag];
        }
      }

      return "";

    default:
      // For unknown node types, return empty string
      return "";
  }
}

/**
 * Get visitor keys for AST traversal
 * @param {object} node
 * @param {Set<string>} nonTraversableKeys
 * @returns {string[]}
 */
function getVisitorKeys(node, nonTraversableKeys) {
  // Handle the root AST structure that contains rootNode
  if (node.rootNode && node.rootNode.type === "template") {
    return ["rootNode"];
  }

  // Define which keys should be traversed for each node type
  switch (node.type) {
    case "template":
      return ["children"];
    case "twig_statement_directive":
      return ["children"];
    default:
      // For other nodes, filter out non-traversable keys
      const keys = Object.keys(node).filter(
        (key) => !nonTraversableKeys.has(key)
      );
      return keys.filter((key) => {
        const value = node[key];
        // Only traverse arrays or objects that look like AST nodes
        return (
          Array.isArray(value) ||
          (value && typeof value === "object" && value.type)
        );
      });
  }
}

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
      parse,
      astFormat: AST_FORMAT,
      locStart: () => 0,
      locEnd: () => 0,
    },
  },
  printers: {
    [AST_FORMAT]: {
      print,
      getVisitorKeys,
    },
  },
};

export default plugin;
