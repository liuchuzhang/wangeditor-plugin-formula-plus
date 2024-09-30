/**
 * @description render elem
 * @author wangfupeng
 */

import { jsx, VNode } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor'
import { FormulaElement } from './custom-types'
import { katexRender } from '../utils/util'

function renderFormula(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 当前节点是否选中
  const selected = DomEditor.isNodeSelected(editor, elem)

  // 构建 formula vnode
  const { value = '' } = elem as FormulaElement
  const formulaVnode = <w-e-formula-card data-value={value} />

  const vnode = (
    <div
      contentEditable={false}
      style={{
        display: 'inline-block', // inline
        marginLeft: '3px',
        marginRight: '3px',
        border: selected // 选中/不选中，样式不一样
          ? '2px solid var(--w-e-textarea-selected-border-color)' // wangEditor 提供了 css var https://www.wangeditor.com/v5/theme.html
          : '2px solid transparent',
        borderRadius: '3px',
        padding: '3px 3px',
      }}
    >
      {formulaVnode}
    </div>
  )

  setTimeout(() => {
    if (!selected && vnode.elm) {
      katexRender(value, vnode.elm)
    }
  })

  return vnode
}

const conf = {
  type: 'formula', // 节点 type ，重要！！！
  renderElem: renderFormula,
}

export default conf
