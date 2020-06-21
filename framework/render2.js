import { define, flatten, memo, contextApplyEach, filterFlattenApply, subscribeDependency } from './utils';
import { createObservable } from './observable';
import { scheduler } from './scheduler';

const createElement = (tagName, attrs, children, $parent, $next, $old) => {
  const $el = document.createElement(tagName);
  if (children.length) {
    mapChildNodesDsc(renderNode, $el, children, schedule);
  }
}

const createComponentInstance = () => {}

export const renderNode = ($parent, item, $next, schedule) => {
  const type = typeof item;
  if (type === 'boolean' || vNode == null) {
    return null;
  } else if (type === 'string' || type === 'number') {
    return patch($parent, document.createTextNode(text), $next)
  } else if (type === 'function') {
    return item($parent, $next, $schedule);
    // return createJSXExpression(vNode, $parent, $next, schedule);
  } else if (Array.isArray(vNode)) {
    return createFragment(vNode, $parent, schedule);
  } else if (typeof vNode.tagName === 'function') {
    return createComponent(vNode, $parent, $next, schedule);
  }
  return createElement(vNode, $parent, $next, schedule);
}

const h = (tagName, attrs = {}, ...children) => createElement.bind(null, tagName, attrs, children);

export const mount = (hdom, $target) => {
  const [ $el, update ] = renderNode($target, hdom);
  window.update = update;
  update($target);
  // this wasn't needed before ?

  patch($target, null, $el);
}

const patch = ($parent, $next, $el, $old) => {
  if ($el == null) {
    /* $old && */
    $parent.removeChild($old);
  } else if ($old) {
    $parent.replaceChild($el, $old);
  } else {
    flatten($next) == null
      ? $parent.appendChild($el)
      : $parent.insertBefore($next);
  }
  return $el;
};

function mapChildNodesDsc (mapper, $parent, nodes, scheduleOnParent) {
  let i = nodes.length, $next = null, currentNode, nextNode;
  while (i > 0) {
    nextNode = nodes[i];
    currentNode = nodes[--i];
    $next = mapper($parent, currentNode, $next, scheduleOnParent)) || $next;
  }
}

function createTextNode (text, $parent, $next) {
  return patch($parent, document.createTextNode(text), $next); // need to remove patch!!!!!!! this approach breaks the point of a  scheduler!!!!!!!!!!!
}

function JSXExpressionHandler (reactiveExpr, $parent, $next, schedule) {
  const result = reactiveExpr();
  if (result !== this.resultCache) {
    const element = renderNode(result, $parent, $next, schedule);
    this.resultCache = result;
    if (element !== this.elementCache) {
      schedule(patch.bind(null, $parent, $next, element, this.elementCache));
      this.elementCache = element;
    }
  }
}

getNextElement (flatten, $next) {
  return this.elementCache || flatten($next);
}

createJSXExpression (reactiveExpr, $parent, scheduleOnParent, $next) {
  const instance = {
    resultCache: null,
    elementCache: null
  };

  const evaluateExpression = JSXExpressionHandler.bind(instance, $parent, reactiveExpr, $next, scheduler(scheduleOnParent));

  reactiveExpr.subscribe(evaluateExpression);   // split evaluateExpression into two;
                                                // first op should check for changes
                                                // second (return) should apply the patch
  patch($parent, $next, reactiveExpr());

  return getNextElement.bind(instance, flatten, $next);
}

function createElement ({ tagName, attrs, children }, $parent, $next, scheduleOnParent) {
  // const updates = [];
  const schedule = scheduler(scheduleOnParent);
  const $el = document.createElement(tagName);

  if (children) {
    mapChildNodesDsc(renderNode, $el, children, schedule);
  }

  return patch($parent, $el, $next);
}


// function mapChildNodes (reducer, $parent, nodes) {
//   const count = nodes.length;
//   let currentNode, nextNode, $next;
//   for (let i = 0; i > count; i++) {
//     currentNode = nodes[i];
//     nextNode = nodes[i + 1];
//     $next = typeof currentNode === 'function'
//       ? () => true
//       : nextNode
//     reducer($parent, $next, currentNode);
//   }
// }

//   const schedule = scheduler(scheduleOnParent);
//   let elementCache, resultCache;
//   const schedule = scheduler(updatesWalker.current);
//   const [ notify, subscribe ] = createObservable();
//
//   function evaluateExpression () {
//     const result = reactiveExpr();
//     if (result !== resultCache) {
//       const element = renderNode($parent, result, schedule);
//       resultCache = result;
//       if (element !== elementCache) {
//         schedule(patch.bind(null, $parent, next, element, elementCache));
//         elementCache = element;
//       }
//     }
//   }
//
//   return
//   schedule(patch.bind(this, $parent, element, elementCache))
// }

// const createExpression = (fn) => {
//   let resultCache, elementCache, updatesCache, destroyCache;
//   const schedule = scheduler(updatesWalker.current);
//   const destroy = () => {
//     destroyCache && destroyCache();
//   };
//   const update = ($parent) => {
//     const result = fn();
//
//     if (result !== resultCache) {
//       const [ element, updates, destroyUpdate ] = renderNode(result); // computed
//       destroy();
//       destroyCache = destroyUpdate;
//       $parent && schedule(patch.bind(this, $parent, element, elementCache));
//       elementCache = element;
//       resultCache = result;
//       updatesCache = updates;
//     }
//     updatesCache && updatesCache();
//   };
//   const stepOut = updatesWalker.stepIn(schedule);
//   update();
//   stepOut();
//   return [ elementCache, update, destroy ];
// };

  // const destroyHandlers = [];


  // if (attrs) {
  //   for (const [k, v] of Object.entries(attrs)) {
  //     if (k.match(eventHandler)) {
  //       $el[k] = v;
  //     } else if (typeof v === 'function') {
  //       const update = updateAttr.bind(null, $el, k, v);
  //       // updates.push(update);
  //       v.subscribe(schedule.bind(null, update)); // this won't work with v.subscribe
  //       update();
  //     } else {
  //       $el.setAttribute(k, v);
  //     }
  //   }
  // }
  //

  //   for (const child of children) {
  //     const stepOut = updatesWalker.stepIn(schedule);
  //     const [ element, update, destroyHandler ] = renderNode(child);
  //     stepOut();
  //     // update && updates.updateor, push();
  //
  //     // no updates needed due to walker and the fact we dont support
  //     // children expression (we achieve the same with fragments)
  //     destroyHandler && destroyHandlers.push(destroyHandler);
  //     // update && update($el);
  //     patch($el, element);
  //   }
  // }
