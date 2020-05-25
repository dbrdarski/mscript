import { operators } from './framework/operators';
import { value } from './framework/state';

// NEXT: MEMO

// function M_Walker (parent, current, operators, operator, ...args) {
//   const parentCache = parent;
// }

export const M = (op, ...args) => {
  return operators[op](...args)
}





// APP //

const [ state, setState ] = value(3);
// const newState = state + 1;
const newState = M('+', state, 1);

window.setState = setState;

const App = () => {
  document.body.innerHTML = newState();
}

newState.subscribe(App);
App();
