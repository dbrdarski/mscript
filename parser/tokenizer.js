/*
 * Tiny tokenizer
 *
 * - Accepts a subject string and an object of regular expressions for parsing
 * - Returns an array of token objects
 *
 * tokenize("this is text.", { word:/\w+/, whitespace:/\s+/, punctuation:/[^\w\s]/ }, "invalid");
 * result => [{ token="this", type="word" },{ token=" ", type="whitespace" }, Object { token="is", type="word" }, ... ]
 *
 */

export const tokenizer = ({ defaultParser, defaultToken = "unmatched", onMismatch }) => {
const parsersStack = [];
  const tc = initializeParsers(defaultParser);
  return (s) => {
    let token;
    let m, r, t;
    return {
      parsers: {
        push (p) {
          parsersStack.push(tc);
          tc = p;
        },
        pop () {
          tc = parsersStack.pop();
        },
        get current () {
          return tc;
        }
      },
      read: () => {
        if (s) {
          t = null;
          m = s.length;
          for (const parser of tc.members) {
            if (m) {
              r = parser.pattern.exec(s);
              // try to choose the best match if there are several
              // where "best" is the closest to the current starting point
              if (r && (r.index < m)) {
                const value = r[0];
                t = {
                  value,
                  type: parser,
                  matches: r.slice(1)
                }
                m = r.index;
              }
            }
          }
          if (m) {
            // there is text between last token and currently
            // matched token - push that out as default or "unknown"
            const value = s.substr(0, m);
            const node = {
              value,
              type: {
                name: defaultToken,
                handler: onMismatch || defaultTokenHandler
              }
            };
            onMismatch && onMismatch(node);
            token = node;
          }
          if (t) {
            // push current token onto sequence
            token = t;
          }
          s = s.substr(m + (t ? t.value.length : 0));
          return token;
        }
      }
    }
  }
}

const id = x => {
  console.log(x);
  return x
};

const defaultTokenHandler = ({ type, value }) => ({
  token_type: type.name,
  value
})

const tokenizerContexts = {};

export const createTokenizerContext = (name, members) => {
  console.log({ name, members })
  if (name in tokenizerContexts) {
    throw Error (`Token context ${name} already declared!`);
  }
  return tokenizerContexts[name] = {
    name,
    members
   };
};

export const getTokenizerContext = (name) => {
  if (!tokenizerContexts.hasOwnProperty(name)) {
    throw Error (`Token context ${name} is not defined!`);
  }
  return tokenizerContexts[name];
}



const initializeParsers = (defaultParser) => {
  Object.values(tokenizerContexts).forEach(tc => {
    tc.members.sort((a, b) => (a.order || 0) - (b.order || 0));
  });
  return tokenizerContexts[defaultParser];
}

export const createTokenType = ({ name, pattern, order = 0, handler = defaultTokenHandler }) => ({
  name,
  pattern,
  order,
  handler
});
