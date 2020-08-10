export const getOrSetDefault = (target, prop, defaultValue = {}) => {
  if (!target.hasOwnProperty(prop)) {
    target[prop] = defaultValue;
  }
  return target[prop];
};
