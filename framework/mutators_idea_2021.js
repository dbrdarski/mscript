p = obj => {
  let dirty = false
  return prop => getter => {
    const value = getter(obj[prop])
    if (!dirty) {
      dirty = true
      obj = { ...obj }
    }
    obj[prop] = value
    return obj
  }
}

const proxify = obj => {
  let dirty = false
  return (...args) => {
    if (args.length === 0) {
      dirty = false
      return obj
    }
    let [ prop, value, dynamic = false ] = args
    prop = (dynamic && typeof prop === "function") ? prop(propCache) : prop
  	const propCache = obj[prop]
    value = typeof value === "function" ? value(propCache) : value
    if (value !== propCache) {
      if (!dirty) {
        dirty = true
        obj = { ...obj }
      }
      obj[prop] = value
    }
    return obj
  }
}

const set = (prop, value) => o => proxify(o)(prop, value)

// Example sytax:

state: {
	counter = 1
  personData = {
  	a: 1,
   	b: 2
  }
}

computed: {
	blabla = counter + 2
}

// const blabla = computed(function () {
//   return this.counter + 2
// }, Object.defineProperties({
//   counter: {
//     get:
//   }
// })

mutate: {
	incCounter = () => {
    counter += 1 // counter(p_eq(1))
  }

	decCounter = () => {
    counter -= 1
  }

  const incCounter = mutate((counter) => {
    counter += 1
    setCounter(counter)
  })

  updateDeeplyNested = (value) => {
    a.b.c.d = 33
  }

  const updateDeeplyNested = mutate((a) => {
    _a = set("b", set("c", set("d", 33)))(a)
    // OR //
    _a = proxify(a)
      ("b", b => proxify(b)
        ("c", c => proxify(c)
          ("d", 33)))
    setA(_a)
  })

  updatePersonData = (newdata) => {
  	personData = {
		  ...personData,
  	  ...newdata
	  }
  }
}

dispatch: {

}
