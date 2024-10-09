import { IButtonMenu, IDomEditor, t } from '@wangeditor/editor'
import { SIGMA_SVG } from '../../constants/icon-svg'
import { isMenuDisabled } from '../helper'
import { FormulaElement } from '../custom-types'

class TextToFormula implements IButtonMenu {
  readonly title = t('转换成公式')
  readonly iconSvg = SIGMA_SVG
  readonly tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    return isMenuDisabled(editor)
  }

  exec(editor: IDomEditor, value: string | boolean) {
    const selection = editor.getSelectionText()
    editor.restoreSelection()
    const formulaElem: FormulaElement = {
      type: 'formula',
      value: selection,
      children: [{ text: '' }], // void node 需要有一个空 text
    }
    editor.insertNode(formulaElem)
  }
}

export default TextToFormula
