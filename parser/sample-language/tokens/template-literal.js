export const TEMPLATE_LITERAL = 'TEMPLATE_LITERAL';

export const template_literal_quote = createTokenType({
  name: 'template_literal',
  pattern: /`/,
  handler: ({ value }, { parsers }) => {
    if (parsers.current === TemplateLiteral) {
      parsers.pop();
      return {
        token_type: 'template_literal_closing_token'
      };
    } else {
      parsers.push(TemplateLiteral);
      return {
        token_type: 'template_literal_opening_token'
      };
    }
  }
});

export const template_literal_expression_start = createTokenType({
  name: 'template_literal',
  pattern: /\$\{/,
  handler: (token, { parsers }) => {
    parsers.push(Program);
    return {
      token_type: 'template_literal'
    }
  }
});

export const template_literal_expression_end = createTokenType({
  name: 'template_literal',
  pattern: /\}/
});

export const template_literal_string = createTokenType({
  name: 'template_literal_string',
  pattern: /((\\\$\{|\\`)|(?!\$\{|\`).)+/
});

const TemplateLiteral = createTokenizerContext(TEMPLATE_LITERAL, [
  template_literal_string,
  multiline_comment_end,
  newline
]);
