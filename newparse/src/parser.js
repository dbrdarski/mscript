import { id, pipe, log } from './utils'
import { tokenizer } from './tokenizer'

const proxifier = (methods, target = methods, fn = id) => new Proxy (fn, {
  get (target, key) {
    let prop
    if (target.hasOwnProperty(key)) {
      prop = target[key]
    }
    if (methods.hasOwnProperty(key)) {
      prop = methods[key]
    }
    if (prop) {
      switch (typeof prop) {
        case 'function':
          return proxifier(methods, methods, pipe(target, prop))
        case 'object':
          if (prop && !Array.isArray(prop)) {
            return proxifier(methods, prop, fn)
          }
        default:
          return fn.bind(null, prop)
      }
    }
    throw Error(`Unrecognized method: ${key}`)
  },
  apply (target, thisArg, argumentsList) {
    return target.apply(thisArg, arguments)
  }
})

class TokenType {
  constructor (pattern, attrs, handler) {
    this.pattern = pattern
    this.attrs = attrs
    this.handler = handler
  }
  match (token) {
    value
  }
}

const define = (methods, def) => {
  const o = {}
  const proxy = new Proxy(o, {
    get (target, prop) {
      return () => def[prop]
    },
    set (target, prop, value) {
      target[prop] = value
      console.log
      return true
    }
  })
  return (def(proxifier(methods), proxy), o)
}

export const AstMethods = {
  // tok: log('tok'),
  // word: log('word'),
  // op: log('op'),
  // string: log('string'),
  // number: log('number'),
  // whitespace: log('whitespace'),
  // newline: log('newline')
  has: node => parent => attrs => ({
    type: parent,
    attrs,
    children: node()
  }),
  is: node => parent => attrs => ({
    type: node(),
    attrs,
    children
  }),
  repeat: node => parent => attrs => ({

  }),
  many: log('many'),
  peak: log('peak'),
  either: log('either'),
  match: log('match'),
  join: log('join')
}

export const LexerMethods = {
  tokenType: (pattern, attrs, match) => {
    return {
      pattern,
      attrs,
      match
    }
  }
}

const token = (tokens) => Object.assign(() => {

}, tokens)

export const defineLanguage = (lexerDefinition, astDefinition) => {
  // const defaultParser = define(LexerMethods, lexerDefinition)
  const defaultParser = {}
  lexerDefinition(LexerMethods, defaultParser)
  // console.log({ defaultParser })
  const ast = define({ ...AstMethods, tok: defaultParser }, astDefinition)
  return tokenizer({
    defaultParser,
    onMismatch (token) {
      throw Error(`Unknown token: ${token}`)
    }
  })
}
