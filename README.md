# babel-demo
学习babel的demo (babel 6.x)

## 一、babel中的包

### babel-core
- babel的编译器，核心API都在里面，比如transform，把js代码抽象成ast（抽象语法树）

```
var babel = require('babel-core')
var path = require('path')
var result = babel.transformFileSync(path.resolve(__dirname) + '/test.js', {
  presets: ['env'],
  plugins: ['transform-runtime']
})
```

### babel-cli
- 通过命令行操作babel

- babel-node babel-cli下面的一个命令行

```
 node_modules/.bin/babel-node --presets react test.js
```

### babel-register
- babel-node 可以通过它编译代码，可以了解到，它其实就是一个编译器。我们同样可以在代码中引入它 require('babel-register')，并通过 node 执行我们的代码。
- 它的原理是通过改写 node 本身的 require，添加钩子，然后在 require 其他模块的时候，就会触发 babel 编译。也就是你引入require('babel-register')的文件代码，是不会被编译的。只有通过 require 引入的其他代码才会。我们是不是可以理解，babel-node 就是在内存中写入一个临时文件，在顶部引入 babel-register，然后再引入我们的脚本或者代码？

举个栗子，还是 node 中执行 jsx，要通过 babel 编译。我们可以把 jsx 的代码 a.js 编译完输出到一个 b.js，然后 node b.js 也是可以执行的。但是太麻烦，不利于开发。让我们看一下通过 register 怎么用：
```
// register.js 引入 babel-register，并配置。然后引入要执行代码的入口文件
require('babel-register')({ presets: ['react'] });
require('./test')
// test.js 这个文件是 jsx...
const React = require('react');
const elements = [1, 2, 3].map((item) => {
  return (
    <div>{item}</div>
  )
});
console.log(elements);
// 执行
$ node register.js
```

### babel-polyfill
- 同样引入了core-js和regenerator，模拟一个完整的ES2015+的环境，旨在用于应用程序而不是库/工具。并且使用babel-node时，这个polyfill会自动加载
- 它是以重载全局变量 （E.g: Promise）,还有原型和类上的静态方法（E.g：Array.prototype.reduce/Array.form），从而达到对 es6+ 的支持。
- 不同于 babel-runtime 的是，babel-polyfill 是一次性引入你的项目中去的

### babel-loader 针对webpack的loader

## 二、plugins系列
> babel编译的三步：
- （解析）parser：通过 babylon 解析成 AST。
- （转换）transform[s]：All the plugins/presets ，进一步的做语法等自定义的转译，仍然是 AST。
- （生成）generator： 最后通过 babel-generator 生成 output string。

- const babel = code => code;

所以plugins是在第二步加强转译的，

### babel-plugin-transform-runtime (使用--save-dev，开发依赖)
-  是为了方便使用 babel-runtime 的，它会分析我们的 ast 中，是否有引用 babel-rumtime 中的垫片（通过映射关系），如果有，就会在当前模块顶部插入我们需要的垫片。

```
{
  "plugins": [
    ["tranform-runtime", {
      "helpers": true,     // helpers 设为 false，就相当于没有启用 babel-plugin-external-helpers 的效果
      "polyfill": true,    // false表示不需要babel-runtime中的core-js 里面的 polyfill
      "regenerator": true,
      "moduleName": "babel-runtime"  // moduleName 的话，就是用到的库，你可以把 babel-runtime 换成其他类似的。
    }]
  ]
}
```


### babel-runtime (使用--save，生产依赖)
- babel-core 是对语法进行 transform 的，但是它不支持 build-ints（Eg: promise，Set，Map），prototype function（Eg: array.reduce,string.trim），class static function （Eg：Array.form，Object.assgin），regenerator （Eg：generator，async）等等拓展的编译。所以才要用到 core-js 和 regenerator。
- babel-runtime 是单纯的实现了 core-js 和 regenerator 引入和导出

#### core-js
> core-js 是用于 JavaScript 的组合式标准化库，它包含 es5 （e.g: object.freeze）, es6的 promise，symbols, collections, iterators, typed arrays， es7+提案等等的 polyfills 实现。也就是说，它几乎包含了所有 JavaScript 最新标准的垫片。

#### regenerator
- 主要就是实现了 generator/yeild， async/await。

#### helpers

## 三、transform-runtime 对比 babel-polyfill
- babel-polyfill  
  - 全局使用，引用一次，方便快捷
  - 污染全局方法， 会增大体积
  - 开发大的应用，建议使用

- transform-runtime 是利用 plugin 自动识别并替换代码中的新特性，你不需要再引入，只需要装好 babel-runtime 和 配好 plugin 就可以了。
  - 按需替换，需要哪个，就引入哪个polyfill，体积小很多
  - 不会污染原生对象，
  - 适合开发工具包
  - 缺点！！！
  - 引入问题： 关于 babel-runtime 为什么是 dependencies 依赖。它只是一个集中了 polyfill 的 library，对应需要的 polyfill 都是要引入项目中，并跟项目代码一起打包的。不过它不会都引入，你用了哪个，plugin 就给你 require 哪个

## 四、preset系列
> presets 就是 plugins 的组合，你也可以理解为是套餐，主要有

- env
- es2015
- react
- lastet
- stage-x

### Stage-x
- Stage 0

### babel-preset-env
- 在没有任何配置选项下，babel-preset-env 与 babel-preset-latest （或者babel-preset-es2015，babel-preset-es2016和babel-preset-es2017一起）的行为完全相同
- 它能根据当前的运行环境，自动确定你需要的 plugins 和 polyfills。通过各个 es标准 feature 在不同浏览器以及 node 版本的支持情况，再去维护一个 feature 跟 plugins 之间的映射关系，最终确定需要的 plugins。

```
{
  "presets": ["env"]
}
```
- 也可以仅仅配置项目所支持浏览器所需的polyfill和transform。只编译所需的代码会使你的代码包更小。
```
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"],
        "node": "current"
      },
      "modules": true,  //设置ES6 模块转译的模块格式 默认是 commonjs
      "debug": true, // debug，编译的时候 console
      "useBuiltIns": false, // 是否开启自动支持 polyfill
      "include": [], // 总是启用哪些 plugins
      "exclude": []  // 强制不启用哪些 plugins，用来防止某些插件被启用
    }]
  ],
  plugins: [
    "transform-react-jsx"   // 支持jsx
  ]
}
```
- node环境 (可以使用"node": "current" 来包含用于运行Babel的Node.js最新版所必需的polyfills和transforms)
```
{
  "presets": [
    ["env", {
      "targets": {
        "node": "6.10"
      }
    }]
  ]
}
```
- 开启debug后，编译结果会得到使用的 targets，plugins，polyfill 等信息

- useBuiltIns 
> env 会自动根据我们的运行环境，去判断需要什么样的 polyfill，而且，打包后的代码体积也会大大减小，但是这一切都在使用 useBuiltIns，而且需要你安装 babel-polyfill，并 import。它会启用一个插件，替换你的import 'babel-polyfill'，不是整个引入了，而是根据你配置的环境和个人需要单独的引入 polyfill。


### babel-preset-react


## 五、使用`.babelrc`配置
```
{
  "presets": [
    "env"
  ],
  "plugins": [
    ["transform-runtime", {
      "helpers": true,
      "polyfill": true,
      "regenerator": true,
      "moduleName": "babel-runtime"
    }]
  ]
}
```