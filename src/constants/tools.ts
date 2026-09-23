import type { Tool } from '../types/shape'

export interface ToolDef {
  id: Tool
  label: string
  shortcut: string
  icon: string
}

export const TOOLS: readonly ToolDef[] = [
  { id: 'select', label: 'Select', shortcut: 'V', icon: 'M4 4l6.2 16.2 2.4-7.6 7.6-2.4L4 4z' },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: 'M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z' },
  { id: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: 'M12 3a9 9 0 100 18 9 9 0 000-18z' },
]

export const SHORTCUT_TO_TOOL: Record<string, Tool> = {
  r: 'rectangle',
  o: 'ellipse',
  v: 'select',
}

export const DEFAULT_TOOL: Tool = 'select'