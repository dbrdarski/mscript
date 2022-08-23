import { createTokenType } from "./tokenizer";

export default function defineTokenTypes () {
  const string = createTokenType({
    name: "string",
    pattern: /"(?:[^"\\]|\\.)*"/,
    type: ($) => $.StringLiteral
  });

  const identifier = createTokenType({
    name: "identifier",
    pattern: /[a-zA-Z_$@][0-9a-zA-Z_$@]*/,
    type: ($) => $.Identifier
  });

  const number = createTokenType(function ($$) {
    return {
      name: "number",
      pattern: /-?(\d+)(?:\.(\d*))?(?:[eE]([+\-]?\d+))?/,
      type: ($) => $.NumericLiteral,
      handler: ({ type, value }) => {
        return {
          value: Number(value),
          raw: value
        };
      }
    };
  });

  const operator = createTokenType({
    name: "operator",
    pattern: RegExp(initOperators().map(o => escapeRegExp(o.value)).join("|")),
    type: ($) => $[matchOperator(value)],
    init () {

    },
    handler: ({ type, value }) => {
      // console.log("OPERATOR", { type, value, ...rest });
      return {
        operator: value
      }
    }
  });

  const newline = createTokenType({
    name: "newline",
    pattern: /[\n\r]/,
    type: ($) => $.Linebreak,
    handler: (token, { position }) => {
      position.nextline();
      return {
        type: "newline"
      }
    }
  });

  const whitespace = createTokenType({
    name: "whitespace",
    pattern: /[ \t]+/,
    type: ($) => $.Whitespace
  });

  const comment = createTokenType({
    name: "comment",
    pattern: /\/\/(.)*/,
    type: ($) => $.Comment
  });
}
