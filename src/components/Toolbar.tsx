import type { Tool } from '../types/shape'
import { TOOLS } from '../constants/tools'

interface ToolbarProps {
  tool: Tool
  onSelectTool: (tool: Tool) => void
}

export function Toolbar({ tool, onSelectTool }: ToolbarProps) {
  return (
    <nav className="flex w-14 flex-col items-center gap-1 border-r border-neutral-800 bg-neutral-950 py-3">
      {TOOLS.map(({ id, label, shortcut, icon }) => (
        <button
          key={id}
          type="button"
          title={`${label} (${shortcut})`}
          aria-pressed={tool === id}
          onClick={() => onSelectTool(id)}
          className={`grid h-10 w-10 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100 ${
            tool === id ? 'bg-neutral-800 text-white' : ''
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={icon} />
          </svg>
        </button>
      ))}
    </nav>
  )
}