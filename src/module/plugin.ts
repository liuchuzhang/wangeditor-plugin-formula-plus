/**
 * @description formula plugin
 * @author wangfupeng
 */

import { DomEditor, IDomEditor } from '@wangeditor/editor'
import Hotkey from './hotkey'

function withFormula<T extends IDomEditor>(editor: T) {
  const { isInline, isVoid } = editor
  const newEditor = editor

  // 重写 isInline
  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'formula') {
      return true
    }

    return isInline(elem)
  }

  // 重写 isVoid
  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'formula') {
      return true
    }

    return isVoid(elem)
  }

  setTimeout(() => {
    const { $textArea } = DomEditor.getTextarea(newEditor)
    if ($textArea == null) return

    $textArea.on('keydown', e => {
      const event = e as KeyboardEvent

      if (Hotkey.isFormula(event)) {
        event.preventDefault()
        const selection = editor.getSelectionText()
        if (!selection) return
        editor.restoreSelection()
        const formulaElem = {
          type: 'formula',
          value: selection,
          children: [{ text: '' }],
        }
        editor.insertNode(formulaElem)
      }
    })
  })

  return newEditor
}

export default withFormula
