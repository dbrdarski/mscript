import { operators } from "./framework/operators";
import { value } from "./framework/state";
import { effect } from "./framework/dispatcher2";

// NEXT: MEMO

// function M_Walker (parent, current, operators, operator, ...args) {
//   const parentCache = parent;
// }

export const M = (op, ...args) => {
  return operators[op](...args)
}

window.$$$ = M;

// APP //

const [ number, setNumber ] = value(3);
const [ otherNumber, setOtherNumber ] = value(3);
const [ string, setString ] = value("abc");
const [ showString, setShowString ] = value(false);

// const newState = showString ? string + " ok" : number + 1;

const o1 = { a: 1, b: 2, c: 3 };
const [ o2, setO2 ] = value({ d: 7, e: 88 });

window.setO2 = effect(setO2);


// const newState = M("{...}", o1, o2, { prop: 33 });
const newState = M("?", showString, M("+", string, " ok"), M("+", otherNumber, 1));

window.setNumber = effect(setNumber);
window.setOtherNumber = effect(setOtherNumber);
window.setString = effect(setString);
window.setShowString = effect(setShowString);

// =====================================
//
// export default class {
//   @reactive number = 3
//   @reactive otherNumber = 3
//   @reactive string = "abc"
//   @reactive showString = false
//
//   @computed result = showString
//     ? string + "ok"
//     : otherNumber + 1
//
//   @effect action (self, value) {
//     self.number = self.number + value
//     self.otherNumber = self.number + 3
//   }
// }
//
//
// ============================================
//
// $view: View = ({ result }) => (
// 	<div>
//   	<span>${result}</span>
//     <div>
//   		<input value="0" oninput={inputValue(MyAction)} />
//   	</div>
// 	</div>
// )
//
// $setup: Setup = () => {
//   $state: {
//     number = 3,
//     otherNumber = 3,
//     string = "abc",
//     showString = false
//   }
//
//   $computed: result = showString
//     ? string + "ok"
//     : otherNumber + 1
//
//   $mutate: MyAction = (value) => {
//     number = number + value
//     otherNumber = number + 3
//   }
//
//   return {
//     result,
//     MyAction
//   }
// }
//
// export default component(View, Setup)
//
// =====================================
//
// $view: View = ({ result }) => (
// 	<div>${result}</div>
// )
//
// $setup: Setup = () => {
//   let number = 3,
//       otherNumber = 3,
//       string = "abc",
//       showString = false
//
//   const result = showString
//     ? string + "ok"
//     : otherNumber + 1
//
//   function MyAction (value) {
//     number = number + value
//     otherNumber = number + 3
//   }
//   return {
//     result
//   }
// }
//
// export default component(View, Setup)
//
// =====================================
//
// number: state(3)
// otherNumber: state(3)
// string: state("abc")
// showString: state(false)
//
// result: showString
//   ? string + "ok"
//   : otherNumber + 1
//
// effect MyAction (value) {{
//   number := number + value
//   otherNumber := number + 3
// }}
//
// window.action = effect((value) => {
//   window.setNumber((x) => x + value)
//   window.setOtherNumber(M("+", number, 3))
// });

const App = () => {
  document.body.innerHTML = JSON.stringify(newState());
}

newState.subscribe(App);
App();
