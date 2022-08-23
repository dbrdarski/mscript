import { createObservable } from './observable'

class M { }

Object.setPrototypeOf(M.prototype, null)

class ReactiveValue extends M {
  #value
  constructor (value) {
    this.#value = value
  }
  lift () {
    return this.#value
  }
}

class FunctionCall extends M {
  constructor (fn, ...args) {
    this.fn = fn
    this.args = args
  }
  lift () {
    let result = this.fn(...this.args)
    while (result instanceof FunctionCall) {
      result = result.lift()
    }
    return result
  }
}

const lift = (x) => x instanceof ReactiveValue ? x.lift() : x

@state: (
  fname = 'Dane'
  lname = 'Brdarski'
)

@computed: (
  fullName = `${fname} ${lname}`
)

@define: (
  changeName = v => fname = value
)

$mutate: changeName = (fname, lname) => {
  if (fname != null) firstName = fname
  if (lname != null) lastName = lname
}

const changeName = (...args) => {
  [firstName, lastName] = mutate(
    (fname, lname) => {
      if (fname != null) this.firstName = fname
      if (lname != null) this.lastName = lname
    }, { firstName, lastName })
  return
})
