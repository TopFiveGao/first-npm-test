# first-npm-test

test use npm to publish a package. This package export a function to help us get a expect number.

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
Copyright (c) 2023-present, TopFiveGao