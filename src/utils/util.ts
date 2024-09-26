/**
 * @description 工具函数
 * @author wangfupeng
 */

import { nanoid } from 'nanoid'
import katex from 'katex'

/**
 * 获取随机数字符串
 * @param prefix 前缀
 * @returns 随机数字符串
 */
export function genRandomStr(prefix: string = 'r'): string {
  return `${prefix}-${nanoid()}`
}

// export function replaceSymbols(str: string) {
//   return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
// }

export const katexRender = (
  str,
  elem,
  options = {
    throwOnError: false,
  }
) => {
  katex.render(`\\displaystyle ${str || ''}`, elem, options)
}
