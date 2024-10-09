import { DomEditor, IDomEditor, IModuleConf } from '@wangeditor/editor'
import { isKeyHotkey } from 'is-hotkey'
import { IS_MAC } from './helper'

const APPLE_HOTKEYS = {
  formula: 'cmd+shift+l',
}

type Hotkeys = typeof APPLE_HOTKEYS

const WINDOWS_HOTKEYS: Hotkeys = {
  formula: 'ctrl+shift+l',
}

interface KEYS {
  [key: string]: string | string[]
}

const HOTKEYS: KEYS = {}

const create = (key: keyof Hotkeys) => {
  const generic = HOTKEYS[key]
  const apple = APPLE_HOTKEYS[key]
  const windows = WINDOWS_HOTKEYS[key]
  const isGeneric = generic && isKeyHotkey(generic)
  const isApple = apple && isKeyHotkey(apple)
  const isWindows = windows && isKeyHotkey(windows)

  return (event: KeyboardEvent) => {
    if (isGeneric && isGeneric(event)) return true
    if (IS_MAC && isApple && isApple(event)) return true
    if (!IS_MAC && isWindows && isWindows(event)) return true
    return false
  }
}

export default {
  isFormula: create('formula'),
}
