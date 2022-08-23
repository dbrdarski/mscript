import M from "./m-framework.js"; // import sdf, { dfg } from "sdf"
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

$state: a = 2;

$state: {
  b = 2;
  c = 3;
} // const shouldShow = value(true)
//
// function List () {
//   var str = "123"
//   return (
//     <>
//       <span> title </span>
//       <ul class="list" {...props}>
//         { shouldShow && (<Li class="list-item">1{2}{"3"}{str}3</Li>) }
//         <Li class="list-item">2</Li>
//       </ul>
//     </>
//   )
// }
//
//
// var x
// x = 5
// var y = {}
// y.a = x * 10 + 3 + x
// var key = value("b")
// y[key] = y.zxc = y.xcv = "a1"
// var a = y.a
// var b = y[key]
//
// // const [ someVal, setSomeVal ] = value(3);
// const a1 = 1 + 2 + 3 + 4 + 5 * value(3)
// // const a1 = computed(([ a ]) => 1 + 2 + 3 + 4 + 5 * a, [ value(3) ]
//
// const b1 = 2 + 3
// const c1 = a1 + b1
// // const c1 = computed(a1 => a1 + b1, [ a1 ])
// const d1 = b1 + 1
//
// const cond = value(true)
// const result = cond ? a1 + b1 : c1 + d1
// // let [fn] = value(x => x)
// const fn = value(x => x)
// fn.apply(null, [c1, 3])
//
//
// let asdf = value(3);
// asdf = 4;
// let basd = asdf + 5;
// let xx = {}
// xx.y = value(3);
// const yy = xx + 23;
// // ref asdfghj = 3;