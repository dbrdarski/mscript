export const operators = {
  '+': flat.bind((x, y) => x + y),
  '-': flat.bind((x, y) => x - y),
  '*': flat.bind((x, y) => x * y),
  '/': flat.bind((x, y) => x / y),
  '**': flat.bind((x, y) => x ** y),
  '%': flat.bind((x, y) => x % y),
  '<': flat.bind((x, y) => x < y),
  '>': flat.bind((x, y) => x > y),
  '<=': flat.bind((x, y) => x <= y),
  '>=': flat.bind((x, y) => x >= y),
  '==': flat.bind((x, y) => x == y),
  '===': flat.bind((x, y) => x === y),
  '!=': flat.bind((x, y) => x != y),
  '!==': flat.bind((x, y) => x !== y),
  '!': flat.bind((x) => !x),
  '?': conditional.bind((x, y, z) => x ? y : z),
  '&&': conditional.bind((x, y) => x && y),
  '||': conditional.bind((x, y) => x || y),
  'in': flat.bind((x, y) => x in y),
  '&': flat.bind((x, y) => x & y),
  '|': flat.bind((x, y) => x | y),
  '~': flat.bind((x) => ~ x),
  '^': flat.bind((x, y) => x ^ y),
  '<<': flat.bind((x, y) => x << y),
  '>>': flat.bind((x, y) => x >> y),
  '>>>': flat.bind((x, y) => x >>> y),
  'typeof': flat.bind((x) => typeof x),
  'void': flat.bind(() => void 0),
  'instanceof': flat((x, y) => x instanceof y)
};

const flatten = (v) => typeof v === 'function' ? v() : v;
const maybeFlattenApply = (v, fn) => v === 'function' ? fn(v) : v;
const filterFlattenApply = (args, fn) => args.reduce((acc, arg) => (typeof arg === 'function' && acc.push(fn(arg)), acc), []);
const computed = (fn) => Object.defineProperties(fn, {});
const apply = fn => fn();
const define = (target, ...params) => {
  if (params.length > 1) {
    const [ prop, value ] = params;
    Object.defineProperty(target, prop, { value });
  } else {
    Object.defineProperties(Object.fromEntries(Object.entries(params[0].forEach(x => {
      x[1] = { value: x[1] };
    }))));
  }
}

export const createObservable = (getter) => {
  let dirty = false;
  let observers = [];

  function update (newObserverList) {
    this.position = newObserverList.length;
    newObserverList.push(this);
  }

  const subscribe = (fn) => {
    const item = { fn, update, position: void 0 };
    item.update(observers);

    return (newHandler) => {
      observers[item.position] = newHandler || false;
      if (!newHandler.length) dirty = true;
    }
  };

  const notify = () => {
    if (dirty) {
      const newObserverList = [];
      for (observer of observers) {
        if (observer) {
          observer.fn(getter);
          observer.update(newObserverList)
        }
      }
      observers = newObserverList;
      dirty = false;
    } else {
      observers.forEach(
        (o) => {
          return o.fn(getter);
        }
      );
    }
  };
  return [
    notify,
    subscribe
  ];
}

function contextApplyEach () {
  this.forEach(apply);
}

function subscribeDependency (observable) {
  observable.subscribe(this);
}

const memo = (fn, cached = false, cache) => [
  function () {
    if (!cached) {
      cache = fn();
      cache = true;
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

// NEXT: MEMO

function flatInner (flatten, args) {
  return this.apply(null, args.map(flatten));
}

function flat (...args) {
  const [ fn, invalidate ] = memo(flatInner.bind(this, flatten, args));
  const [ notify, subscribe ] = createObservable(fn);
  // subscribes to dependancies and creates destroy fn that unsubscribes from deps

  const onChange = () => invalidate() && notify();
  const destroy = contextApplyEach.bind(filterFlattenApply(args, subscribeDependency.bind(onChange)));

  define(fn, {
    destroy,
    subscribe
  });

  // if deps === 0 should computed also destroy?
  return fn;
}

function conditionalInner (flatten, condition, args, cache) {
  cache.current = this(flatten(condition), ...args);
  return flatten(cache.current);
}

function conditional (condition, ...args) {
  const cache = {};
  const [ fn, invalidate ] = memo(conditionalInner.bind(this, flatten, condition, args, cache));
  const [ notify, subscribe ] = createObservable(fn);

  const onChange = () => invalidate() && notify();
  const conditionalOnChange = (getter) => getter === cache.current && invalidate() && notify();

  // subscribes to dependancies and creates destroy fn that unsubscribes from deps
  const destroy = contextApplyEach.bind([
    subscribeDependency.call(onChange, condition),
    ...filterFlattenApply(args, subscribeDependency.bind(onChange))
  ]);

  define(fn, {
    destroy,
    subscribe
  });
}

export const value = (value) => {
  const getter = () => value;
  const [ notify, subscribe ] = createObservable(getter);
  const setter = (v) => {
    if (value === v) return;
    value = v;
    notify();
  };
  define(getter, {
    subscribe
  });
  return [ getter, setter ];
};

function M_Walker (parent, current, operators, operator, ...args) {
  const parentCache = parent;
}

export const M = (op, ...args) => {
  return operators[op](...args)
}
