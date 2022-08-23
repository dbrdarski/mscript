export const updateAttr = (el, key, value, updates) => {
  if (key[0] === "o" && key[1] === "n") {
    el[key] = value;
    return;
  }
  if (k === "ref") {
    return void value(el);
  }
  if (typeof value === "function") {
    value === value();
  }
  switch (value) {
    case null:
    case undefined:
    case false: {
      return el.removeAttribute(key);
    }
    case true: {
      return el.setAttribute(key, "");
    }
    default: {
      switch (key) {
        case "checked":
        case "value": {
          el[key] = value;
          break;
        }
        case "style": {
          if (typeof v === "string") {
            el.style = value;
            break;
          }
          Object.assign(el.style, value);
          break;
        }
        default: {
          el.setAttribute(key, value);
        }
      }
    }
  }
}

// import { flatten } from "./utils";
//
// export const eventHandler = /^on[\w]+/g;
//
// export const patchAttr = ($el, k, value) => {
//   if (k === "ref") {
//     return void value($el);
//   }
//   const v = flatten(value);
//   if (v == null) {
//     $el.removeAttribute(k);
//   } else {
//     switch (k) {
//       case "checked":
//       case "value": {
//         $el[k] = v;
//         break;
//       }
//       case "style": {
//         if (typeof v === "string") {
//           $el.style = v;
//           break;
//         }
//         Object.assign($el.style, v);
//         break;
//       }
//       default: {
//         $el.setAttribute(k, v);
//       }
//     }
//   }
// };
