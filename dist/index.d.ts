/**
 * @param {number} n
 * @param {number} digits
 */
export function toFixed(n: number, digits: number): number;

/**
 * @param { string} fileName
 * @returns {Promise<boolean>}
 */
export function isExistedFile(fileName: string): Promise<boolean>

/**
 * @param { string} sourceFileName
 * @param { string} targetFileName
 * @returns {Promise<boolean>}
 */
export function copyFile(sourceFileName:string, targetFileName: string): Promise<boolean>