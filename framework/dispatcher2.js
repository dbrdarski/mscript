import { apply } from './utils';
import Queue from './queue';

const evaluateFn = ([ fn, ...args ]) => fn(...args);

const dispatcherQueue = new Queue;
const stateQueue = new Queue;
const domUpdates = new Queue;

let dispatcherIsRunning = false;

export const scheduleStateUpdate = (stateUpdate) => {
  stateQueue.push(stateUpdate);
}

// const evaluateStateChanges = () => stateQueue.run(evaluateFn);
// const evaluateUpdates = () => domUpdates.run(evaluateFn);

const dispatch = () => {
  dispatcherIsRunning = true;
  dispatcherQueue.run(evaluateFn);
  stateQueue.run(apply);
  domUpdates.run(apply);
  dispatcherIsRunning = false;
};

export const effect = (fn) => (...args) => {
  dispatcherQueue.push([fn, ...args]);
  dispatcherIsRunning || dispatch();
}

export const updateDOM = (updateFn) => {
  domUpdates.push(updateFn);
}
