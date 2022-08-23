const matchSymbol = Symbol('match')

class Enum {
  constructor (name, options = null) {
    this.name = name
    this.options = options
  }
  // toString () {
  //   return `${this.constructor.name} {${this.name}}`
  // }
}

Object.defineProperties(Enum, {
  [matchSymbol]: {
    value (value) {
      return value instanceof this
    }
  }
})

function EnumOptions (name, options, ...values) {
  if (options.length !== values.length) {
    throw Error('Enum values do not match the options')
  }
  for (let x = 0; x < options.length; x++) {
    if (!(values[x] instanceof options[x])) {
      throw Error('Enum values do not match the options')
    }
  }
  return new this(name, values)
}

const VeggieColor = class VeggieColor extends Enum {
  static Red = new VeggieColor('Red')
  static Green = new VeggieColor('Green')
}

const Veggie = class Veggie extends Enum {
  static Tomato = new Veggie('Tomato')
  static Potato = new Veggie('Potato')
  static Cabagge = EnumOptions.bind(Veggie, 'Cabagge', [VeggieColor])
}

const veggie = Veggie.Cabagge(VeggieColor.Red)

const Thunk = class Thunk extends Enum {
  static FunctionCall = EnumOptions.bind(Thunk, 'FunctionCall', [Function, Object])
}

ee = (thunk) => {
  do {
    const [ fn, args ] = thunk.options
    thunk = fn(...args)
  } while (thunk instanceof Thunk)
  return thunk
}

fact = (n, acc = 1) => n === 0
  ? acc 
  : Thunk.FunctionCall(fact, [n - 1, n * acc])

ee(Thunk.FunctionCall(fact, [5]))
