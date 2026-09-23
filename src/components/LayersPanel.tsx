import type { Shape } from '../types/shape'

interface LayersPanelProps {
  shapes: Shape[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function LayersPanel({ shapes, selectedId, onSelect }: LayersPanelProps) {
  return (
    <section className="flex-1 overflow-y-auto p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Слои
      </h2>
      {shapes.length === 0 ? (
        <p className="text-sm text-neutral-600">Слоёв пока нет</p>
      ) : (
        <ul className="space-y-1">
          {shapes.map((shape, index) => (
            <li key={shape.id}>
              <button
                type="button"
                onClick={() => onSelect(shape.id)}
                className={`w-full truncate rounded px-2 py-1.5 text-left text-sm ${
                  selectedId === shape.id
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`}
              >
                {shape.type} {index + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}