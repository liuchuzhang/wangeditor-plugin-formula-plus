/**
 * @description insert formula menu
 * @author wangfupeng
 */

import { IModalMenu } from '@wangeditor/editor'
import {
  DomEditor,
  IDomEditor,
  SlateNode,
  SlateRange,
  t,
  genModalButtonElems,
} from '@wangeditor/editor'
import { SIGMA_SVG } from '../../constants/icon-svg'
import $, { Dom7Array, DOMElement } from '../../utils/dom'
import { genRandomStr } from '../../utils/util'
import { FormulaElement } from '../custom-types'
import { isMenuDisabled, stringToHtml, genModalTextareaElems } from '../helper'

/**
 * 生成唯一的 DOM ID
 */
function genDomID(): string {
  return genRandomStr('w-e-insert-formula')
}

class InsertFormulaMenu implements IModalMenu {
  readonly title = '插入公式'
  readonly iconSvg = SIGMA_SVG
  readonly tag = 'button'
  readonly showModal = true // 点击 button 时显示 modal
  readonly modalWidth = 500
  private $content: Dom7Array | null = null
  private readonly textareaId = genDomID()
  private readonly buttonId = genDomID()

  getValue(editor: IDomEditor): string | boolean {
    // 插入菜单，不需要 value
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false
  }

  exec(editor: IDomEditor, value: string | boolean) {
    // 点击菜单时，弹出 modal 之前，不需要执行其他代码
    // 此处空着即可
  }

  isDisabled(editor: IDomEditor): boolean {
    return isMenuDisabled(editor)
  }

  getModalPositionNode(editor: IDomEditor): SlateNode | null {
    return null // modal 依据选区定位
  }

  getModalContentElem(editor: IDomEditor): DOMElement {
    const { textareaId, buttonId } = this

    const { textareaContainerElem, setTextareaValue, renderElem } = genModalTextareaElems(
      '公式',
      textareaId,
      '使用 LateX 语法'
    )
    const [buttonContainerElem] = genModalButtonElems(buttonId, '确定')

    if (this.$content == null) {
      // 第一次渲染
      const $content = $('<div></div>')

      // 绑定事件（第一次渲染时绑定，不要重复绑定）
      $content.on('click', `#${buttonId}`, e => {
        e.preventDefault()
        const value = $content.find(`#${textareaId}`).val().trim()
        this.insertFormula(editor, value)
        editor.hidePanelOrModal() // 隐藏 modal
      })

      // 记录属性，重要
      this.$content = $content
    }

    const $content = this.$content
    $content.html('') // 先清空内容

    // append textarea and button
    $content.append(textareaContainerElem)
    $content.append(renderElem)
    $content.append(buttonContainerElem)

    // 设置 input val
    const value = this.getValue(editor) as string
    setTextareaValue(value)

    return $content[0]
  }

  private insertFormula(editor: IDomEditor, value: string) {
    if (!value) return

    // 还原选区
    editor.restoreSelection()

    if (this.isDisabled(editor)) return

    const formulaElem: FormulaElement = {
      type: 'formula',
      value,
      children: [{ text: '' }], // void node 需要有一个空 text
    }
    editor.insertNode(formulaElem)
  }
}

export default InsertFormulaMenu
