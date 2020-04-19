const traverse = require("@babel/traverse");
const id = x => x;

const applyHandlers = (node, handlers = []) => (value, index) => (handlers[index] || id)(node[value]);
const helper = (block) => console.log(block) || block

const getBinding = (scope, binding) => scope.bindings[binding] || (scope.parent ? getBinding(scope.parent, binding) : null)

module.exports = function(babel) {
  var t = babel.types;

  const mApply = (node, args, operator, handlers) => t.callExpression(
    t.identifier('M'),
    [t.stringLiteral(operator), ...args.map(applyHandlers(node, handlers)).filter(x => x != null)]
  );

  const handler = (args, identifier, handlers) => function (path, state) {
    const operator = identifier || path.node.operator;
    // console.log(state.file.scope.bindings)
    // console.log(path.scope)
    path.replaceWith(mApply(path.node, args, operator, handlers));
  };
  const pipeNonNull = (...fns) => (val) => val == null ? null : fns.reduce((acc, fn) => fn(acc), val);
  const blockToFunction = (node) => node.type === 'BlockStatement' ? t.functionExpression(null, [], node) : node;
  const ifToTernaryExpression = (node) => node.type === 'IfStatement' ? mApply(node) : node;
  const mostCommonExpression = handler(['left', 'right']);
  const unary  = handler(['argument']);
  const conditionalExpression = handler(['test', 'consequent', 'alternate'], '?', [null, blockToFunction, pipeNonNull(blockToFunction, ifToTernaryExpression)]);

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
      UnaryExpression: { exit: unary },
      Identifier (path) {
        // console.log(path.node.name, Object.keys(path.scope.bindings))
        if (path.scope) {
          console.log(path.scope.hasBinding(path.node.name), path.node.name);
          const match = getBinding(path.scope, path.node.name);
          // console.log({ match })
          // console.log(path.node.name)
        }
      },
      BinaryExpression: { exit: mostCommonExpression },
      LogicalExpression: { exit: mostCommonExpression },
      ConditionalExpression: { exit: conditionalExpression },
      IfStatement: { exit: conditionalExpression },
      ExpressionStatement: {
        exit (path, state) {
          const expression = path.node.expression
          if (expression.type === "AssignmentExpression" && expression.left.type === "MemberExpression") {
            path.node.left = expression.left.object
            path.node.middle = expression.left.property
            path.node.right = expression.right
            handler(['left', 'middle', 'right'], 'set')(path)
          }
        }
      },
      MemberExpression: {
        exit (path) {
          const assignment = path.parent.parentExpression;
          if (assignment) {
            assignment.replacementNode = path
            handler(['replacementNode', 'right'], 'set')(assignment)
          } else {
            handler(['object', 'property'], 'get')(path)
          }
        }
      }
    }
  };
};
