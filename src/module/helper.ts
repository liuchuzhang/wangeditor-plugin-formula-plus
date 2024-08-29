import { DomEditor, IDomEditor } from '@wangeditor/editor'
import $, { DOMElement } from '../utils/dom'
import { Editor } from 'slate'

export function isMenuDisabled(editor: IDomEditor, mark?: string): boolean {
  if (editor.selection == null) return true

  const [match] = Editor.nodes(editor, {
    match: n => {
      const type = DomEditor.getNodeType(n)

      if (type === 'pre') return true // 代码块
      if (Editor.isVoid(editor, n)) return true // void node

      return false
    },
    universal: true,
  })

  // 命中，则禁用
  if (match) return true
  return false
}

export const stringToHtml = (s: string): string => {
  return s
    .replace(/\n$/g, '_65a5ba9e52a3761bd68eb531e9794ae12c1d34c167f071a6b239c855b5cf57b2') //最后一个换行符
    .replace(/\n/g, '_dafd41284316e72de3a0b07bd1262cd142151708353024244238eec3699e22ae') //普通换行符
    .replace(/\s/g, '_e613de3e0d3b707ade3d6a289abbab35c67d4476dc12211865d70a493d7e144c') //空格
    .replace(
      /(\+|-|\*|\/|=|>|<|!|\^|\(|\)|%)/g,
      '<span style="color: SeaGreen;" class="hl">$1</span>'
    )
    .replace(/(\\{2})/g, '<span style="color: orange;" class="hl">$1</span>')
    .replace(/(\\[a-zA-Z]+)/g, '<span style="color: #008de9;" class="hl">$1</span>')
    .replace(
      /<span style="color: #008de9;" class="hl">(\\begin|\\end)<\/span>/g,
      '<span style="color:orange;" class="hl">$1</span>'
    )
    .replace(/([{}])/g, '<span style="color: #608b4e;" class="hl">$1</span>')
    .replace(/_dafd41284316e72de3a0b07bd1262cd142151708353024244238eec3699e22ae/g, '<br>')
    .replace(/_e613de3e0d3b707ade3d6a289abbab35c67d4476dc12211865d70a493d7e144c/g, '&nbsp;')
    .replace(
      /_65a5ba9e52a3761bd68eb531e9794ae12c1d34c167f071a6b239c855b5cf57b2/g,
      "<br><span style='color:rgba(0,0,0,0);'>_</span>"
    )
}

/**
 * 生成 modal textarea elems
 * @param labelText label text
 * @param textareaId input dom id
 * @param placeholder input placeholder
 * @returns [$container, $textarea, $textareaBox]
 */
export function genModalTextareaElems(
  labelText: string,
  textareaId: string,
  placeholder?: string
): DOMElement[] {
  const $container = $('<div class="babel-container"></div>')
  $container.append(`<div class="w-e-formula-modal-label">${labelText}</div>`)
  const $textareaBox = $('<div class="w-e-formula-modal-textarea-box"></div>')
  const $textarea = $(
    `<textarea class="w-e-formula-modal-textarea" type="text" id="${textareaId}" placeholder="${
      placeholder || ''
    }"></textarea>`
  )
  const $textareaContent = $(
    '<div class="w-e-formula-modal-textarea w-e-formula-modal-textarea--content"></div>'
  )
  $textareaBox.append($textarea)
  $textareaBox.append($textareaContent)
  $container.append($textareaBox)

  return [$container[0], $textarea[0], $textareaContent[0]]
}
