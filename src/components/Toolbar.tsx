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

      <div
        className="mt-auto grid h-10 w-10 place-items-center text-neutral-500 transition-colors hover:text-neutral-200"
        title="Котик"
        aria-hidden="true"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 3.5 1.3 8l5.5.6Z" />
          <path d="M19 3.5l3.7 4.5-5.5.6Z" />
          <path d="M8.8 8.6c-4.5 0-6.6 2.8-6.6 6.6 0 3.8 2 5.4 4.8 5.4h10c2.8 0 4.8-1.6 4.8-5.4 0-3.8-2.1-6.6-6.6-6.6Z" />
          <circle cx="9" cy="14.2" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="14.2" r="0.9" fill="currentColor" stroke="none" />
          <path d="M12 15 10.8 16.8h2.4Z" />
          <path d="M10.2 18.4c.6.4 1.2.6 1.8.6s1.2-.2 1.8-.6" />
          <path d="M7.2 14 3.2 13M7.2 16.6l-4 1" />
          <path d="M16.8 14l4-1M16.8 16.6l4 1" />
        </svg>
      </div>
    </nav>
  )
}