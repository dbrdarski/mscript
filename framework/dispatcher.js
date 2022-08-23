import { apply } from "./utils";

const stateQueue = [];
const domUpdates = [];
let stateDigestScheduled = false;

export const scheduleStateUpdate = (stateUpdate) => {
  if (!stateDigestScheduled) {
    stateDigestScheduled = true;
    setTimeout(dispatch);
  }
  stateQueue.push(stateUpdate);
}

const dispatch = () => {
  stateQueue.forEach(apply);
  stateQueue.length = 0;
  stateDigestScheduled = false;
  domUpdates.forEach(apply);
  domUpdates.length = 0;
};

export const updateDOM = (updateFn) => {
  domUpdates.push(updateFn);
}

export const effect = (fn) => (...args) => {
  return fn(...args);
}
