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

const [ number, setNumber ] = value(3);
const [ string, setString ] = value('abc');
const [ showString, setShowString ] = value(false);

// const newState = showString ? string + ' ok' : number + 1;
const newState = M('?', showString, M('+', string, ' ok'), M('+', number, 1));

window.setNumber = setNumber;
window.setString = setString;
window.setShowString = setShowString;

const App = () => {
  document.body.innerHTML = newState();
}

newState.subscribe(App);
App();
