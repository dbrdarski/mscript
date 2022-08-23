import { addNodeType } from "../parser";

export const Program = "Program";
export const Statement = "Statement";
export const Expression = "Expression";
export const Identifier = "Identifier";
export const Literal = "Literal";
export const StringLiteral = "StringLiteral";
export const NumericLiteral = "NumericLiteral";
export const DeclarationStatement = "DeclarationStatement";
export const AssignmentExpression = "AssignmentExpression";
export const BinaryExpression = "BinaryExpression";
export const MatchExpression = "MatchExpression";
export const BooleanLiteral = "BooleanLiteral";
export const NullLiteral = "NullLiteral";

addNodeType({
  name: Program,
  aliases: null,
  has: {
    body: [[Expression]]
  }
  // hasMany: [ Statement ]
})

addNodeType({
  name: Statement,
  aliases: null,
  has: {
    expression: [ Expression ],
    _delimiter: [ ";" ]
  }
  // hasMany: [ Statement ]
})

addNodeType({
  name: Identifier,
  aliases: [ Expression ],
  starts: true,
  l: null,
  r: null,
  belongsTo: [ Expression ]
});

addNodeType({
  name: MatchExpression,
  aliases: [ Expression ],
  l: [ Identifier ],
  r: [ Expression ]
});

addNodeType({
  name: NumericLiteral,
  aliases: [ Literal, Expression ],
  l: null,
  r: null
});

addNodeType({
  name: BooleanLiteral,
  aliases: [ Literal, Expression ],
  l: null,
  r: null
});

addNodeType({
  name: NullLiteral,
  aliases: [ Literal, Expression ],
  l: null,
  r: null
});

addNodeType({
  name: DeclarationStatement,
  aliases: [ Statement ],
  l: [ Identifier ],
  r: [ Expression ]
});

addNodeType({
  name: BinaryExpression,
  aliases: [ Expression ],
  l: [ Expression ],
  r: [ Expression ]
});
