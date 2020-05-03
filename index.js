import M from './m-framework.js'; // import sdf, { dfg } from 'sdf'
//
// function asd () {
//   let asdf;
//   if (true && 123) {
//     return;
//   }
//   if (false || 345) {
//   	asdf = 1
//   } else {
//   	asdf = 2
//   }
//   return asdf
// }
//
// const asdf = 3
// const bsdf = 4
//
// function asde () {
//   const a1 = 3
// }
//
// function bsde () {
//   const a2 = 4;
//   asde + bsdf
// }

var x;
x = 5;
var y = {};
y.a = x * 10 + 3 + x;
var key = value('b');
M("set", y, key, y.zxc = y.xcv = 'a1');
var a = y.a;
var b = M("get", y, key);
const a1 = M("+", 1 + 4, M("*", 5, value(3))); // const a1 = computed(a => 5 + 5 * a, [ value(3) ]

const b1 = 2 + 3;
const c1 = M("+", a1, b1); // const c1 = computed(a1 => a1 + b1, [ a1 ])

const d1 = b1 + 1;
const cond = value(true);
const result = M("?", cond, M("+", a1, b1), M("+", c1, d1));