import { patchAttr } from "./attrs";

const attrs = (el, attrs) => {
  for (key of Object.keys(attrs)) {
    patchAttr(el, key, attrs[key])
  }
};

const updateAttrs = (el, attrs, updates) => {
  if (typeof attrs === "function") {
    const update = spreadAttrsHandler().bind(null, el)
    updates.push(update);
    return update();
  }
  const update = "bla bla";
};

const spreadElementsHanlder = (elementCache, elementList, parent, children) => {
  let newCache = new Set;
  for (const [ index, child ] of Object.entries(children)) {
    patchElement(parent, child, elementList[index])
    newCache.add(child);
    elementCache.delete(child);
  }
  for (key of cache) {
    parent.removeChild(child);
  }
  elementCache = newCache;
  elementList = children
}

const spreadElements = (parent) => spreadElementsHanlder.bind(null, new Set, [])

const spreadAttrsHandler = (cache, element, attrs) => {
  let newCache = new Set;
  for (const [ key, value ] of Object.entries(attrs)) {
    patchAttr(element, key, value);
    newCache.add(key);
    cache.delete(key);
  }
  for (key of cache) {
    element.removeAttribute(key);
  }
  cache = newCache;
}

const spreadAttrs = element => spreadAttrsHandler.bind(null, new Set, element);

const h = (tagName, attrs = {}, ...children) => {
  return { tagName, attrs, children };
};

class Vnode {
  constructor (vnode) {
    this.type = vnode.tagName;
    this.attrs = attrs;
    this.children = children;
    this.attached = false;
    this.$el = null;
    this.cached = false;
  }
  attach () {
    this.attached = true;
  },
  detach () {
    this.attached = false;
  }
}
