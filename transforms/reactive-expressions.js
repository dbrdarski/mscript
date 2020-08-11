// VariableDeclarator needs to handle obj and array decostruction
// NOT: THe 'isReactive' logic needs to be breaken down
// NOT: to 'reactiveCreator' and 'reactiveExpr'

const traverse = require("@babel/traverse");
const id = x => x;

const reactiveKeys = {
  value: true,
  computed: true
}

const reactiveBindings = new WeakMap;

const isReactiveIdentifier = (key) => reactiveKeys.hasOwnProperty(key);

// const isReactive = (path) => path.parent.reactive || path.node.reactive;
const isReactive = (path) => path.node.reactive;
const setNodesReactive = (path) => {
  // path.node.reactive = true;
  path.parent.reactive = true;
  return true;
}

function setReactive (fn, path) {
  return path == null
  ? setReactive.bind(null, fn)
  : isReactive(path) && fn(path);
}

const propagateReactivity = setReactive(setNodesReactive);

const applyHandlers = (node, handlers = []) => (value, index) => (handlers[index] || id)(node[value]);
const helper = (block) => console.log(block) || block;
const getBinding = (scope, binding) => scope.bindings[binding] || (scope.parent ? getBinding(scope.parent, binding) : null);
module.exports = function (babel) {
  const t = babel.types;

  const mExpression = (operator, args) => t.callExpression(
    t.identifier('M'),
    [t.stringLiteral(operator), ...args]
  );

  const getKey = (node) => node.computed ? node.property : t.stringLiteral(node.property.name);
  const mApply = (node, args, operator, handlers) => mExpression(operator, args.map(applyHandlers(node, handlers)).filter(x => x != null));

  const handler = (args, { identifier, handlers, node } = {}) => function (path, state) {
    const target = node || path.node;
    const operator = identifier || target.operator;
    path.replaceWith(mApply(target, args, operator, handlers));
    // setNodesReactive(path);
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
            // console.log('N enter', path.node.name, path.node.type)
            switch (path.node.type) {
              case 'Identifier': {
                const notAlreadyReactive = propagateReactivity(path);
                if (notAlreadyReactive) return;
                const binding = getBinding(path.scope, path.node.name);
                const reactiveBinding = reactiveBindings.get(binding)
                reactiveBinding && setNodesReactive(path);
                // reactiveBinding && console.log('COMPARISON', reactiveBinding.end, path.node.start)
                // console.log('>>', path.node.name, [reactiveBindings.has(binding), path.parent.reactive])
                // console.log('ID', path.node.name === 'c1' && [reactiveBindings.has(binding), path.parent.reactive, path.parent.type])
                break;
              }
              case 'CallExpression': {
                // console.log('CALL', 'asdf')
                // console.log(isReactiveIdentifier(path.node.callee.name) && path.node.callee.name)
                propagateReactivity(path)
                isReactiveIdentifier(path.node.callee.name) && setNodesReactive(path);
                break;
              }
              case 'VariableDeclaration': {
                const { kind } = path.node;
                console.log('KKK', { kind })
                break;
              }
              default: {
                propagateReactivity(path) // && console.log('enter', path.node.type);
              }
            }
          }, exit (path) {
            // console.log('N exit', path.node.name, path.node.type)
            switch (path.node.type) {
              case 'VariableDeclarator': {
                if (isReactive(path)) {
                  // console.log('AAAAAAAAAAAAAAAAAAAAA')
                  const { name } = path.node.id;
                  const binding = getBinding(path.scope, name);
                  reactiveBindings.set(binding, path.parent);
                }
                break;
              }
              default: {
                propagateReactivity(path) // && console.log('enter', path.node.type);
              }
            }
          }
        })
      },
      UnaryExpression: { exit: setReactive(unary) },
      BinaryExpression: { exit: setReactive(mostCommonExpression) },
      LogicalExpression: { exit: setReactive(mostCommonExpression) },
      ConditionalExpression: { exit: setReactive(conditionalExpression) },
      // IfStatement: { exit: setReactive(conditionalExpression) },
      CallExpression: {
        exit: setReactive((path, state) => {
          const expression = path.node;
          // console.log({ expression })
          path.replaceWith(mExpression('call', [expression.callee, ...expression.arguments]));
        })
      },
      ExpressionStatement: {
        exit: setReactive ((path, state) => {
          const expression = path.node.expression;
          // console.log('TYPE', expression.type)
          if (expression.type === "AssignmentExpression" && expression.left.type === "MemberExpression") {
            path.node.target = expression.left.object;
            path.node.prop = getKey(expression.left);
            path.node.val = expression.right;
            handler(['target', 'prop', 'val'], { identifier: 'set' })(path);
          }
        })
      },
      MemberExpression: {
        exit: setReactive((path) => {
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
