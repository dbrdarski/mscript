import { createTokenizerContext } from '../../parser';

import {
  PROGRAM,
  comment,
  string,
  word,
  number,
  operator,
  newline,
  whitespace
} from './basic';

export { PROGRAM } from './basic'; 

import { multiline_comment_start } from './multiline-comment';

const Program = createTokenizerContext(PROGRAM, [
  comment,
  multiline_comment_start,
  string,
  word,
  number,
  operator,
  newline,
  whitespace
]);
