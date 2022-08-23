import { defineAST } from "./parser";
import { createTokenizerContext } from "./tokenizer";

export default function defineNodeTypes () {
  defineAST("SuperScript", {
    has: ($) => [ $.Program ],
    context: {
      parser: createTokenizerContext()
    }
  });

  defineAST("Program", {
    context: {
      ignore: [ $.Whitespace, $.Linebreak ]
    },
    has: ($) => [ $.Statement ]
  });

  defineAST("Statement", {
    has: ($) => [ $.Expression ]
  });

  defineAST("Expression", {
    has: ($) => [
      $.AssignmentExpression,
      $.UnaryExpression,
      $.BinaryExpression,
      $.TernaryExpression,
      $.ConditionalExpression,
      $.FunctionExpression,
      $.Literal,
      $.Comment,
      $.MultilineComment
    ]
  });

  defineAST("MultilineComment", {
    context: {
      parser: createTokenizerContext()
    }
  });
};
