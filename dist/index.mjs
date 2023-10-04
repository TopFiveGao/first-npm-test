import fs from 'node:fs'


/**
 * 返回一个非银行家方式的四舍五入的值, 需要注意的是 js 不支持数值末尾为0, 它会自动舍去, eg： 输入 5.0 , 输出 5
 * @param n 操作数
 * @param digit 需要保留小数部分的位数
 * @returns {number} 四舍五入后的结果
 */
export function toFixed(n, digit) {
    if (digit < 0) {
        throw new Error("参数 digit 需要是整数且不能为负数");
    } else if (digit === 0) {
        return Math.round(n)
    }
    return Math.round(n * Math.pow(10, digit)) / Math.pow(10, digit)
}

/**
 * 判断文件是否存在
 * @deprecated 该方法已废弃，请使用官方的 fs.promises.access ，promise也能自动catch报错
 * @param fileName 文件路径：绝对路径或相对路径
 * @return {Promise<boolean>}文件是否存在
 */
export function isExistedFile(fileName) {
    return new Promise((resolve) => {
        fs.access(fileName, fs.constants.F_OK, (err) => {
            err ? resolve(false) : resolve(true)
        })
    })
}

/**
 * 根据传入的路径字符串，封装 fs.access 接口，返回文件是否存在。
 * @param sourceFileName 待复制的文件名
 * @param targetFileName 目标文件名
 * @returns { Promise<boolean> } 是否复制成功
 */
export function copyFile(sourceFileName, targetFileName) {
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