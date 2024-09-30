/**
 * @description formula render-elem test
 * @author wangfupeng
 */

import createEditor from '../utils/create-editor'
import renderElemConf from '../../src/module/render-elem'
import { FormulaElement } from '../../src/module/custom-types'

describe('formula render-elem', () => {
  const editor = createEditor()
  const formulaElem: FormulaElement = { type: 'formula', value: '123', children: [{ text: '' }] }

  it('type', () => {
    expect(renderElemConf.type).toBe('formula')
  })

  it('render elem', () => {
    const containerVnode = renderElemConf.renderElem(formulaElem, null, editor) as any
    expect(containerVnode.sel).toBe('div')
    expect(containerVnode.data.contentEditable).toBe(false)

    const formulaVnode = containerVnode.children[0]
    expect(formulaVnode.sel).toBe('w-e-formula-card')
    expect(formulaVnode.data['data-value']).toBe('123')
  })
})
