export const createObservable = (getter) => {
  let dirty = false;
  let observers = [];
  // added cache - might remove
  // let cache;

  function update (newObserverList) {
    this.position = newObserverList.length;
    newObserverList.push(this);
  }

  const subscribe = (fn) => {
    const item = { fn, update, position: void 0 };
    item.update(observers);

    return (newHandler) => {
      observers[item.position] = newHandler || false;
      if (!newHandler.length) dirty = true; // not sure about newHandler.length property
    }
  };

  const notify = () => {
    if (dirty) {
      const newObserverList = [];
      for (observer of observers) {
        if (observer) {
          //getter() === cache ||
          observer.fn(getter);
          observer.update(newObserverList)
        }
      }
      observers = newObserverList;
      dirty = false;
    } else {
      observers.forEach(
        (observer) => {
          // getter() === cache ||
          observer.fn(getter);
        }
      );
    }
  };
  return [
    notify,
    subscribe
  ];
}
