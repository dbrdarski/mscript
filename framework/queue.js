class LinkedListQueue {
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

class ArrayBasedQueue {
  constructor () {
    this.list = [];
    this.currentIndex = 0;
  }
  push (...items) {
    this.list.push(...items);
  }
  next () {
    return this.list[this.currentIndex++];
  }
  run (handler) {
    while (this.currentIndex < this.list.length) {
      handler(this.next());
    }
    this.list.length = 0
    this.currentIndex = 0;
  }
}

module.exports = LinkedListQueue
