# util

建立一个自用的 js 工具库，当做沉淀技术的一种方式。

目前提供的方法有： toFixed 用来获取正常的四舍五入的值，等等。

## 开始
兼容两种模块导入规范，兼容 ts 类型。
```javascript
import { toFixed } from '@frontgao/test'

let result = toFixed( 2.346,  1) // result: 2.3
    result = toFixed( 2.346,  2) // result: 2.35
    result = toFixed( 5.00,  1)  // result: 5 预期应为 5.0 , 但js数值默认会省略无效小数0 。 
```
## 发布 npm 包的常见需求
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
## npm publish 的变化

npm publish 如果报错没权限或者什么 private 的话，在确认登录正常，包名无冲突的情况下，那就要更换命令了！

```sh
# 默认是发私有仓库！！！
npm publish

# 这个才是正常的发布公共仓库，不会报错 403 402 啥的
npm publish --access public
npm publish access=public
```
Copyright (c) 2023-present, TopFiveGao