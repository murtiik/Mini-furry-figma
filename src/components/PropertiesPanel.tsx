import type { Shape } from '../types/shape'

interface PropertiesPanelProps {
  selectedShape: Shape | null
  onUpdateShape: (id: string, patch: Partial<Omit<Shape, 'id'>>) => void
}

export function PropertiesPanel({ selectedShape, onUpdateShape }: PropertiesPanelProps) {
  return (
    <section className="border-b border-neutral-800 p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Свойства
      </h2>
      {selectedShape ? (
        <dl className="space-y-2 text-xs text-neutral-300">
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Заливка</dt>
            <dd>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="color"
                  value={selectedShape.fill}
                  onChange={(event) => onUpdateShape(selectedShape.id, { fill: event.target.value })}
                  className="h-7 w-9 cursor-pointer rounded border border-neutral-700 bg-transparent"
                />
                <span className="uppercase text-neutral-400">{selectedShape.fill}</span>
              </label>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Тип</dt>
            <dd>{selectedShape.type}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">X</dt>
            <dd>{Math.round(selectedShape.rect.x)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Y</dt>
            <dd>{Math.round(selectedShape.rect.y)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">W</dt>
            <dd>{Math.round(selectedShape.rect.width)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">H</dt>
            <dd>{Math.round(selectedShape.rect.height)}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-neutral-600">Ничего не выбрано</p>
      )}
    </section>
  )
}