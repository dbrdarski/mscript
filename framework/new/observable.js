export const createObservable = (getter) => {
  const empty = []
  let observers = []
  let index = 0

  function updateObserverInList (observer, observerList) {
    observerList[observer.position = index ? empty[index--] : observerList.length] = observer
  }

  const subscribe = (fn) => {
    const observer = { fn, position: void 0 }
    updateObserverInList(observer, observers)

    return (newHandler) => {
      observers[item.position] = newHandler || false
      if (!newHandler) empty[index++] = item.position
    }
  }

  const notify = () => {
    if (index) {
      const newObserverList = []
      for (observer of observers) {
        if (observer) {
          //getter() === cache ||
          observer.fn(getter)
          updateObserverInList(observer, newObserverList)
        }
      }
      observers = newObserverList
      index = empty.length = 0
    } else {
      observers.forEach(
        (observer) => {
          // getter() === cache ||
          observer.fn(getter)
        }
      )
    }
  }
  return [
    notify,
    subscribe
  ]
}
