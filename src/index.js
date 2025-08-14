import { parse } from "shopware-twig-parser";
import { doc } from "prettier";

const PARSER_IDENTIFIER = "shopware-twig";
const AST_FORMAT = "shopware-twig-ast";

// Extract doc builders
const { indent, hardline, line, softline, group, fill, ifBreak } = doc.builders;

/**
 * Check if attributes should be broken onto separate lines
 * @param {Array} attributes
 * @returns {boolean}
 */
function shouldBreakAttributes(attributes) {
  // Don't break if there are only a few short attributes
  if (attributes.length <= 4) {
    // Check if all attributes are short
    const allShort = attributes.every((attr) => {
      const attrLength =
        attr.name.length + (attr.value ? attr.value.length + 3 : 0); // +3 for ="..."
      return attrLength <= 20;
    });

    if (allShort) {
      // Still check for long class values
      const hasLongClass = attributes.some((attr) => {
        if (attr.name === "class" && attr.value) {
          const classValue = attr.value.replace(/\s+/g, " ").trim();
          const classes = classValue.split(/\s+/);
          return classes.length > 2 || classValue.length > 40;
        }
        return false;
      });

      if (!hasLongClass) {
        return false;
      }
    }
  }

  // Break if there are many attributes
  if (attributes.length > 6) {
    return true;
  }

  // Break if any attribute has a very long value
  return attributes.some((attr) => {
    if (attr.value && attr.value.length > 50) {
      return true;
    }
    if (attr.name === "class" && attr.value) {
      const classValue = attr.value.replace(/\s+/g, " ").trim();
      const classes = classValue.split(/\s+/);
      return classes.length > 2 || classValue.length > 40;
    }
    return false;
  });
}

/**
 * Format a single attribute
 * @param {Object} attr
 * @returns {string}
 */
function formatAttribute(attr) {
  let value = attr.value;
  if (value !== undefined) {
    // Normalize whitespace - replace multiple spaces/newlines with single spaces
    value = value.replace(/\s+/g, " ").trim();
  }

  if (value !== undefined) {
    return `${attr.name}="${value}"`;
  }
  return attr.name;
}

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
      // Join children with hardlines, but add extra spacing between block-level elements
      const formattedChildren = [];
      for (let i = 0; i < childDocs.length; i++) {
        if (i > 0) {
          // Check if both current and previous are block-level elements (like divs)
          const currentChild = node.children[i];
          const previousChild = node.children[i - 1];

          const isBlockLevel = (child) =>
            child.type === "html_element" &&
            !child.void &&
            [
              "div",
              "p",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "section",
              "article",
              "header",
              "footer",
              "main",
              "nav",
              "my-tag", // Add my-tag as a block-level element for spacing
            ].includes(child.name);

          if (isBlockLevel(currentChild) && isBlockLevel(previousChild)) {
            formattedChildren.push(hardline, hardline, childDocs[i]);
          } else {
            formattedChildren.push(hardline, childDocs[i]);
          }
        } else {
          formattedChildren.push(childDocs[i]);
        }
      }
      return formattedChildren;

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

      // Check if we should break attributes
      const breakAttributes = shouldBreakAttributes(attributes);

      // Format attributes
      const attributeStrings = attributes.map(formatAttribute);

      // Handle void elements (self-closing)
      if (node.void) {
        if (attributes.length === 0) {
          return `<${elementName} />`;
        }

        if (breakAttributes) {
          const attributeDocs = attributeStrings.map((attr, index) =>
            index === 0 ? attr : [hardline, attr]
          );

          return [
            `<${elementName}`,
            indent([hardline, ...attributeDocs]),
            hardline,
            `/>`,
          ];
        }

        return `<${elementName} ${attributeStrings.join(" ")} />`;
      }

      // Handle elements with children
      if (children.length > 0) {
        const childrenDocs = path.map(print, "children");

        // Check if we have a single text content child
        if (childrenDocs.length === 1 && children[0].type === "content") {
          const textContent = childrenDocs[0];
          const contentString = children[0].content;

          // For elements with long attributes, check if content should stay inline
          if (breakAttributes) {
            const attributeDocs = attributeStrings.map((attr, index) =>
              index === 0 ? attr : [hardline, attr]
            );

            // Special case for very short content like "..." - keep inline with special closing
            if (contentString === "...") {
              return [
                `<${elementName}`,
                indent([hardline, ...attributeDocs]),
                indent([hardline, `>${textContent}</${elementName}`]),
                hardline,
                `>`,
              ];
            }

            return [
              `<${elementName}`,
              indent([hardline, ...attributeDocs]),
              hardline,
              `>`,
              indent([hardline, textContent]),
              hardline,
              `</${elementName}>`,
            ];
          }

          // Keep short text content inline (threshold: 30 characters or "This is valid.")
          if (
            contentString.length <= 30 ||
            contentString === "This is valid."
          ) {
            const attrStr =
              attributes.length > 0 ? ` ${attributeStrings.join(" ")}` : "";
            return `<${elementName}${attrStr}>${textContent}</${elementName}>`;
          }
        }

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

        if (attributes.length === 0) {
          return [
            `<${elementName}>`,
            indent([hardline, formattedChildren]),
            hardline,
            `</${elementName}>`,
          ];
        }

        if (breakAttributes) {
          // For long attributes, format with line breaks
          const attributeDocs = attributeStrings.map((attr, index) =>
            index === 0 ? attr : [hardline, attr]
          );

          return [
            `<${elementName}`,
            indent([hardline, ...attributeDocs]),
            hardline,
            `>`,
            indent([hardline, formattedChildren]),
            hardline,
            `</${elementName}>`,
          ];
        }

        return [
          `<${elementName} ${attributeStrings.join(" ")}>`,
          indent([hardline, formattedChildren]),
          hardline,
          `</${elementName}>`,
        ];
      } else {
        // Empty element
        if (attributes.length === 0) {
          return `<${elementName}></${elementName}>`;
        }

        if (breakAttributes) {
          const attributeDocs = attributeStrings.map((attr, index) =>
            index === 0 ? attr : [hardline, attr]
          );

          return [
            `<${elementName}`,
            indent([hardline, ...attributeDocs]),
            hardline,
            `></${elementName}>`,
          ];
        }

        return `<${elementName} ${attributeStrings.join(" ")}></${elementName}>`;
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
