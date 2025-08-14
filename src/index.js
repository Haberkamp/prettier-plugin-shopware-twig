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
      // For template nodes, print all children with line breaks between them
      const childDocs = path.map(print, "children");
      if (childDocs.length === 0) {
        return "";
      }
      if (childDocs.length === 1) {
        return childDocs[0];
      }
      // Join children with hardlines
      return [
        childDocs[0],
        ...childDocs.slice(1).map((doc) => [hardline, doc]),
      ];

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

    case "html_element":
      const elementName = node.name;
      const attributes = node.attributes || [];
      const children = node.children || [];

      // Build attributes string
      let attributesStr = "";
      if (attributes.length > 0) {
        attributesStr = attributes
          .map((attr) => {
            if (attr.value !== undefined) {
              return ` ${attr.name}="${attr.value}"`;
            }
            return ` ${attr.name}`;
          })
          .join("");
      }

      // Handle void elements (self-closing)
      if (node.void) {
        return `<${elementName}${attributesStr}>`;
      }

      // Handle elements with children
      if (children.length > 0) {
        const childrenDocs = path.map(print, "children");
        let formattedChildren;

        if (childrenDocs.length === 1) {
          formattedChildren = childrenDocs[0];
        } else {
          // Join children with hardlines
          formattedChildren = [
            childrenDocs[0],
            ...childrenDocs.slice(1).map((doc) => [hardline, doc]),
          ];
        }

        return [
          `<${elementName}${attributesStr}>`,
          indent([hardline, formattedChildren]),
          hardline,
          `</${elementName}>`,
        ];
      } else {
        // Empty element
        return `<${elementName}${attributesStr}></${elementName}>`;
      }

    case "content":
      return node.content;

    case "doctype":
      return "<!doctype html>";

    case "html_named_entity":
    case "html_numeric_entity":
      return node.content;

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
    case "html_element":
      return ["children"];
    case "content":
    case "doctype":
    case "html_named_entity":
    case "html_numeric_entity":
      return []; // These are leaf nodes with no children to traverse
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
