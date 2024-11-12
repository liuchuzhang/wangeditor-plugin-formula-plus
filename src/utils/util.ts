/**
 * @description 工具函数
 * @author wangfupeng
 */

import { nanoid } from 'nanoid'
import katex, { KatexOptions } from 'katex'

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
const defaultKatexOptions = {
  throwOnError: false,
}
export const katexRender = (str: string, elem: HTMLElement, options?: KatexOptions) => {
  console.log(str, elem)
  katex.render(`\\displaystyle ${str || ''}`, elem, { ...defaultKatexOptions, ...options })
}

export const formulaRender = (
  value: string,
  el: HTMLElement,
  options: {
    katexOptions?: KatexOptions
    katexRender?: (value: string, el: HTMLElement) => void
  }
) => {
  if (options.katexRender) {
    options.katexRender(value, el)
  } else {
    katexRender(value, el, options.katexOptions)
  }
}
