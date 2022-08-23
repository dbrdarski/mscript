// import { NODE_MATCH } from "./definitions";
// import { getOrSetDefault } from "./utils";

// import { consumeSource } from "./consumer";

const keyword_initial_char = /[a-zA-Z_$@]/;
const keyword = /^[a-zA-Z_$@][0-9a-zA-Z_$@]*$/;
const digit = /[0-9]/;
const number = /^(\d+)(?:\.(\d*))?(?:[eE]([+\-]?\d+))?$/;
// const number = /^(-?\d+)(?:\.(\d*))?(?:[eE]([+\-]?\d+))?$/;

const tokenTypes = [];

const token_definition = ({ type, value, operator = true, ...rest }) => ({
  type,
  value,
  operator,
  ...rest
});

const registerTokenType = (name, definition) => {
  const { matchStart, consume, resolve } = definition({ readwhile });
  tokenTypes.push({
    name,
    matchStart,
    consume,
    resolve
  });
};

const registerTokenType ("number", ({ read_while, token_definition }) => {
  const matchStart = (char) => number.test(char);
  return {
    matchStart,
    consume: read_while.bind(null, matchStart),
    resolve: (token) => token_definition({
      type: "number",
      value: token,
    })
   }
});

const registerTokenType ("string", ({ read_while, token_definition }) => {
  const matchStart = (char) => number.test(char);
  return {
    matchStart: (char) => char === """ || char === "\"",
    consume: (token, char) => {
      const quote = token[0];
      let escaped = false;

      read_while((token, char) => {
        if (!escaped) {
          if (char === "\\") {
            escaped = true;
          }
          return char !== quote;
        } else {
          escaped = false;
        }
      })
    }),
    resolve: (token) => token_definition({
      type: "string",
      value: token,
    })
   }
});

const registerTokenType ("word", ({ read_while }) => {
  const matchStart: (char) => keyword_initial_char.test(char);
  const consume = read_while.bind(null, (token) => keyword.test(token));
  const resolve = (token) => token_definition(keywords.find(token);
  ? {
    type: "keyword",
    value: token
  } : {
    type: "identifier",
    value: token,
    operator: false
  });

  return {
    matchStart,
    consume,
    resolve
  }
});

const matchTokenType = (input) => {
  const char = input.peek(char);
  tokenType.find(type => type.matchStart(char));
  if (tokenType) tokenType.consume(input);
  else throw Error ("Umatched character: " + char);
};

class TokenNode {
  match (char) {
    return this[char];
  }
}

const tokensByName = {};
const tokensByValue = {};
const tokensRootNode = new TokenNode;

function detectCollisions (value, name) {
  if (tokensByName.hasOwnProperty(name)) throw Error (`A token named ${name} already exists`)
  if (tokensByValue.hasOwnProperty(value)) throw Error (`A token for ${value} already exists`)
}

export const addToken = (value, name = value, propagate = true) => {
  detectCollisions(value, name);
  let node = tokensRootNode;
  for (let i = 0; i < value.length; i +=1 ) {
    const char = value[i];
    node = getOrSetDefault(node, char, new TokenNode);
  }
  node[NODE_MATCH] = tokensByName[name] = tokensByValue[value] = { name, value, propagate };

};

export const tokenize = (source) => {
  const tokens = [];
  const { length } = source;
  let start = 0,
      end = 0,
      token = "",
      prevMatch = null,
      node = tokensRootNode;
  while (end < length) {
    const char = source[end];
    const match = node.match(char);
    token = token.concat(char);
    if (match) {
      node = match;
      end += 1;
      if (match.hasOwnProperty(NODE_MATCH)) {
        prevMatch = {
          start,
          end,
          token,
          type: match[NODE_MATCH].name
        };
      }
    } else {
      node = tokensRootNode;
      if (prevMatch == null) {
        end = start + 1;
        char = source[start];
        tokens.push({
          start,
          end,
          token: char,
          type: /\d/.test(char) ? "numeric" : "char",
        })
        start = end;
        token = "";
        continue;
      }
      tokens.push(prevMatch);
      start = prevMatch.end
      end = prevMatch.end;
      prevMatch = null;
      token = "";
    }
  }
  prevMatch && tokens.push(prevMatch);
  return tokens;
};
