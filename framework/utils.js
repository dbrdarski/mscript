export const flatten = (v) => typeof v === 'function' ? v() : v;
// const maybeFlattenApply = (v, fn) => v === 'function' ? fn(v) : v;

// filterFlattenApply ==  filters out non-function arguments, applies function arguments to a another function (used to subscribe to reactive getters)
export const filterFlattenApply = (args, fn) => args.reduce((acc, arg) => (typeof arg === 'function' && acc.push(fn(arg)), acc), []);

// const computed = (fn) => Object.defineProperties(fn, {});

export const apply = fn => fn();

export const define = (target, ...params) => {
  if (params.length > 1) {
    const [ prop, value ] = params;
    return Object.defineProperty(target, prop, { value });
  } else {
    return Object.defineProperties(target,
      Object.fromEntries(
        Object.entries(
          params[0])
            .map(x => {
              x[1] = { value: x[1] };
          return x;
        })
      )
    );
  }
};

export function contextApplyEach () {
  this.forEach(apply);
}

export function subscribeDependency (observable) {
  // this is binded to handler fn
  observable.subscribe(this);
}

export const memo = (fn, cached = false, cache) => [
  function () {
    if (!cached) {
      cache = fn();
      cached = true;
    }
    return cache;
  }, function invalidate () {
    if (cached === true) {
      cached = false;
      return true;
    }
    return false;
  }
];
