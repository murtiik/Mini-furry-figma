import { useEffect } from 'react'
import type { Tool } from '../types/shape'
import { SHORTCUT_TO_TOOL } from '../constants/tools'

export interface HotkeyActions {
  onSelectTool: (tool: Tool) => void
  onUndo: () => void
  onRedo: () => void
}

export function useHotkeys({ onSelectTool, onUndo, onRedo }: HotkeyActions): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.code === 'KeyZ') {
          event.preventDefault()
          if (event.shiftKey) {
            onRedo()
          } else {
            onUndo()
          }
        }
        return
      }
      if (event.altKey || event.metaKey) return
      if (!event.code.startsWith('Key')) return
      const letter = event.code.slice(3).toLowerCase()
      const shortcut = SHORTCUT_TO_TOOL[letter]
      if (shortcut) {
        event.preventDefault()
        onSelectTool(shortcut)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onSelectTool, onUndo, onRedo])
}