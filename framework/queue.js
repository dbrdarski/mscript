module.exports = class Queue {
  constructor () {
    this.current = null;
    this.last = null;
  }
  push (value) {
    const node = {
      value,
      next: null
    };
    if (this.current) {
      this.last.next = node;
    } else {
      this.current = node;
    }
    this.last = node;
  }
  next () {
    if (this.current == null) return;
    const { next, value } = this.current;
    this.current = next;
    return value;
  }
  run (handler) {
    while (this.current != null) {
      handler(this.next());
    }
    this.last = null;
  }
}
