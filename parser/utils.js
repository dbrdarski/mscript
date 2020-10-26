export const getOrSetDefault = (target, prop, defaultValue = {}) => {
  if (!target.hasOwnProperty(prop)) {
    target[prop] = defaultValue;
  }
  return target[prop];
};

export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function curryOn (fn) {
  const arity = fn.length;

  return function curry (...args) {
    match(...args);
    if (args.length < arity) {
      return curry.bind(
        null, ...args);
    }

    const result = fn.call(null, ...args);
    return () => result;
  };
}

const pipe2 = (x, y) => (...args) => y(x(...args));
const pipe = (...fns) => fns.reduce(pipe2);
