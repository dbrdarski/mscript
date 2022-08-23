import { NODE_MATCH } from "./definitions";
import { getOrSetDefault } from "./utils";

// import { consumeSource } from "./consumer";

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
