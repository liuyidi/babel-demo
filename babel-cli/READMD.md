## 编译文件

```
npx babel babel-cli/script.js babel-cli/dist.js
// 输出结果到单个文件，使用 --out-file 或 -o。
npx babel babel-cli/script.js --out-file babel-cli/dist.js
// 每次修改后编译文件，使用--watch或-w选项
npx babel script.js --watch --out-file script-compiled.js
// 使用source map文件可以使用 --source-maps或者-s， 可以加入inline
npx babel script.js --out-file script-compiled.js --source-maps inline
```

## 编译目录
使用`--out-dir`或`-d`,不会覆盖`lib`中的任何其他文件
```
npx babel src --out-dir lib
```
编译整个`src`到单个文件
```
npx babel src --out-dir dist.js
```

## 忽略，复制，传输文件
`--ignore`
`--copy-files`
`xx.js < xxx.js`


## 使用插件
--plugins

## 使用Presets
--presets
```
npx babel babel-cli/script.js --out-file babel-cli/dist.js --
```

## 忽略.babelrc文件
--no-babelrc

