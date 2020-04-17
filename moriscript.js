const traverse = require("@babel/traverse");

const operators = {
  '+': 'add',
  '-': 'sub',
  '*': 'multiply',
  '/': 'divide',
  '*': 'pow',
  '%': 'mod',
  '<': 'lt',
  '>': 'gt',
  '<=': 'lte',
  '>=': 'gte',
  '==': 'eq',
  '===': 'eqw',
  '!': 'not',
  '&&': 'and',
  '||': 'or',
  '??': 'if'
}


module.exports = function(babel) {
  var t = babel.types;

  const handler = (left, right, identifier) => function (path, state) {
    const operator = identifier || operators[path.node.operator];
    // console.log({ operator })
    if (path.node.inJSXExpression && operator ) {
      path.replaceWith(
        t.callExpression(
          t.memberExpression(t.identifier('$'), t.identifier(operator)),
          [path.node[left], path.node[right]]
        )
      );
    }
  };

  const handleExpressions = handler('left', 'right');

  return {
    visitor: {
      Program: function (path) {
        path.traverse({
          enter: (path) => {
            switch (path.node.type) {
              case 'JSXExpressionContainer':
                path.node.inJSXExpression = true;
                break;
              case 'FunctionDeclaration':
              case 'FunctionExpression':
              case 'ArrowFunctionExpression':
              case 'TemplateLiteral':
                path.node.inJSXExpression = false;
              default:
                path.node.inJSXExpression = path.parentPath.node.inJSXExpression;
            }
          }
        })
      },
      BinaryExpression: handleExpressions,
      LogicalExpression: handleExpressions,
      ConditionalExpression: handler('consequent', 'alternate', 'if')
    }
  };
};
