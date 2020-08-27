import { tokenizer } from './tokenizer'

export const tokenize = tokenizer({
  // string: /'(?:[^'\\]|\\(?:[nr'\\]|u\{[0-9A-F]{4,6}\}))*'/,
  comment: /#(.)*\n/,
  string: /'(?:[^'\\]|\\.)*'/,
  word: /[a-zA-Z_$@][0-9a-zA-Z_$@]*/,
  num: /-?(\d+)(?:\.(\d*))?(?:[eE]([+\-]?\d+))?/,
  op: /\+\+|\+|\-\-|\-|\*\*\*|\*/,
  newline: /[\n\r]/,
  whitespace: /[ \t]+/,
}, 'unmatched');

// import { addToken, addNonExactMatchToken } from './tokenizer'
//
// export function init () {
//   // addNonExactMatchToken(/\d/, 'numeric');
//   // addNonExactMatchToken(/\w/, 'alpha');
//   // addNonExactMatchToken(/./, 'non_matched');
//   // addNonExactMatchToken(/↵/, 'newline');
//   addToken('\n', 'newline', false);
//   addToken('\t', 'tab', false);
//   addToken(' ', 'whitespace', false);
//   addToken('+', 'plus');
//   addToken('-', 'minus');
//   addToken('*', 'times');
//   addToken('**', 'square');
//   addToken('/', 'divide');
//   addToken('%', 'modulo');
//   addToken('\'', 'quot', false);
//   addToken('\\', 'esc', false);
//   addToken('"', 'dbl_quot', false);
//   addToken('\\\'', 'esc_quot', false);
//   addToken('\\"', 'esc_dlb_quot', false);
//   addToken('(');
//   addToken(')');
//   addToken('[');
//   addToken(']');
//   addToken('{');
//   addToken('}');
//   addToken('=');
//   addToken('==');
//   addToken('!=');
//   addToken('===');
//   addToken('!==');
//   addToken('.', 'dot');
//   addToken('...', 'spread', false);
//   addToken('<');
//   addToken('>');
//   addToken('<=');
//   addToken('>=');
//   addToken('=>');
//   addToken('@');
//   addToken('?');
//   addToken(':');
//
//   addToken('break');
//   addToken('case');
//   addToken('catch');
//   addToken('continue');
//   addToken('debugger');
//   addToken('default');
//   addToken('do');
//   addToken('else');
//   addToken('finally');
//   addToken('for');
//   addToken('function');
//   addToken('if');
//   addToken('return');
//   addToken('switch');
//   addToken('throw');
//   addToken('try');
//   addToken('var');
//   addToken('const');
//   addToken('while');
//   addToken('with');
//   addToken('new');
//   addToken('this');
//   addToken('super');
//   addToken('class');
//   addToken('extends');
//   addToken('export');
//   addToken('import');
//   addToken('null');
//   addToken('true');
//   addToken('false');
//   addToken('in');
//   addToken('instanceof');
//   addToken('typeof');
//   addToken('void');
//   addToken('delete');
//   addToken('yield');
//   // custom
//   addToken('def');
// }
