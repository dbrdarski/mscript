import { effect } from "./dispatcher2";

const EffectIterator = () => ({
  map ()
})


EffectIterator(arr)
  .map(($, row) => $.next(row, row.id, output))
  .filter(() => $())


class OrderedMap {

}
//
//
// const DblLinkListNode (value, prev, next) => ({
//   value,
//   prev,
//   next
// })

class ChainNode {
  constructor (value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
    if (left) {
      left.right = this;
    }
    if (right) {
      right.left = this;
    }
  }
}

class Chain {
  constructor () {
    this.right = this;
    this.left = this;
  }
  static from () {

  }

  *[Symbol.iterator] () {
    let current = this;
    while (current !== this) {
      current = this.right;
      yield (current.value);
    }
  }

  push (value) {
    const node = new ChainNode(value, this.right)
  }

  unshift (value) {
    const node = new ChainNode(value, null, this.right)
  }
  remove (node) {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }
}

//DOUBLY LINKED
class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push (val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.length++;
    return this;
  }

  pop () {
    //in case of empty list
    if (this.length === 0) {
      return false;
    }
    //get popped node
    const popped = this.tail;
    //save newTail to a variable (could be null)
    const newTail = this.tail.prev;
    //if newTail is not null
    if (newTail) {
      //sever connection to popped node
      newTail.next = null;
      //sever connection from popped node
      this.tail.prev = null;
      //in case of 1 length list
    } else {
      //make sure to edit head in case newTail is null
      this.head = null;
    }
    //assign new tail (could be null)
    this.tail = newTail;
    // subtract length
    this.length--;

    return popped;
  }

  shift( ) {
    //in case list is empty
    if (!this.head) {
      return false;
    }
    //save shifted node to variable
    const shiftedNode = this.head;
    //make the new head the next (might be null)
    const newHead = this.head.next; //might be null
    //if list is more than 1
    if (this.head !== this.tail) {
      newHead.prev = null;
      shiftedNode.next = null;
    } else {
      this.tail = null;
    }
    this.head = newHead;
    this.length--;
    return shiftedNode;
  }

  unshift (val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
    return this;
  }

  removeNode (node) {
    const { prev, next } = node;
    if (this.head === node && next) {
      this.head = next;
    }
    if (this.tail === node && prev) {
      this.tail = prev;
    }
    if (prev) {
      prev.next = next;
    }
    if (next) {
      next.prev = prev;
    }
  }

  *[Symbol.iterator] () {
    let current = this.head;
    while (current != null) {
      yield current.value;
      current = current.next;
    }
  }
}

function hash (str) {
    var hash = 0;
    if (str.length == 0) {
        return hash;
    }
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return (hash < 0 ? -1 * hash : hash) % 256;
}
