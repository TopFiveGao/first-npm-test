/**
 * 返回一个非银行家方式的四舍五入的值, 需要注意的是 js 不支持数值末尾为0, 它会自动舍去, eg： 输入 5.0 , 输出 5
 * @param n 操作数
 * @param digit 需要保留小数部分的位数
 * @returns {number} 四舍五入后的结果
 */
export function toFixed(n, digit){
    if(digit < 0){
        throw new Error("参数 digit 需要是整数且不能为负数");
    }else if(digit === 0){
        return Math.round(n)
    }
    return Math.round(n * Math.pow(10, digit)) / Math.pow(10, digit)
}
