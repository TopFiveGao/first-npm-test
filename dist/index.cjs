const fs = require("node:fs");
const {deepClone} = require("./index");

/**
 * 返回一个非银行家方式的四舍五入的值, 需要注意的是 js 不支持数值末尾为0, 它会自动舍去, eg： 输入 5.0 , 输出 5
 * @param n 操作数
 * @param digit 需要保留小数部分的位数
 * @returns {number} 四舍五入后的结果
 */
exports.toFixed = function (n, digit) {
    if (digit < 0) {
        throw new Error("参数 digit 需要是整数且不能为负数");
    } else if (digit === 0) {
        return Math.round(n)
    }
    return Math.round(n * Math.pow(10, digit)) / Math.pow(10, digit)
}
/**
 * 根据传入的路径字符串，封装 fs.access 接口，返回文件是否存在。
 * @deprecated 该方法已废弃，请使用官方的 fs.promises.access ，promise也能自动catch报错
 * @param fileName 文件 绝对路径 或 相对路径
 * @returns { Promise<boolean> } 文件是否存在
 */
exports.isExistedFile = function (fileName) {
    return new Promise((resolve) => {
        fs.access(fileName, fs.constants.F_OK, (err) => {
            err ? resolve(false) : resolve(true)
        })
    })
}
/**
 * 根据传入的待复制文件名和目标文件名，进行文件复制并返回文件复制是否成功。
 * @param sourceFileName 待复制的文件名
 * @param targetFileName 目标文件名
 * @returns { Promise<boolean> } 是否复制成功
 */
exports.copyFile = function (sourceFileName, targetFileName) {
    return new Promise((resolve) => {
        const rs = fs.createReadStream(sourceFileName)
        const ws = fs.createWriteStream(targetFileName)
        rs.pipe(ws)
        rs.on('error', err => {
            resolve(false)
        })
        ws.on('error', err => {
            resolve(false)
        })
        ws.on('finish', () => {
            resolve(true)
        })
    })
}
/**
 * 根据传入的js对象进行复制，返回一个新的深度克隆对象。
 * @param origin 原始对象
 * @returns { any } 新对象
 */
exports.deepClone = function (origin) {
    if (typeof origin !== 'object' || origin === null || origin === undefined) {
        return origin
    }
    const target = Array.isArray(origin)? []: {}
    Object.setPrototypeOf(target, Object.getPrototypeOf(origin))
    for (const key in origin) {
        if(Object.prototype.hasOwnProperty.call(origin, key)){
            target[key] = deepClone(origin[key])
        }
    }
    return target
}