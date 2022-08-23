const ASTs = {};
const types = {};

class ASTNode {
  constructor (name) {
    this.name = name;
    this.has = [];
    this.belongsTo = [];
    this.token = null;
    this.context = {};
  }
  registerToken (token) {
    this.token = token;
  },
  addParserContext (...items) {
    this.context.parser?.push?.(...items) || this.belongsTo.forEach(node => node.addParserContext(...items));
  }
}

export const defineAST = (name, definition) => {
  if (ASTs.hasOwnProperty(name))
    throw Error (`AST node type ${type} already declared!`);
  ASTs[name] = definition;
  types[name] = new ASTNode(name);
}

export const initializeASTs = () => {
  Object.values(types).forEach((node) => {
    const definition = ASTs[node.name];
    node.has = definition.has?.(types) || [];
  });

  node.has.forEach((childNode) => {
    childNode.belongsTo.push(node);
  });

  if (definition?.context?.parser) {
    node.context.parser = definition.context.parser;
  // } else if (node.belongsTo.length) {
  //   node.belongsTo
  } else if (this.token) {
    this.addParserContext(this.token);
  }
}
