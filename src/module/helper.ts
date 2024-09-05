import { DomEditor, IDomEditor } from '@wangeditor/editor'
import $, { DOMElement } from '../utils/dom'
import { Editor } from 'slate'
import autoComplete from './components/AutoComplete'
import katex from 'katex'

const prefixClassName = (className: string) => `w-e-formula-${className}`

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

function insertText(textarea, text) {
  const currentPosition = textarea.selectionStart
  const startValue = textarea.value.substring(0, currentPosition)
  const startPos = Math.max(0, startValue.lastIndexOf('\\'))

  // 插入文本
  textarea.value =
    textarea.value.substring(0, startPos) + text + textarea.value.substring(currentPosition)

  // 计算新的光标位置并设置
  const index = text.lastIndexOf('{}')
  const newPos = index === -1 ? startPos + text.length : startPos + index + 1
  textarea.selectionStart = textarea.selectionEnd = newPos
}

/**
 * 生成 modal textarea elems
 * @param labelText label text
 * @param textareaId input dom id
 * @param placeholder input placeholder
 * @returns [$container, $textarea, $textareaBox]
 */
export function genModalTextareaElems(labelText: string, textareaId: string, placeholder?: string) {
  const $container = $('<div class="babel-container"></div>')
  $container.append(`<div class="${prefixClassName('modal-label')}">${labelText}</div>`)
  const $textareaBox = $(`<div class="${prefixClassName('modal-textarea-box')}"></div>`)
  const $textarea = $(
    `<textarea class="${prefixClassName(
      'modal-textarea'
    )}" type="text" id="${textareaId}" placeholder="${placeholder || ''}"></textarea>`
  )
  const $textareaContent = $(
    `<div class="${prefixClassName('modal-textarea')} ${prefixClassName(
      'modal-textarea--content'
    )}"></div>`
  )
  const $textareaCursor = $(
    `<div class="${prefixClassName('modal-textarea')} ${prefixClassName(
      'modal-textarea--cursor'
    )}"></div>`
  )
  const $render = $('<div class="w-e-formula-modal-latex"></div>')

  const renderLatex = (str: string) => {
    katex.render(str, $render[0] as any, {
      throwOnError: false,
    })
  }
  $textareaBox.append($textarea)
  $textareaBox.append($textareaContent)
  $textareaBox.append($textareaCursor)
  $container.append($textareaBox)

  let keyword = ''
  let isShowAutoComplete = false

  const cursorElem = document.createElement('span')
  cursorElem.textContent = '|'
  $textarea.on('input', (e: any) => {
    const cursorPosition = e.target.selectionStart

    const cursorBeforeText = ($textarea.val() || '').slice(0, cursorPosition)
    $textareaCursor[0].textContent = cursorBeforeText
    $textareaCursor.append(cursorElem)

    // 输入字符和删除单个字符
    if (['insertText', 'deleteContentBackward'].includes(e.inputType)) {
      if (e.data === '\\' && !isShowAutoComplete) {
        // 输入 \ 触发
        keyword = e.data
        isShowAutoComplete = true
        autoComplete
          .open($textarea[0], cursorElem)
          .then(symbol => {
            insertText($textarea[0], symbol)
            setTextareaValue($textarea.val())
            isShowAutoComplete = false
          })
          .catch(() => {
            isShowAutoComplete = false
          })
      } else {
        if (e.inputType === 'deleteContentBackward') {
          keyword = keyword.slice(0, -1)
        } else {
          if (keyword.startsWith('\\')) {
            keyword = `\\${cursorBeforeText.split('\\').pop()}`
          }
        }
      }
    } else {
      keyword = ''
    }

    const value = $textarea.val()
    const html = stringToHtml(value)
    $textareaContent[0].innerHTML = html
    renderLatex($textarea.val())
    $textarea[0].setAttribute('data-cursor-value', keyword)
  })

  $textarea.on('scroll', e => {
    $textareaContent[0].scrollLeft = (e.target as any).scrollLeft
    $textareaContent[0].scrollTop = (e.target as any).scrollTop
  })

  const setTextareaValue = (value: string) => {
    $textarea.val(value)
    renderLatex(value)
    const html = stringToHtml(value)
    $textareaContent[0].innerHTML = html
  }

  setTimeout(() => {
    $textarea.focus()
  })

  return { textareaContainerElem: $container[0], setTextareaValue, renderElem: $render[0] }
}
