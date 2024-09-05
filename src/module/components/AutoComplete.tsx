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

    const filterValue = useMemo(
      () => (value.startsWith('\\') ? value.trim().slice(1) : value.trim()),
      [value]
    )

    const getList: AutoCompleteRef['getList'] = (value: string) => {
      if (!filterValue) {
        return defaultFunctions.map(item => functionMap[item]).filter(Boolean)
      }
      return functions
        .filter(item => item.symbol.includes(filterValue))
        .sort((a, b) => {
          return +b.symbol.startsWith(`\\${filterValue}`) - +a.symbol.startsWith(`\\${filterValue}`)
        })
    }

    const list = useMemo(() => getList(value), [value, filterValue])

    const [activeIndex, setActiveIndex] = useState<number>(0)

    const scrollToActive = index => {
      if (divRef.current) {
        const target = divRef.current.childNodes[index] as HTMLDivElement
        const { height } = divRef.current.getBoundingClientRect()
        const bottom = divRef.current.scrollTop + height
        const top = divRef.current.scrollTop

        if (target.offsetTop < top) {
          divRef.current.scrollTop = target.offsetTop
        } else if (target.offsetTop + target.offsetHeight + 2 > bottom) {
          divRef.current.scrollTop = target.offsetTop + target.offsetHeight - height
        }
      }
    }

    useImperativeHandle<any, AutoCompleteRef>(ref, () => ({
      up() {
        const index = activeIndex === 0 ? list.length - 1 : Math.max(0, activeIndex - 1)
        setActiveIndex(index)
        scrollToActive(index)
      },
      down() {
        const index =
          activeIndex === list.length - 1 ? 0 : Math.min(list.length - 1, activeIndex + 1)

        setActiveIndex(index)
        scrollToActive(index)
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
        setActiveIndex(0)
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
          const matchIndex = item.symbol.toLowerCase().indexOf(filterValue)
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
                  {item.symbol.substring(matchIndex, matchIndex + filterValue.length)}
                </span>
                {item.symbol.substring(matchIndex + filterValue.length)}
              </div>
              <div className="w-e-autocomplete-item-render" data-value={item.rendered} />
            </div>
          )
        })}
      </div>
    )
  }
)

const getElementOffset = element => {
  let offsetTop = 0
  let offsetLeft = 0

  while (element) {
    offsetTop += element.offsetTop
    offsetLeft += element.offsetLeft
    element = element.offsetParent
  }

  return {
    offsetTop,
    offsetLeft,
  }
}

export default {
  show(input, target) {
    return new Promise<string>((resolve, reject) => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      const componentRef = React.createRef<AutoCompleteRef>()
      const getPosition = () => {
        const { offsetLeft, offsetTop } = getElementOffset(target)
        const rect = target.getBoundingClientRect()
        const position = {
          left: `${offsetLeft + 5}px`,
          top: `${offsetTop + rect.height}px`,
        }
        return position
      }
      const initialStyle = getPosition()
      let cursorPosition = input.selectionStart

      const onCancel = () => {
        reject()
        setTimeout(() => {
          if (document.body.contains(div)) {
            document.body.removeChild(div)
          }
        }, 100)
      }

      input.addEventListener?.('keydown', e => {
        if (e.key === 'ArrowDown') {
          // 向下箭头
          componentRef.current?.down()
          if (document.body.contains(div)) {
            e.preventDefault()
          }
        } else if (e.key === 'ArrowUp') {
          // 向上箭头
          componentRef.current?.up()
          if (document.body.contains(div)) {
            e.preventDefault()
          }
        } else if (e.key === 'Enter') {
          // 回车键
          componentRef.current?.enter()
          if (document.body.contains(div)) {
            e.preventDefault()
          }
        }
        setTimeout(() => {
          if (cursorPosition !== input.selectionStart) {
            onCancel()
          }
        })
      })
      input.addEventListener?.('blur', () => {
        setTimeout(() => {
          onCancel()
        }, 200)
      })
      input.addEventListener?.('click', () => {
        setTimeout(() => {
          if (cursorPosition !== input.selectionStart) {
            onCancel()
          }
        })
      })
      input.addEventListener?.('input', e => {
        cursorPosition = e.target.selectionStart
        setTimeout(() => {
          componentRef.current.setStyle?.(getPosition())
          componentRef.current?.setValue(e.target.getAttribute('data-cursor-value').slice(0))
        })
      })

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
