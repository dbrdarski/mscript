import { NODE_MATCH } from "./definitions"

function matchNode ({ start, end, item, prevMatch, node }, char) {
  console.log("MATCHING", { char, start, end, item, node })
  const match = node.match(char);
  if (!match) {
    console.log("FAIL", { char, match, node });
    if (prevMatch) {
      this.add({ ...prevMatch });
      console.log(prevMatch);
      return {
        ...prevMatch,
        node: this
      };
    } else {
      node.fail && node.fail(this);
      return this;
    }

    // if (!prevMatch) {
    //   node.fail && node.fail(this);
    //   return {
    //     start: this.current.start,
    //     end: this.current.end,
    //     prevMatch: null,
    //     item: this.initial.item,
    //     node: this.initial.node
    //   }
    // } else {
    //   prevMatch && this.add(prevMatch);
    //   const { ...pMatch } = prevMatch;
    //   pMatch.start += pMatch.item.length;
    //   pMatch.end = pMatch.start;
    //   pMatch.item = this.initial.item;
    //   return pMatch;
    // }
  } else {
    item = item.concat(char);
    end += 1;
    this.success();
    if (match.hasOwnProperty(NODE_MATCH)) {
      const type = match[NODE_MATCH];
      if (type.continue) {
        console.log("CONTINUE", item)
        prevMatch = { start, end, item, prevMatch, node: match, type };
        node = match;
      } else {
        console.log("FINISH", item)
        prevMatch = { start, end, item, prevMatch: null, node: match, type };
        this.add(prevMatch);
        start = end;
        item = this.item;
        node = this;
      }
    }
    return { start, end, item, prevMatch, node };
    // this.success();
    // item = item.concat(char);
    // end += 1;
    // if (match.hasOwnProperty(NODE_MATCH)) {
    //  const type = match[NODE_MATCH];
    //   // console.log({ NODE_MATCH, ...type })
    //   prevMatch = {
    //     start,
    //     end,
    //     item,
    //     prevMatch: null,
    //     node: this.initial.node,
    //     type
    //   };
    //
    //   if (!type.continue) {
    //     console.log("!!!!!!!!!!!!!!!!!", { start, end })
    //     this.add({
    //       ...prevMatch,
    //       node: match
    //     });
    //     start = end;
    //     item = this.initial.item;
    //     node = this.initial.node;
    //   }
    // }
    // return { start, end, item, prevMatch, node: match };
  }
}

export const consumeSource = (consumer, source) => {
  const consume = matchNode.bind(consumer);
  const { length } = source;
  const state = {
    start: 0,
    end: 0,
    prevMatch: null,
    item: consumer.item,
    node: consumer
  }
  while (state.end < length) {
    const char = source[state.end];
    console.log({ char, state: { ...state } });
    const { start, end, item, prevMatch, node } = consume(state, char);
    Object.assign(state, { start, end, item, prevMatch, node });
  }
  return consumer.output;
};
