import { flatten, EmptyStack } from './utils'

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

function read (data) {
 if (data.string) {
   data.tokenResult = null;
   data.matchIndex = data.string.length;
   for (const parser of data.tokenizerContext) {
     if (data.matchIndex) {
       const { pattern } = parser
       data.regexMatch = flatten(pattern).exec(data.string);
       // try to choose the best match if there are several
       // where "best" is the closest to the current starting point
       if (data.regexMatch && (data.regexMatch.index < data.matchIndex)) {
         const value = data.regexMatch[0];
         data.tokenResult = {
           value,
           type: parser,
           matches: data.regexMatch.slice(1)
         }
         data.matchIndex = data.regexMatch.index;
       }
     }
   }
   if (data.matchIndex) {
     // there is text between last token and currently
     // matched token - push that out as default or "unknown"
     const value = data.string.substr(0, data.matchIndex);
     const node = {
       value,
       type: {
         name: unmatchedToken,
         handler: onMismatch
       }
     };
     onMismatch && onMismatch(node);
     token = node;
   }
   if (data.tokenResult) {
     // push current token onto sequence
     token = data.tokenResult;
   }
   data.string = data.string.substr(data.matchIndex + (data.tokenResult ? data.tokenResult.value.length : 0));
   return token;
 }
}

export const tokenizer = ({ defaultParser, unmatchedToken = "unmatched", onMismatch }) => {
  const parsersStack = EmptyStack; // ????????? Here or inside return (string) function?
  const tokenizerContext = initializeParsers(defaultParser);
  // console.log({ tc })
  return (string) => {
    let token;
    let data = {
      string,
      tokenizerContext,
      parsersStack,
      matchIndex: null,
      regexMatch: null,
      tokenResult: null
    };
    let peekData = null;

    return {
      parsers: {
        push (parser) {
          parsersStack.push(data.tokenizerContext);
          data.tokenizerContext = parser;
        },
        pop () {
          tokenizerContext = parsersStack.pop();
        },
        get current () {
          return tokenizerContext;
        }
      },
      read () {
        if (peekData) {
          peekData = null;
        }
        return read(data);
      },
      peek () {
        if (peekData == null) {
          peekData = { ...data };
        }
        return read(peekData);
      }
    }
  }
}

const initializeParsers = (parsers) => Object.entries(parsers).map(([ name, { pattern, attrs, match} ]) => ({
  name,
  pattern,
  attrs,
  match
}))
