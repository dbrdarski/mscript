// function walkerContext () {
//   let parent, current = null;
//   const walker = { parent, current };
//   const run =
//   function stepIn (context) {
//     const cache = parent;
//     parent = curent;
//     current = context;
//     return stepOut.bind(cache);
//   }
// }

function stepOut (cache) {
  this.current = cache;
}

export default class Walker {
  constructor () {
    this.current = null;
  }
  stepIn (context) {
    const cache = this.current;
    this.current = context;
    return stepOut.bind(this, cache);
  }
}
