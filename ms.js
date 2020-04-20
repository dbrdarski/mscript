const traverse = require("@babel/traverse");
const id = x => x;

const blashphemyKeys = {
  value: true,
  computed: true
}

const blashphemyBindings = new WeakSet;


const isBlashphemyIdentifier = (key) => blashphemyKeys.hasOwnProperty(key);

// const isBlashphemer = (path) => path.parent.blasphemer || path.node.blasphemer;
const isBlashphemer = (path) => path.node.blasphemer;
const spreadWord = (path) => {
  path.node.blasphemer = true;
  path.parent.blasphemer = true;
  return true;
}

function invokeBlasphemy (fn, path) {
  return path == null
  ? invokeBlasphemy.bind(null, fn)
  : isBlashphemer(path) && fn(path);
}

const applyHandlers = (node, handlers = []) => (value, index) => (handlers[index] || id)(node[value]);
// const helper = (block) => console.log(block) || block;
const getBinding = (scope, binding) => scope.bindings[binding] || (scope.parent ? getBinding(scope.parent, binding) : null);

module.exports = function(babel) {
  var t = babel.types;

  const getKey = (node) => node.computed ? node.property : t.stringLiteral(node.property.name);
  const mApply = (node, args, operator, handlers) => t.callExpression(
    t.identifier('M'),
    [t.stringLiteral(operator), ...args.map(applyHandlers(node, handlers)).filter(x => x != null)]
  );

  const handler = (args, { identifier, handlers, node } = {}) => function (path, state) {
    const target = node || path.node;
    const operator = identifier || target.operator;
    path.replaceWith(mApply(target, args, operator, handlers));
    // spreadWord(path);
  };
  const pipeNonNull = (...fns) => (val) => val == null ? null : fns.reduce((acc, fn) => fn(acc), val);
  const blockToFunction = (node) => node.type === 'BlockStatement' ? t.functionExpression(null, [], node) : node;
  const ifToTernaryExpression = (node) => node.type === 'IfStatement' ? mApply(node) : node;
  const mostCommonExpression = handler(['left', 'right']);
  const unary = handler(['argument']);
  const conditionalExpression = handler(['test', 'consequent', 'alternate'], {
    identifier: '?',
    handlers :[ null, blockToFunction, pipeNonNull(blockToFunction, ifToTernaryExpression) ]
  });

  return {
    visitor: {
      Program: function (path) {
        path.traverse({
          enter (path) {
            switch (path.node.type) {
              case 'Identifier': {
                const definition = invokeBlasphemy(spreadWord, path);
                // definition && console.log('AAAA', path.node.name)
                if (definition) return;

                const binding = getBinding(path.scope, path.node.name);
                blashphemyBindings.has(binding) && spreadWord(path);
                // console.log(path.node.name, binding && [binding.identifier])
                // binding && binding.identifier.blasphemer && spreadWord(path);
                break;
              }
              case 'CallExpression': {
                // console.log(isBlashphemyIdentifier(path.node.callee.name) && path.node.callee.name)
                isBlashphemyIdentifier(path.node.callee.name) && spreadWord(path);
                break;
              }
              case 'VariableDeclaration': {
                break;
              }
              // case 'FunctionExpression':
              // case 'ArrowFunctionExpression':
              // case 'TemplateLiteral':
              //   path.node.inJSXExpression = false;
              default: {
                invokeBlasphemy(spreadWord, path) // && console.log('enter', path.node.type);
              }
              // console.log(path.node.type, 'enter', isBlashphemer(path))
            }
          }, exit (path) {
            switch (path.node.type) {
              case 'VariableDeclarator': {
                if (isBlashphemer(path)) {
                  // console.log('AAAAAAAAAAAAAAAAAAAAA')
                  const { name } = path.node.id;
                  const binding = getBinding(path.scope, name);
                  blashphemyBindings.add(binding);
                }
                break;
              }
              default: {
                invokeBlasphemy(spreadWord, path) // && console.log('enter', path.node.type);
              }
            }
          }
        })
      },
      UnaryExpression: { exit: invokeBlasphemy(unary) },
      // Identifier (path) {
      //   const match = getBinding(path.scope, path.node.name);
      // },
      BinaryExpression: { exit: invokeBlasphemy(mostCommonExpression) },
      LogicalExpression: { exit: invokeBlasphemy(mostCommonExpression) },
      ConditionalExpression: { exit: invokeBlasphemy(conditionalExpression) },
      // IfStatement: { exit: invokeBlasphemy(conditionalExpression) },
      ExpressionStatement: {
        exit: invokeBlasphemy ((path, state) => {
          const expression = path.node.expression;
          if (expression.type === "AssignmentExpression" && expression.left.type === "MemberExpression") {
            path.node.target = expression.left.object;
            path.node.prop = getKey(expression.left);
            path.node.val = expression.right;
            handler(['target', 'prop', 'val'], { identifier: 'set' })(path);
          }
        })
      },
      // AssignmentExpression: {
      //   exit: invokeBlasphemy ((path) => {
      //     console.log(path.node)
      //     const expression = path.node.right;
      //     if (expression.type === "AssignmentExpression" && path.node.left.type === "MemberExpression") {
      //       expression.target = expression.left.object;
      //       expression.prop = getKey(expression.left);
      //       expression.val = expression.right;
      //       handler(['target', 'prop', 'val'], { identifier: 'set', node: expression })(expression);
      //     }
      //   })
      // },
      MemberExpression: {
        exit: invokeBlasphemy((path) => {
          const parent = path.parent;
          if (parent.type === 'AssignmentExpression' && parent.left === path.node) {
            // const assignment = path.findParent(path => path.isExpressionStatement());
            return;
          }
          path.node.right = getKey(path.node);
          handler(['object', 'right'], { identifier: 'get' })(path);
        })
      }
    }
  };
};

// ExpressionStatement: {
//   exit (path, state) {
//     const expression = path.node.expression;
//     if (expression.type === "AssignmentExpression" && expression.left.type === "MemberExpression") {
//       path.node.left = expression.left.object;
//       path.node.middle = getKey(expression.left);
//       path.node.right = expression.right;
//       handler(['left', 'middle', 'right'], 'set')(path);
//     }
//   }
// },
// MemberExpression: {
//   exit (path) {
//     const parent = path.parent;
//     if (parent.type === 'AssignmentExpression' && parent.left === path.node) {
//       // const assignment = path.findParent(path => path.isExpressionStatement());
//       return;
//     }
//     path.node.right = getKey(path.node);
//     handler(['object', 'right'], 'get')(path);
//   }
// }
