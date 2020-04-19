const traverse = require("@babel/traverse");
const id = x => x;

const applyHandlers = (node, handlers = []) => (value, index) => (handlers[index] || id)(node[value]);
const helper = (block) => console.log(block) || block

module.exports = function(babel) {
  var t = babel.types;
  const handler = (args, identifier, handlers) => function (path, state) {
    const operator = identifier || path.node.operator;
    // console.log(path.node)
    path.replaceWith(
      t.callExpression(
        t.identifier('M'),
        [t.stringLiteral(operator), ...args.map(applyHandlers(path.node, handlers)).filter(x => x != null)]
      )
    );
  };

  const blockToFunction = (node) => node != null && node.type === 'BlockStatement' ? t.functionExpression(null, [], node) : node;
  const mostCommonExpression = handler(['left', 'right']);
  const unary  = handler(['argument']);
  const conditionalExpression = handler(['test', 'consequent', 'alternate'], '?', [null, blockToFunction, blockToFunction]);

  return {
    visitor: {
      // Program: function (path) {
      //   path.traverse({
      //     enter: (path) => {
      //       switch (path.node.type) {
      //         case 'JSXExpressionContainer':
      //           path.node.inJSXExpression = true;
      //           break;
      //         case 'FunctionDeclaration':
      //         case 'FunctionExpression':
      //         case 'ArrowFunctionExpression':
      //         case 'TemplateLiteral':
      //           path.node.inJSXExpression = false;
      //         default:
      //           path.node.inJSXExpression = path.parentPath.node.inJSXExpression;
      //       }
      //     }
      //   })
      // },
      UnaryExpression: unary,
      BinaryExpression: mostCommonExpression,
      LogicalExpression: mostCommonExpression,
      ConditionalExpression: conditionalExpression,
      IfStatement: conditionalExpression,
      ExpressionStatement (path, state) {
        const expression = path.node.expression
        if (expression.type === "AssignmentExpression" && expression.left.type === "MemberExpression") {
          path.node.left = expression.left.object
          path.node.middle = expression.left.property
          path.node.right = expression.right
          handler(['left', 'middle', 'right'], 'set')(path)
        }
      },
      MemberExpression (path) {
        const assignment = path.parent.parentExpression;
        if (assignment) {
          assignment.replacementNode = path
          handler(['replacementNode', 'right'], 'set')(assignment)
        } else {
          handler(['object', 'property'], 'get')(path)
        }
      }
    }
  };
};
