var fs = require('fs');
var babel = require('@babel/core');
var jsx = require('./jsx');
var moriscript = require('./ms');

var fileName = process.argv[2];

// console.log(Object.keys(babel));

fs.readFile(fileName, function(err, data) {
  if(err) throw err;

  var src = data.toString();

  var out = babel.transform(src, {
    plugins: ["@babel/plugin-transform-react-jsx", moriscript]
  });

  console.log(out.code);
});
