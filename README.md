# util

建立一个自用的 js 工具库，当做沉淀技术的一种方式。

目前提供的方法有： toFixed 用来获取正常的四舍五入的值，isExistedFile 判断文件是否存在等等。

## 开始
兼容两种模块导入规范，兼容 ts 类型。
```javascript
import { toFixed } from '@frontgao/test'

let result = toFixed( 2.346,  1) // result: 2.3
    result = toFixed( 2.346,  2) // result: 2.35
    result = toFixed( 5.00,  1)  // result: 5 预期应为 5.0 , 但js数值默认会省略无效小数0 。 
```
## npm registry 的兼容需求
第三方库要兼容多种规范，例如支持 es module 的 import 语法，和传统的导包 require 语法，

查询之后，在官网给出的方案如下， 相当于写了两套代码，但如果在同时支持 esm 和 cmd 规范的环境，

两种方式引入这个库的实例对象应该是不同的，网上说需要写个 shim 来处理成单例。

*  package.json
> 发布支持 require 和 import 两种规范的 js 库
```json
{
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
```
> 发布支持 require 和 import 两种规范且兼容 ts 的库

```ts
// index.d.ts
declare module "@frontgao/util" {
    /**
     * @param {number} n
     * @param {number} digits
     */
    export function toFixed(n: number, digits: number): number;
}
```

```json
{
  "exports": {
    "require": "./dist/index.cjs",
    "import": {
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```
## npm publish

npm publish 如果报错没权限或者什么 private 的话，在确认登录正常，包名无冲突的情况下，那就要更换命令了！

```sh
# 默认是发私有仓库！！！而普通用户是没有权限的，除非你充值。所以对普通用户来说，该命令是会报错的，尽管这命令是正确的。
npm publish

# 这个才是普通用户正常的发布仓库的命令，不会报错 403 402 啥的
npm publish --access public
npm publish access=public
```

## npm scripts 钩子
package.json 中的 script 字段，可以定义一些钩子，在执行 npm 命令的时候，会自动执行这些钩子。比如 pre 和 post 。
```json
{
  "scripts": {
    "predev": "node beforeSome.js",
    "dev": "node some.js",
    "postdev": "node afterDev.js"
  }
}
```
在写项目时需要把一些 api 数据接口地址记录到一个可维护的对象上，接口数量多的话，手动写就挺麻烦的，于是想用程序按照写好的一个数组自动生成对象并写入文件中为项目所用。
本想保持 ts 项目的一致性用 ts 写的，但是没有直接的 ts 执行环境，最后还是用 nodejs 去实现。
又不想改默认的vite项目构建启动命令，于是想到了 npm scripts 的钩子函数，一查就有 pre 和 post 这两个钩子。
* 使用注意事项

  1. 直接在想要添加钩子的脚本命令的键上添加 pre 或 post 即可，不能为了美观用'pre-dev'这种写法，'predev' 才能自动运行。
  2. pre post 钩子函数执行的条件是上一条命令执行成功并返回结果，而一般前端项目启动后终端会一直处于监听状态， 是没有返回的，所以一般是走不到 postXX 钩子函数的。

* 如果你写了 postXX ，却发现并没有执行该脚本时，不要怀疑是不是 post钩子写错了，那是因为上一条命令运行后使端口处于监听状态，没有结束，所以不会执行 postXX 钩子函数。

## fs 模块

摸索几天之后，大概摸清了几个常用的方法。
* 判断文件是否存在：**fs.access** 或者 **fs.open** (不恰当，但也能用)
* 读取文件： **fs.createReadStream** 或者 **fs.readFile** (大文件不推荐，操作简单粗暴，把整个文件数据全部读取到内存中后，再进行数据操作)
* 写入文件： **fs.createWriteStream** 或者 **fs.writeFile** (大文件不推荐，操作简单粗暴，原因同上)
> 当我想封装一个返回值为 boolean 类型的函数，用于告诉我文件是否复制成功时，因为 io 操作
> 是异步的，所以想用 Promise<boolean> 实现，可是简单的 await readStream.pipe(writeStream) 
> 提示 await 不起作用，原来根据 Promise A+ 规范 await 后面只能跟 Promise 对象（常量会自动转化）,
> 于是想用 try catch 捕获异常，这下发现 stream 流是不能被 try catch 捕获的。那咋整，gpt 知道，
> 它是利用 stream 自身的异步回调封装成 promise 。
```js
// 推荐使用 fs 的 promises 模块，不用考虑传统 fs 的回调报错问题
// import fp from 'node:fs/promises'
import fs from 'node:fs'

// 读文件, 也可用 fs.promises.readFile promise 风格
fs.readFile('foo.txt', null, (err, data) => {
  console.log(data)
})
// 写文件
fs.writeFile('bar.txt', 'hello world', (err) => {
  err? console.log(err) : void ''
})
// 读取流
const readStream = fs.createReadStream('foo.txt', {
  highWaterMark: 1024 * 1024, // 默认 64k, 一个字节代表 8 个二进制位，1024 代表 1024 个二进制位，即 1kb
})
// 写入流
const writeStream = fs.createWriteStream('bar.txt', {
  highWaterMark: 1024 * 1024, // 这里一定要比读取的大，否则造成数据丢失
  flags: 'w',                 // 默认是 w , 每次重新写入, 'a' 为追加
})

readStream.on('data', data => {
  // 只发现了用 on 这套回调读取数据
  writeStream.write(data)
})
readStream.on('end', () => {
  // 读取流读完了会触发 end 事件 , 一般在该事件中做关闭流的事件, 
  writeStream.end() // 写入流需要手动结束流然后再关闭
  writeStream.close()
  readStream.close()
})
// 读取流和写入流弄得差不多了，结果它来个 pipe 函数可以直接复制。。。类似于python的 with open 文件操作。
const rs = fs.createReadStream('file.html')
const ws = fs.createWriteStream('new.html')
const thenWs = rs.pipe(ws) // ws === thenWs , 之所以没有链式调用是为了看清楚 pipe 的返回值就是写入流，写入中断后，需要手动关闭写入流
```



Copyright (c) 2023-present, TopFiveGao