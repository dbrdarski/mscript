import { createObservable } from "./observable";
import { scheduleStateUpdate } from "./dispatcher2.js"
import { define } from "./utils";

export const value = (value) => {
  let queued = false;
  const getter = () => value;
  const [ notify, subscribe ] = createObservable(getter);
  const resolver = () => {
    queued = false;
    notify();
  }
  const setter = (v) => {
    if (typeof v === "function") {
      v = v(value)
    }
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

// let limit = 100000;
// var arr = [];
// var val = 0;
//
// console.time();
// for (let x = 0; x < limit; x++) {
//   arr.push(x);
// }
// console.timeEnd();
// console.log(` === PUSH: ${val} ===`, arr);
//
// console.time();
// for (let x = limit - 1; x >= 0; x--) {
//   val = arr.pop();
// }
// console.timeEnd();
// console.log(` === POP: ${val} ===`, arr);
//
// console.time();
// for (let x = 0; x < limit; x++) {
//   arr[x] = x;
// }
// console.timeEnd();
// console.log(` === SET INC: ${val} ===`, arr);
//
// console.time();
// for (let x = limit - 1; x >= 0; x--) {
//   val = arr[x];
//   // console.log(x)
//   arr.length = x;
// }
// console.timeEnd();
// console.log(` === GET DEC: ${val} ===`, arr);
//
// console.time();
// arr = Array(limit);
//
// let index = 0;
// for (let x = 0; x < limit; x++) {
//   index = x;
//   arr[x] = x;
// }
// console.timeEnd();
// console.log(` === GET: ${val} ===`, arr)
//
// console.time();
// for (let x = limit - 1; x >= 0; x--) {
//   val = arr[x];
//   index = x;
// }
//
// console.timeEnd();
// console.log(` === DEC: ${val} ===`, arr)
