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
  '~': flat.bind((x, y) => x ~ y),
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

export const createObservable = () => {
  let dirty = false;
  let observers = [];
  let valueCache;

  function update (newObserverList) {
    this.position = newObserverList.length;
    newObserverList.push(this);
  }

  const subscribe = (...fns) => {
    if (!fns.length) return;
    const item = { fns, update, position: void 0 };
    item.update(observers);

    return (...newHandlers) => {
      observers[item.position] = newHandler || false;
      if (!newHandlers.length) dirty = true;
    }
  };

  const notify = () => {
    if (dirty) {
      const newObserverList = [];
      for (observer of observers) {
        if (observer) {
          observer.fns.forEach(apply);
          observer.update(newObserverList)
        }
      }
      observers = newObserverList;
      dirty = false;
    } else {
      observers.forEach(
        (o) => {
          return o.fns.map(apply);
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

function memo (fn, cached = false, cache) => [
  function () {
    if (!cached) {
      cache = fn();
      cache = true;
    }
    return cache;
  }, function invalidate () {
    cached = false
  }
}

// NEXT: MEMO

function flat (...args) {
  const [ fn, invalidate ] = memo(flatInner.bind(this, flatten, args));
  const [ notify, subscribe ] = createObservable();
  // subscribes to dependancies and creates destroy fn that unsubscribes from deps
  const destroy = contextApplyEach.bind(filterFlattenApply(args, reactive => reactive.subscribe(invalidate, notify)));

  define(fn, {
    destroy,
    subscribe
  });

  // if deps === 0 should computed also destroy?
  return fn;
}

function flatInner (flatten, args) {
  return this.apply(null, args.map(flatten));
}

function conditional (condition, ...args) {
  return computed(conditionalInner.bind(this, flatten, condition, args));
}

function conditionalInner (flatten, condition, args) {
  return flatten(this(flatten(condition), ...args));
}

function M_Walker (parent, current, operators, operator, ...args) {
  const parentCache = parent;
}

const M = (op, ...args) => {
  const fn = operators[op](...args)
}
