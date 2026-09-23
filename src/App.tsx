import { useState } from 'react'
import type { Tool } from './types/shape'
import { useViewport } from './hooks/useViewport'
import { useShapes } from './hooks/useShapes'
import { useHotkeys } from './hooks/useHotkeys'
import { Canvas } from './components/Canvas'
import { Toolbar } from './components/Toolbar'
import { PropertiesPanel } from './components/PropertiesPanel'
import { LayersPanel } from './components/LayersPanel'

export default function App() {
  const [tool, setTool] = useState<Tool>('select')
  const { viewport, elementRef, isSpaceDown, isPanning, viewportEvents } = useViewport()
  const { shapes, selectedId, selectedShape, selectShape, updateShape, undo, redo, shapeDragEvents, shapeMoveEvents, draftRect } =
    useShapes()
  const createShapeType = tool === 'select' ? null : tool
  useHotkeys({ onSelectTool: setTool, onUndo: undo, onRedo: redo })

  return (
    <div className="flex h-full w-full overflow-hidden bg-neutral-950 text-neutral-100">
      <Toolbar tool={tool} onSelectTool={setTool} />

      <main className="relative flex-1">
        <Canvas
          viewport={viewport}
          viewportEvents={viewportEvents}
          elementRef={elementRef}
          shapes={shapes}
          selectedId={selectedId}
          isSpaceDown={isSpaceDown}
          isPanning={isPanning}
          createShapeType={createShapeType}
          shapeDragEvents={shapeDragEvents}
          shapeMoveEvents={shapeMoveEvents}
          draftRect={draftRect}
          onSelectShape={selectShape}
        />
        <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-neutral-400">
          {isSpaceDown
            ? isPanning
              ? 'Перетащите, чтобы панорамировать'
              : 'Зажмите мышь и перетащите'
            : 'Пробел + перетаскивание — панорама · Колесо — зум (10–400%)'}
        </div>
      </main>

      <aside className="flex w-60 flex-col border-l border-neutral-800 bg-neutral-950">
        <PropertiesPanel selectedShape={selectedShape} onUpdateShape={updateShape} />
        <LayersPanel shapes={shapes} selectedId={selectedId} onSelect={selectShape} />
      </aside>
    </div>
  )
}