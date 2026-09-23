import type { Shape as ShapeModel, Viewport } from '../types/shape'
import type { ShapeMoveEvents } from '../hooks/useShapes'

const SELECTION_COLOR = '#4c8dff'
const MARKER_GAP = 4
const MARKER_SIZE = 8

const MARKER_POSITIONS = [
  { top: -MARKER_GAP, left: -MARKER_GAP },
  { top: -MARKER_GAP, left: 'calc(50% - 4px)' },
  { top: -MARKER_GAP, left: 'calc(100% - 4px)' },
  { top: 'calc(50% - 4px)', left: -MARKER_GAP },
  { top: 'calc(50% - 4px)', left: 'calc(100% - 4px)' },
  { top: 'calc(100% - 4px)', left: -MARKER_GAP },
  { top: 'calc(100% - 4px)', left: 'calc(50% - 4px)' },
  { top: 'calc(100% - 4px)', left: 'calc(100% - 4px)' },
]

interface ShapeProps {
  shape: ShapeModel
  viewport: Viewport
  isSelected: boolean
  onSelect: (id: string) => void
  shapeMoveEvents: ShapeMoveEvents
}

export function Shape({ shape, viewport, isSelected, onSelect, shapeMoveEvents }: ShapeProps) {
  const strokeStyle = `${shape.strokeWidth}px solid ${shape.stroke}`

  return (
    <div
      className="absolute"
      style={{
        left: shape.rect.x,
        top: shape.rect.y,
        width: shape.rect.width,
        height: shape.rect.height,
        cursor: isSelected ? 'move' : 'pointer',
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        onSelect(shape.id)
        shapeMoveEvents.onPointerDown(event, shape, viewport)
      }}
      onPointerMove={(event) => shapeMoveEvents.onPointerMove(event, viewport)}
      onPointerUp={(event) => shapeMoveEvents.onPointerUp(event, viewport)}
    >
      {shape.type === 'rectangle' ? (
        <div className="h-full w-full" style={{ background: shape.fill, border: strokeStyle }} />
      ) : (
        <div className="h-full w-full rounded-full" style={{ background: shape.fill, border: strokeStyle }} />
      )}

      {isSelected && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: -MARKER_GAP,
            left: -MARKER_GAP,
            right: -MARKER_GAP,
            bottom: -MARKER_GAP,
            border: `1px solid ${SELECTION_COLOR}`,
          }}
        >
          {MARKER_POSITIONS.map((position, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                top: position.top,
                left: position.left,
                width: MARKER_SIZE,
                height: MARKER_SIZE,
                background: '#ffffff',
                border: `1px solid ${SELECTION_COLOR}`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}