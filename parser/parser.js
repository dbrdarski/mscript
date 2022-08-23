import { tokenizer } from "./tokenizer";

export { createTokenType, createTokenizerContext, getTokenizerContext } from "./tokenizer";

const astNodeTypes = [];
export const astNodeTypeIndex = {};

export const addNodeType = (type) => {
  if (type.name in astNodeTypeIndex) {
    throw Error (`Type ${type.name} already declared!`);
  }
  astNodeTypes.push(type);
  astNodeTypeIndex[type.name] = type;
};

export const getNodeType = (typeName) => {
  if (!astNodeTypeIndex.hasOwnProperty(typeName)) {
    throw Error (`Token context ${typeName} is not defined!`);
  }
  return astNodeTypeIndex[typeName];
};

// const operators = [];
// const operatorIndex = {};
//
// export const addOperator = (options) => {
//   getOrSetDefault(operatorIndex, options.value, []).push(options);
//   operators.push(options);
// };
//
// export const initOperators = () => operators.sort((a,b) => b.value.length - a.value.length);

class PoisitionCounter {
  constructor () {
    this.cursor = 0;
    this.line = 1;
    this.row = 0;
  }
  read (length) {
    const { row, line, cursor: start } = this;
    const end = this.cursor += length;
    this.row += length;
    return { start, end, row, line: this.line };
  }
  nextline () {
    this.row = 0;
    this.line++;
  }
}

const reader = (read, handler) => {
  let temp = read();
  while (temp != null) {
    handler(temp);
    temp = read();
  }
};

// const collect = (read, collection = []) => {
//   reader(read, Array.prototype.push.bind(collection));
//   return collection;
// }

const assertType = (types, node_type) => {
  return [ node_type.name, ...node_type.aliases ].some(type => types.some(t => t === types));
};

export const parser = ({ tokenizerOptions, defaultAST }) => (code) => {
  const position = new PoisitionCounter;
  const { read, parsers } = tokenizer(tokenizerOptions)(code);

  const matchNode = (acc, token) => {
    // TODO: token.node_type.ends
    // TODO: initialize token.node = {}

    if (!acc.left) {
      if (token.node_type.starts) {
        acc.parent.push(token);
        acc.left = token;
      } else {
        throw Error (token);
      }
    } else {
      const right = token.node_type.r;
      if (right) {
        const rightNode = processToken(read());
        const assR = assertType(right, rightNode);
        token.node = { left: null, right: rightNode };
        console.log({ assR })
      }
      const left = token.node_type.l
      if (left) {
        const assL = assertType(left, acc.left.node_type);
        console.log({ assL })
        const leftNodePrecedence = acc.left.node_type.precedence;
        if (leftNodePrecedence != null) {
          if (token.node_type.precedence > leftNodePrecedence) {
            token.node.left = acc.left.node.right;
            acc.left.node.right = token;
          } else {
            token.node.left = acc.left;
            acc.left = token;
          }
        }
      }
    }
    // return acc;
  };

  const processToken = (token) => {
    const { handler } = token.type;
    return {
      ...position.read(token.value.length),
      ...handler(token, { position, parsers })
    };
  };

  const rootNode = {
    type: astNodeTypeIndex[defaultAST],
    start: 0,
    end: null,
    body: []
  }

  let tree = {
    current: rootNode,
    nodes: rootNode
  };

  reader(read, (token) => {
    const m = processToken(token);
    tree = matchNode(tree, m);
    console.log(m);
  });

  console.log({ tree })
  // processToken("(EOF)");
}

// return collect(read)
//   .map((token) => {
//     const { handler } = token.type;
//     return {
//       ...position.read(token.value.length),
//       ...handler(token, { position })
//     }
//   });

// console.log("TOKENS", );
