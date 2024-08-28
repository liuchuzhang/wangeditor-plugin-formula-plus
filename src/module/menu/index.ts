/**
 * @description formula menu entry
 * @author wangfupeng
 */

import InsertFormulaMenu from './InsertFormula'
import EditFormulaMenu from './EditFormula'
import TextToFormula from './TextToFormula'

export const insertFormulaMenuConf = {
  key: 'insertFormula', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new InsertFormulaMenu()
  },
}

export const editFormulaMenuConf = {
  key: 'editFormula', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new EditFormulaMenu()
  },
}

export const textToFormulaMenuConf = {
  key: 'textToFormula', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new TextToFormula()
  },
}
