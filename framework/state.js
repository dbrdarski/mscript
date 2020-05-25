import { createObservable } from './observable'
import { define, apply } from './utils';

const stateQueue = [];
let stateDigestScheduled = false;

const scheduleStateUpdate = (stateUpdate) => {
  if (!stateDigestScheduled) {
    stateDigestScheduled = true;
    setTimeout(resolveState);
  }
  stateQueue.push(stateUpdate);
}

const resolveState = () => {
  stateQueue.forEach(apply);
  stateQueue.length = 0;
  stateDigestScheduled = false;
};

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
