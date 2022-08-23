import { id, pipe, log, once, escapeRegExp } from '../../src/utils'

export default ($, _) => {

  const staticTokens = new Set

  const addStaticTokens = (...tokens) => {
    tokens.forEach(token => staticTokens.add(token))
  }

  const matchStaticToken = token => staticTokens.has(token)

  const getTokens = once(
    () => RegExp(
      [...staticTokens]
        .sort(({ length: x }, { length: y }) => x === y ? 0 : x - y)
        .map(escapeRegExp)
        .join("|")
      )
  )

  _.word = $.tokenType(
    /[a-zA-Z_$@][0-9a-zA-Z_$@]*/,
    null,
    (token, ...args) => args.length
      ? args.indexOf(token) > -1 && token
      : token
  )

  _.number = $.tokenType(/-?(\d+)(?:\.(\d*))?(?:[eE]([+\-]?\d+))?/)

  _.string = $.tokenType(/'(?:[^'\\]|\\.)*'/)

  _.operator = $.tokenType(
    getTokens,
    {
      argsHandler (...args) {
        addStaticTokens(...args)
        return args
      }
    },
    (token, ...args) => args.indexOf(token) > -1
  )

  _.newline = $.tokenType(/[\n\r]/)

  _.whitespace = $.tokenType(/[ \t]+/)
}
