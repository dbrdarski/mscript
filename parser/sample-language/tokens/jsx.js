export const jsx_fragment_opening = createTokenType({
  name: 'jsx_fragment',
  pattern: /<>/, //TODO: write pattern
  handler: (token, { parsers }) => {
    parsers.push(JSXElement);
    return {
      token_type: 'jsx_fragment',
      value: '<>'
    }
  }
});

export const jsx_fragment_closing = createTokenType({
  name: 'jsx_fragment',
  pattern: /</>/, //TODO: write pattern
  handler: (token, { parsers }) => {
    parsers.pop();
    return {
      token_type: 'jsx_fragment',
      value: '</>'
    }
  }
});

export const jsx_element_opening = createTokenType({
  name: 'jsx_element',
  pattern: /</
});

export const jsx_attribute = createTokenType({
  name: 'jsx_attribute',
  pattern: / /,
});

export const jsx_element_attribute = createTokenType({
  name: 'jsx_attribute_expression_opening',
  pattern: / /,
});

export const jsx_element_attribute = createTokenType({
  name: 'jsx_attribute_expression_closing',
  pattern: / /,
});

export const jsx_element_attribute = createTokenType({
  name: 'jsx_attribute_expression_closing',
  pattern: / /,
});
