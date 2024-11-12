/**
 * @description render elem
 * @author wangfupeng
 */

import { h, VNode } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor'
import { FormulaElement } from './custom-types'
import { formulaRenderWithEditor } from './helper'

function renderFormula(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 当前节点是否选中
  const selected = DomEditor.isNodeSelected(editor, elem)

  // 构建 formula vnode
  const { value = '' } = elem as FormulaElement
  const formulaVnode = h('span', {
    hook: {
      update(vnode) {
        formulaRenderWithEditor(editor, value, vnode.elm as HTMLElement)
      },
    },
  })

  const vnode = h(
    'div',
    {
      props: {
        contentEditable: false, // 不可编辑
      },
      style: {
        display: 'inline-block', // inline
        marginLeft: '3px',
        marginRight: '3px',
        border: selected // 选中/不选中，样式不一样
          ? '2px solid var(--w-e-textarea-selected-border-color)' // wangEditor 提供了 css var https://www.wangeditor.com/v5/theme.html
          : '2px solid transparent',
        borderRadius: '3px',
        padding: '3px 3px',
      },
    },
    [formulaVnode]
  )

  return vnode
}

const conf = {
  type: 'formula', // 节点 type ，重要！！！
  renderElem: renderFormula,
}

export default conf
