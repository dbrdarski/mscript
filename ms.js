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
        [t.stringLiteral(operator), ...args.map(applyHandlers(path.node, handlers))]
      )
    );
  };

  const mostCommonExpression = handler(['left', 'right']);
  const unary  = handler(['argument']);
  const conditionalExpression = handler.bind(null, ['test', 'consequent', 'alternate']);

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
      ConditionalExpression: conditionalExpression('?'),
      MemberExpression: handler(['object', 'property'], '.')
    }
  };
};
