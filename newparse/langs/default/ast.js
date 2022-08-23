export default ($, _) => {
  _.Program = $.has.many(_.Statement)

  // IDEA: implement match function as filter + flat + reduce!!!
  /* Join the inner resuls
     [{
       match, isComplete: true
     }, {
       match, isComplete: true
     }]
     and reduce is all are inComplete: true,
     take the first one and clear the token queue.
  */

  _.Statement = $.either(
    $.match(
      _.Expr,
      _.Newline,
      $.peak(_.Expr)
    // ),
    // $.match(
    //   _.Expr,
    //   _.StatementEnd
    )
  )

  _.Expr = $.is.either(
  // _.Expr = $.join(
    _.Literal,
    _.Identifier,
    _.ObjectExpression,
    // UnaryExpr,
    _.BinaryExpr,
    // TernaryExpr,
    // ConditionalExpr,
    _.LogicalExpr
  )

  _.ObjectExpression = $.match(
      $.tok(/\{/),
      _.ObjectProperties,
      $.tok(/\}/)
  )

  _.ObjectProperties = $.has.repeat(_.ObjectProperty)

  _.ObjectProperty = $.is.either(
    _.Identifier,
    $.match(
      $.either(
        _.Identifier,
        $.match(
          $.tok(/\[/),
          _.Identifier,
          $.tok(/\]/)
        )
      ),
      $.tok(/\:/),
      _.Expr
    )
  )

  _.BinaryExpr = $.match(
    _.Expr,
    _.BinaryOperator,
    _.Expr
  )

  _.BinaryOperator = $.join(
    _.AddSub,
    _.MulDiv,
    _.Pow,
    _.Modulo
  )

  _.LogicalExpr = $.match(
    _.Expr,
    _.LogicalOperator,
    _.Expr
  )

  _.LogicalOperator = $.join(
    _.LogicalOr,
    _.LogicalAnd
  )

  _.AddSub = $.tok.op('+','-')

  _.MulDiv = $.tok.op('*','/')

  _.Pow = $.tok.op('**')

  _.Modulo = $.tok.op('%')

  _.LogicalOr = $.tok.op('||')

  _.LogicalAnd = $.tok.op('&&')

  _.Literal = $.join(
    _.StringLiteral,
    _.NumericLiteral,
    _.BooleanLiteral,
    _.NullLiteral
  )

  _.Identifier = $.tok.word()

  _.StringLiteral = $.tok.string()

  _.NumericLiteral = $.tok.number()

  _.BooleanLiteral = $.tok.word('true','false')

  _.NullLiteral = $.tok.word('null')

  _.Newline = $.tok.newline()

  _.Whitespace = $.tok.whitespace()

  return _.Program
}
