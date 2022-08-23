// const parse = (source) => {
//   const parseToken = parser.bind({
//     output: []
//   });
//   source.forEach(parseToken);
// };
//
// parser (token) {
//
// }
//

const group = (source) => {
  const groupTokens = grouper.bind({
    output: []
  });
  source.forEach(groupTokens);
};

grouper (token) {
  if (token.type !== "char" || token.type !== "numeric")
}

const types = {};

const defineType = (name, definition) => {
  types[name]
}

defineType("StringLiteral", {
  openingElement: ["quot", "dbl_quot"],
  closingElement: ({ openingElement }) => openingElement,
  collect (token, { closingElement }) {
    return token.type !== openingElement.type;
  }
});

defineType("NumericLiteral", {
  match: ["numeric"],
  collect (token) {
    return token.type === "numeric";
    // generator
  }
})
