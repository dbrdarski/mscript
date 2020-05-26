import { define, flatten, memo, contextApplyEach, filterFlattenApply, subscribeDependency } from './utils';
import { createObservable } from './observable'

function flatInner (flatten, args) {
  // this context is an operator fn
  return this.apply(null, args.map(flatten));
  // same as this(...args.map(flatten));
}

export function flat (...args) {
  // this context is an operator fn
  const [ fn, invalidate ] = memo(flatInner.bind(this, flatten, args));
  const [ notify, subscribe ] = createObservable(fn);
  // subscribes to dependancies and creates destroy fn that unsubscribes from deps

  const onChange = () => invalidate() && notify();
  // next line subscribes onChange to reactive getters in arguments (filtered by filterFlattenApply)
  // filterFlattenApply -> filters reactive getters and applies them to subsbsriber function
  // which return the unsubscribe fn
  // it ultimately returns an array of unsubscribe functions
  // which is then binded (the evalution is delayed) through contextApplyEach!!!

  const destroy = contextApplyEach.bind(filterFlattenApply(args, subscribeDependency.bind(onChange)));

  define(fn, {
    destroy,
    subscribe
  });

  // if deps === 0 should computed also destroy?
  return fn;
}

function conditionalInner (flatten, condition, args, cache) {
  // this context is an operator fn
  cache.current = this(flatten(condition), ...args);
  return flatten(cache.current);
}

export function conditional (condition, ...args) {
  // this context is an operator fn
  const cache = {};
  const [ fn, invalidate ] = memo(conditionalInner.bind(this, flatten, condition, args, cache));
  const [ notify, subscribe ] = createObservable(fn);

  const onChange = () => invalidate() && notify();
  const conditionalOnChange = (getter) => getter === cache.current && invalidate() && notify();

  // subscribes to dependancies and creates destroy fn that unsubscribes from deps
  const destroy = contextApplyEach.bind([
    subscribeDependency.call(onChange, condition),
    ...filterFlattenApply(args, subscribeDependency.bind(conditionalOnChange))
  ]);

  define(fn, {
    destroy,
    subscribe
  });

  return fn;
}
