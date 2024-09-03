import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import functions from '../../json/functions.json'
import katex from 'katex'
import classNames from 'classnames'
import { useClickAway, useUpdateEffect } from 'ahooks'
import ReactDOM from 'react-dom/client'
import defaultFunctions from './defaultFunctions'
import './index.less'

const functionMap = functions.reduce((obj, item) => {
  obj[item.symbol] = item
  return obj
}, {})

interface AutoCompleteProps {
  onClose: () => void
  onSelect: (symbol: string) => void
  initialStyle: React.CSSProperties
}

type AutoCompleteRef = {
  up: () => void
  down: () => void
  enter: () => void
  setValue: (value: string) => void
  setStyle: (style: React.CSSProperties) => void
  getList: (value: string) => any[]
}

export const AutoComplete = React.forwardRef(
  ({ initialStyle, onSelect, onClose }: AutoCompleteProps, ref) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState('')
    const [style, setStyle] = useState<React.CSSProperties>(initialStyle)

    const getList: AutoCompleteRef['getList'] = (value: string) => {
      if (!value) {
        return defaultFunctions.map(item => functionMap[item]).filter(Boolean)
      }
      return functions.filter(item => item.symbol.includes(value))
    }

    const list = useMemo(() => getList(value), [value])

    const [activeIndex, setActiveIndex] = useState<number>(0)

    useImperativeHandle<any, AutoCompleteRef>(ref, () => ({
      up() {
        setActiveIndex(Math.max(0, activeIndex - 1))
      },
      down() {
        setActiveIndex(Math.min(list.length - 1, activeIndex + 1))
      },
      enter() {
        const active = list[activeIndex]
        if (active) {
          onSelect(active.template)
        }
      },
      setValue: newValue => {
        if (!newValue) {
          return onClose()
        }
        setValue(newValue)
      },
      setStyle,
      getList,
    }))

    useUpdateEffect(() => {
      if (!list.length) {
        return onClose()
      }
      divRef.current?.querySelectorAll('.w-e-autocomplete-item-render').forEach(e => {
        katex.render(e.getAttribute('data-value') || '', e as any, {
          throwOnError: false,
        })
      })
    }, [list])

    useClickAway(() => {
      onClose()
    }, divRef)

    return (
      <div ref={divRef} className="w-e-autocomplete" style={style}>
        {list.map((item, index) => {
          const matchIndex = item.symbol.toLowerCase().indexOf(value)
          return (
            <div
              key={index}
              className={classNames('w-e-autocomplete-item', {
                'w-e-autocomplete-item--active': activeIndex === index,
              })}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => onSelect(item.template)}
            >
              <div className="w-e-autocomplete-item-symbol">
                {item.symbol.substring(0, matchIndex)}
                <span className="w-e-autocomplete-item-match">
                  {item.symbol.substring(matchIndex, matchIndex + value.length)}
                </span>
                {item.symbol.substring(matchIndex + value.length)}
              </div>
              <div className="w-e-autocomplete-item-render" data-value={item.rendered} />
            </div>
          )
        })}
      </div>
    )
  }
)

export default {
  show(input, target) {
    return new Promise<string>((resolve, reject) => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      const componentRef = React.createRef<AutoCompleteRef>()
      const getPosition = () => {
        const rect = target.getBoundingClientRect()
        const position = {
          left: `${rect.x + 5}px`,
          top: `${rect.y + rect.height}px`,
        }
        return position
      }
      const initialStyle = getPosition()

      input.addEventListener?.('keydown', e => {
        if (e.key === 'ArrowDown') {
          // 向下箭头
          componentRef.current?.down()
        } else if (e.key === 'ArrowUp') {
          // 向上箭头
          componentRef.current?.up()
        } else if (e.key === 'Enter') {
          // 回车键
          componentRef.current?.enter()
          if (document.body.contains(div)) {
            e.preventDefault()
          }
        }
      })

      input.addEventListener?.('input', e => {
        setTimeout(() => {
          componentRef.current.setStyle?.(getPosition())
          componentRef.current?.setValue(e.target.getAttribute('data-cursor-value').slice(0))
        })
      })

      const onCancel = () => {
        reject()
        setTimeout(() => {
          if (document.body.contains(div)) {
            document.body.removeChild(div)
          }
        }, 100)
      }

      return ReactDOM.createRoot(div).render(
        <AutoComplete
          ref={componentRef}
          initialStyle={initialStyle}
          onSelect={template => {
            resolve(template)
            onCancel()
          }}
          onClose={onCancel}
        />
      )
    })
  },
}
