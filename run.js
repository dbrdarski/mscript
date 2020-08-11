var fs = require('fs');
var babel = require('@babel/core');
// var jsx = require('./jsx');
// const jsx = require('babel-plugin-transform-jsx')
var expressions = require('./transforms/reactive-expressions');
var jsx = require('./transforms/jsx');

var fileName = process.argv[2];

// console.log(Object.keys(babel));

fs.readFile(`${fileName}.mori.js`, function(err, data) {
  if(err) throw err;

  var src = data.toString();

  var out = babel.transform(src, {
    plugins: [
      [jsx, {
        function: 'h ',
        module: 'mx',
        useVariables: true
      }],
      expressions
    ]
  });

  fs.writeFile(`${fileName}.js`, out.code, () => { console.log(out.code); });
});
