import { escapeRegExp } from '../../utils';
import { createTokenType, astNodeTypeIndex, createTokenizerContext } from '../../parser';
import { keywords, initOperators, matchOperator } from '../operators';

export const PROGRAM = 'PROGRAM';

export const string = createTokenType({
  name: 'string',
  pattern: /'(?:[^'\\]|\\.)*'/
});

export const word = createTokenType({
  name: 'word',
  pattern: /[a-zA-Z_$@][0-9a-zA-Z_$@]*/,
  handler: ({ value }) => {
    return value in keywords
      ? {
        token_type: 'keyword',
        value: keywords[value],
        node_type: astNodeTypeIndex[keywords[value].type]
      } : {
        token_type: 'identifier',
        value,
        node_type: astNodeTypeIndex.Identifier
      };
  }
});

export const number = createTokenType({
  name: 'number',
  pattern: /-?(\d+)(?:\.(\d*))?(?:[eE]([+\-]?\d+))?/,
  handler: ({ type, value }) => {
    return {
      token_type: 'number',
      value: Number(value),
      raw: value,
      node_type: astNodeTypeIndex.NumericLiteral
    };
  }
});

export const operator = createTokenType({
  name: 'operator',
  pattern: RegExp(initOperators().map(o => escapeRegExp(o.value)).join('|')),
  handler: ({ type, value, ...rest }) => {
    // console.log('OPERATOR', { type, value, ...rest });
    return {
      ...rest,
      token_type: type,
      value,
      node_type: matchOperator(value)
    }
  }
});

export const newline = createTokenType({
  name: 'newline',
  pattern: /[\n\r]/,
  handler: (token, { position }) => {
    position.nextline();
    return {
      type: 'newline'
    }
  }
});

export const whitespace = createTokenType({
  name: 'whitespace',
  pattern: /[ \t]+/,
});

export const comment = createTokenType({
  name: 'comment',
  pattern: /\/\/(.)*/
});
