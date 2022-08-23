import * as NodeTypes from "./sample-language/node-types";
import * as parsers from "./sample-language/tokens";

import { createTokenType, parser } from "./parser";

console.log({ parsers })

export const parse = parser({
  tokenizerOptions: {
    defaultParser: parsers.PROGRAM
  },
  defaultAST: NodeTypes.Program
});
