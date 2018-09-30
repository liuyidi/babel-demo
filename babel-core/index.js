var babel = require('babel-core')
var path = require('path')
var result = babel.transformFileSync(path.resolve(__dirname) + '/test.js', {

})
console.log(result) // { code , map, ast }