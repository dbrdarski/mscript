export const log = label => value => {
  console.log(label, value)
  return value
}

export const id = x => x

export const pipe = (x, y) => z => y(x(z))

export const once = fn => () => fn.hasOwnProperty('cache')
  ? fn.cache
  : (fn.cache = fn())

export const flatten = value => typeof value === 'function'
  ? value()
  : value

export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// class ArrayLike extends Array {}
class Stack extends ArrayLike {
  static from (arrayLike) {
    const [ head, ...tail] = arrayLike
    return new Stack(
      head,
      tail.length
        ? this.from(tail)
        : emptyStack
    )
  }
  constructor (...args) {
    super(...args)
    // switch (args.length) {
    //   case 2: {
    //     Object.defineProperty(this, 'length', { value: args[1].length + 1 })
    //     break
    //   }
    //   case 1: {
    //     Object.defineProperty(this, 'length', { value: 1 })
    //     break
    //   }
    //   default: {
    //     Object.defineProperty(this, 'length', { value: 0 })
    //     break
    //   }
    // }
  }
  push (element) {
    return new Stack(element, this)
  }
  pop () {
    return this[1]
  }
  current () {
    return this[0]
  }
}

Object.setPrototypeOf(Stack.prototype, Object.create(null))

const emptyStack = new Stack

export { emptyStack as Stack }
