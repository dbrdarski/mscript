import { createTokenType, createTokenizerContext } from '../../tokenizer';
import { newline } from './basic';

export const MULTILINE_COMMENT = 'MULTILINE_COMMENT';

const MultilineComment = createTokenizerContext(MULTILINE_COMMENT, [
  multiline_comment_body,
  multiline_comment_end,
  newline
]);

export const multiline_comment_start = createTokenType({
  name: 'comment',
  pattern: /\/\*/,
  handler: ({ value }, { parsers }) => {
    parsers.push(MultilineComment);
    return {
      token_type: 'comment',
      value
    };
  }
});

export const multiline_comment_end = createTokenType({
  name: 'comment',
  pattern: /\*\//,
  handler: ({ value }, { parsers }) => {
    parsers.pop();
    return {
      token_type: 'comment',
      value
    };
  }
});

export const multiline_comment_body = createTokenType({
  name: 'comment',
  pattern: /((?!\*\/|\n).)+/,
});
