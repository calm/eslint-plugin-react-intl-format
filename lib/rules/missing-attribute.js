/**
 * @fileoverview FormattedMessage must have defaultMessage and id attributes
 * @author Blaine Muri
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var hasLogged = false;

module.exports = {
    meta: {
        docs: {
            description: "FormattedMessage must have defaultMessage and id attributes",
            category: "Intl",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
          {
              "type": "object",
              "properties": {
                  "noTrailingWhitespace": {
                      "type": "boolean"
                  }
              },
              "additionalProperties": false
          }
        ]
    },

    create: function(context) {
      const noWhitespace = context.options[0] ? context.options[0].noTrailingWhitespace : true;

      return {
        JSXOpeningElement: function(node) {
          if (node.name.name === 'FormattedMessage') {
            const attributeNames = node.attributes.map(node => node.name.name);
            // Check that it has the required attributes
            if (!attributeNames.includes('id')) {
              context.report({
                node: node,
                message: 'missing attribute: id',
              })
            }
            if (!attributeNames.includes('defaultMessage')) {
              context.report({
                node: node,
                message: 'missing attribute: defaultMessage',
              })
            }

            // Check to see that the attributes aren't empty
            if (node.attributes && node.attributes.length > 0) {
              node.attributes.forEach(attribute => {
                const type = attribute.name.name;
                if (type === 'id' || type === 'defaultMessage') {
                  if (!attribute.value.value) {
                    context.report({
                      node: node,
                      message: `empty attribute: ${type}`,
                    })
                  }
                  if (noWhitespace) {
                    if (attribute.value.value.startsWith(' ') || attribute.value.value.endsWith(' ')) {
                      context.report({
                        node: attribute.value,
                        message: 'no trailing whitespace',
                      })
                    }
                  }
                }
              })
            }
          }
        },
      };
    }
};
