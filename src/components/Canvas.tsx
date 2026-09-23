import type { RefObject } from 'react'
import type { Rect, Shape as ShapeModel, ShapeType, Viewport } from '../types/shape'
import type { ViewportEvents } from '../hooks/useViewport'
import type { ShapeDragEvents, ShapeMoveEvents } from '../hooks/useShapes'
import { Shape } from './Shape'

const GRID_SIZE = 24
const GRID_COLOR = 'rgba(255, 255, 255, 0.08)'

interface CanvasProps {
  viewport: Viewport
  viewportEvents: ViewportEvents
  elementRef: RefObject<HTMLDivElement | null>
  shapes: ShapeModel[]
  selectedId: string | null
  isSpaceDown: boolean
  isPanning: boolean
  createShapeType: ShapeType | null
  shapeDragEvents: ShapeDragEvents
  shapeMoveEvents: ShapeMoveEvents
  draftRect: Rect | null
  onSelectShape: (id: string) => void
}

export function Canvas({
  viewport,
  viewportEvents,
  elementRef,
  shapes,
  selectedId,
  isSpaceDown,
  isPanning,
  createShapeType,
  shapeDragEvents,
  shapeMoveEvents,
  draftRect,
  onSelectShape,
}: CanvasProps) {
  const gridSize = GRID_SIZE * viewport.zoom

  return (
    <div
      ref={elementRef}
      onPointerDown={(event) => {
        if (!isSpaceDown && createShapeType) {
          shapeDragEvents.onPointerDown(event, createShapeType, viewport)
        } else {
          viewportEvents.onPointerDown(event)
        }
      }}
      onPointerMove={(event) => {
        if (!isSpaceDown && createShapeType) {
          shapeDragEvents.onPointerMove(event, viewport)
        } else {
          viewportEvents.onPointerMove(event)
        }
      }}
      onPointerUp={(event) => {
        if (!isSpaceDown && createShapeType) {
          shapeDragEvents.onPointerUp(event, viewport)
        } else {
          viewportEvents.onPointerUp(event)
        }
      }}
      className="relative h-full w-full select-none overflow-hidden bg-[#0f1115]"
      style={{
        cursor: isSpaceDown ? (isPanning ? 'grabbing' : 'grab') : createShapeType ? 'crosshair' : 'default',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${GRID_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_COLOR} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${viewport.pan.x % gridSize}px ${viewport.pan.y % gridSize}px`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            shape={shape}
            viewport={viewport}
            isSelected={shape.id === selectedId}
            onSelect={onSelectShape}
            shapeMoveEvents={shapeMoveEvents}
          />
        ))}

        {draftRect && createShapeType && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: draftRect.x,
              top: draftRect.y,
              width: draftRect.width,
              height: draftRect.height,
            }}
          >
            {createShapeType === 'ellipse' ? (
              <div className="h-full w-full rounded-full border-2 border-dashed border-sky-400 bg-sky-400/20" />
            ) : (
              <div className="h-full w-full border-2 border-dashed border-sky-400 bg-sky-400/20" />
            )}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-neutral-300">
        {Math.round(viewport.zoom * 100)}%
      </div>
    </div>
  )
}