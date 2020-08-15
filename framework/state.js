import { createObservable } from './observable';
import { scheduleStateUpdate } from './dispatcher2.js'
import { define } from './utils';

export const value = (value) => {
  let queued = false;
  const getter = () => value;
  const [ notify, subscribe ] = createObservable(getter);
  const resolver = () => {
    queued = false;
    notify();
  }
  const setter = (v) => {
    if (value === v) return;
    else if (queued === false) {
      scheduleStateUpdate(resolver);
      queued = true;
    }
    value = v;
  };
  define(getter, {
    subscribe
  });
  return [ getter, setter ];
};
