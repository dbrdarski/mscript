import { defineLanguage } from '../../src/parser'

import Lexer from './lexer'
import AST from './ast'

export default defineLanguage(Lexer, AST)
