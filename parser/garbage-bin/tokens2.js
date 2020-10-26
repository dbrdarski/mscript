// import { escapeRegExp } from '../utils';
// import { createTokenType, astNodeTypeIndex, createTokenizerContext } from '../parser';
// import { keywords, initOperators, matchOperator } from './operators';

// export const PROGRAM = 'PROGRAM';
// export const MULTILINE_COMMENT = 'MULTILINE_COMMENT';
// export const TEMPLATE_LITERAL = 'TEMPLATE_LITERAL';
//
// export const multiline_comment_start = createTokenType({
//   name: 'comment',
//   pattern: /\/\*/,
//   handler: ({ value }, { parsers }) => {
//     parsers.push(MultilineComment);
//     return {
//       token_type: 'comment',
//       value
//     };
//   }
// });
//
// export const multiline_comment_end = createTokenType({
//   name: 'comment',
//   pattern: /\*\//,
//   handler: ({ value }, { parsers }) => {
//     parsers.pop();
//     return {
//       token_type: 'comment',
//       value
//     };
//   }
// });
//
// export const multiline_comment_body = createTokenType({
//   name: 'comment',
//   pattern: /((?!\*\/|\n).)+/,
// });

// export const template_literal_quote = createTokenType({
//   name: 'template_literal',
//   pattern: /`/,
//   handler: ({ value }, { parsers }) => {
//     if (parsers.current === TemplateLiteral) {
//       parsers.pop();
//       return {
//         token_type: 'template_literal_closing_token'
//       };
//     } else {
//       parsers.push(TemplateLiteral);
//       return {
//         token_type: 'template_literal_opening_token'
//       };
//     }
//   }
// });
//
// export const template_literal_expression_start = createTokenType({
//   name: 'template_literal',
//   pattern: /\$\{/,
//   handler: (token, { parsers }) => {
//     parsers.push(Program);
//     return {
//       token_type: 'template_literal'
//     }
//   }
// });
//
// export const template_literal_expression_end = createTokenType({
//   name: 'template_literal',
//   pattern: /\$\{/
// });
//
// export const template_literal_string = createTokenType({
//   name: 'template_literal_string',
//   pattern: /((\\\$\{|\\`)|(?!\$\{|\`).)+/
// });

// export const string = createTokenType({
//   name: 'string',
//   pattern: /'(?:[^'\\]|\\.)*'/
// });
//
// export const word = createTokenType({
//   name: 'word',
//   pattern: /[a-zA-Z_$@][0-9a-zA-Z_$@]*/,
//   handler: ({ value }) => {
//     return value in keywords
//       ? {
//         token_type: 'keyword',
//         value: keywords[value],
//         node_type: astNodeTypeIndex[keywords[value].type]
//       } : {
//         token_type: 'identifier',
//         value,
//         node_type: astNodeTypeIndex.Identifier
//       };
//   }
// });
//
// export const number = createTokenType({
//   name: 'number',
//   pattern: /-?(\d+)(?:\.(\d*))?(?:[eE]([+\-]?\d+))?/,
//   handler: ({ type, value }) => {
//     return {
//       token_type: 'number',
//       value: Number(value),
//       raw: value,
//       node_type: astNodeTypeIndex.NumericLiteral
//     };
//   }
// });
//
// export const operator = createTokenType({
//   name: 'operator',
//   pattern: RegExp(initOperators().map(o => escapeRegExp(o.value)).join('|')),
//   handler: ({ type, value, ...rest }) => {
//     console.log('OPERATOR', { type, value, ...rest });
//     return {
//       ...rest,
//       token_type: type,
//       value,
//       node_type: matchOperator(value)
//     }
//   }
// });
//
// export const newline = createTokenType({
//   name: 'newline',
//   pattern: /[\n\r]/,
//   handler: (token, { position }) => {
//     position.nextline();
//     return {
//       type: 'newline'
//     }
//   }
// });
//
// export const whitespace = createTokenType({
//   name: 'whitespace',
//   pattern: /[ \t]+/,
// });

// const Program = createTokenizerContext(PROGRAM, [
//   comment,
//   multiline_comment_start,
//   string,
//   word,
//   number,
//   operator,
//   newline,
//   whitespace
// ]);
//
// const MultilineComment = createTokenizerContext(MULTILINE_COMMENT, [
//   multiline_comment_body,
//   multiline_comment_end,
//   newline
// ]);
//
// const TemplateLiteral = createTokenizerContext(TEMPLATE_LITERAL, [
//   template_literal_string,
//   multiline_comment_end,
//   newline
// ]);
