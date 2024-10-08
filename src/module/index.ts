/**
 * @description formula module entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/editor'
import withFormula from './plugin'
import renderElemConf from './render-elem'
import elemToHtmlConf from './elem-to-html'
import parseHtmlConf from './parse-elem-html'
import { insertFormulaMenuConf, editFormulaMenuConf, textToFormulaMenuConf } from './menu/index'
import 'katex/dist/katex.css'
import './index.less'

const module: Partial<IModuleConf> = {
  editorPlugin: withFormula,
  renderElems: [renderElemConf],
  elemsToHtml: [elemToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [insertFormulaMenuConf, editFormulaMenuConf, textToFormulaMenuConf],
}

export default module
