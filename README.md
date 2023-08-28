# putil

该 package 用来测试向 npmjs 仓库发送自己写的库是否能正常使用。

提供了一个方法，用来获取正常的四舍五入的值。

## 开始
暂时采用的是 esm 的 import 模块导入方式, 未兼容 require 的方式引入。
```javascript
import { toFixed } from 'first-npm-test'

let result = toFixed( 2.346,  1) // result: 2.3
    result = toFixed( 2.346,  2) // result: 2.35
    result = toFixed( 5.00,  1)  // result: 5 预期应为 5.0 , 但js数值默认会省略无效小数0 。 
```
## 发布 npm 包的常见需求
第三方库要兼容多种规范，例如支持 es module 的 import 语法，和传统的导包 require 语法，

查询之后，在官网给出的方案如下， 相当于写了两套代码，但如果在同时支持 esm 和 cmd 规范的环境，

两种方式引入这个库的实例对象应该是不同的，网上说需要写个 shim 来处理成单例。

*  package.json
```json
{
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
```


Copyright (c) 2023-present, TopFiveGao