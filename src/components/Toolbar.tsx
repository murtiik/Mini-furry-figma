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
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6.8 7.2 5.2 3 2 6l2.5 2.2" />
          <path d="M17.2 7.2 18.8 3 22 6l-2.5 2.2" />
          <path d="M8 7.5c-4.4 0-6.6 3-6.6 7 0 4 2 5.7 5 5.7h11.2c3 0 5-1.7 5-5.7 0-4-2.2-7-6.6-7Z" />
          <circle cx="9" cy="13.4" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="13.4" r="0.9" fill="currentColor" stroke="none" />
          <path d="M12 14.2 10.8 16h2.4Z" />
          <path d="M10.2 17.6c.6.4 1.2.6 1.8.6s1.2-.2 1.8-.6" />
          <path d="M7.4 13.2 3.4 12.2M7.4 15.9l-4 1" />
          <path d="M16.6 13.2l4-1M16.6 15.9l4 1" />
        </svg>
      </div>
    </nav>
  )
}