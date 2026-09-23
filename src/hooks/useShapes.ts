import { useCallback, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Point, Rect, Shape, ShapeType, Viewport } from '../types/shape'
import { normalizeRect, screenDeltaToCanvas, screenToCanvas, translateRect } from '../utils/geometry'

const DEFAULT_FILL = '#7c6cff'
const DEFAULT_STROKE = '#1e1b2e'
const DEFAULT_STROKE_WIDTH = 0

export interface ShapeDragEvents {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>, type: ShapeType, viewport: Viewport) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>, viewport: Viewport) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>, viewport: Viewport) => void
}

export interface ShapeMoveEvents {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>, shape: Shape, viewport: Viewport) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>, viewport: Viewport) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>, viewport: Viewport) => void
}

interface UseShapesResult {
  shapes: Shape[]
  selectedId: string | null
  selectedShape: Shape | null
  draftRect: Rect | null
  addShape: (type: ShapeType, rect: Rect) => string
  updateShape: (id: string, patch: Partial<Omit<Shape, 'id'>>) => void
  selectShape: (id: string | null) => void
  undo: () => void
  redo: () => void
  shapeDragEvents: ShapeDragEvents
  shapeMoveEvents: ShapeMoveEvents
}

function toScreen(event: ReactPointerEvent<HTMLDivElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

function toCanvasRect(start: Point, current: Point, viewport: Viewport): Rect {
  return normalizeRect(screenToCanvas(start, viewport), screenToCanvas(current, viewport))
}

export function useShapes(): UseShapesResult {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draftRect, setDraftRect] = useState<Rect | null>(null)
  const dragRef = useRef<{ type: ShapeType; start: Point } | null>(null)
  const moveRef = useRef<{ id: string; startScreen: Point; startRect: Rect } | null>(null)
  const moveHistoryCommittedRef = useRef(false)

  const shapesRef = useRef<Shape[]>([])
  shapesRef.current = shapes
  const historyPastRef = useRef<Shape[][]>([])
  const historyFutureRef = useRef<Shape[][]>([])

  const commitHistory = useCallback(() => {
    historyPastRef.current.push(shapesRef.current)
    historyFutureRef.current = []
  }, [])

  const addShape = useCallback(
    (type: ShapeType, rect: Rect) => {
      const id = crypto.randomUUID()
      const shape: Shape = {
        id,
        type,
        rect,
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        strokeWidth: DEFAULT_STROKE_WIDTH,
      }
      commitHistory()
      setShapes((prev) => [...prev, shape])
      setSelectedId(id)
      return id
    },
    [commitHistory],
  )

  const applyShape = useCallback((id: string, patch: Partial<Omit<Shape, 'id'>>) => {
    setShapes((prev) => prev.map((shape) => (shape.id === id ? { ...shape, ...patch } : shape)))
  }, [])

  const updateShape = useCallback(
    (id: string, patch: Partial<Omit<Shape, 'id'>>) => {
      commitHistory()
      applyShape(id, patch)
    },
    [applyShape, commitHistory],
  )

  const selectShape = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const undo = useCallback(() => {
    const past = historyPastRef.current
    if (past.length === 0) return
    historyFutureRef.current = [shapesRef.current, ...historyFutureRef.current]
    historyPastRef.current = past.slice(0, -1)
    setShapes(past[past.length - 1])
    setSelectedId(null)
  }, [])

  const redo = useCallback(() => {
    const future = historyFutureRef.current
    if (future.length === 0) return
    historyPastRef.current = [...historyPastRef.current, shapesRef.current]
    historyFutureRef.current = future.slice(1)
    setShapes(future[0])
    setSelectedId(null)
  }, [])

  const selectedShape = shapes.find((shape) => shape.id === selectedId) ?? null

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, type: ShapeType, _viewport: Viewport) => {
      dragRef.current = { type, start: toScreen(event) }
      event.currentTarget.setPointerCapture(event.pointerId)
      setDraftRect(null)
    },
    [],
  )

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>, viewport: Viewport) => {
    const drag = dragRef.current
    if (!drag) return
    setDraftRect(toCanvasRect(drag.start, toScreen(event), viewport))
  }, [])

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, viewport: Viewport) => {
      const drag = dragRef.current
      if (!drag) return
      event.currentTarget.releasePointerCapture(event.pointerId)
      dragRef.current = null
      const rect = toCanvasRect(drag.start, toScreen(event), viewport)
      setDraftRect(null)
      if (rect.width >= 1 && rect.height >= 1) {
        addShape(drag.type, rect)
      }
    },
    [addShape],
  )

  const onShapePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, shape: Shape, _viewport: Viewport) => {
      event.stopPropagation()
      event.currentTarget.setPointerCapture(event.pointerId)
      moveRef.current = {
        id: shape.id,
        startScreen: { x: event.clientX, y: event.clientY },
        startRect: shape.rect,
      }
      moveHistoryCommittedRef.current = false
    },
    [],
  )

  const onShapePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, viewport: Viewport) => {
      const move = moveRef.current
      if (!move) return
      if (!moveHistoryCommittedRef.current) {
        moveHistoryCommittedRef.current = true
        commitHistory()
      }
      const delta = screenDeltaToCanvas(
        { x: event.clientX - move.startScreen.x, y: event.clientY - move.startScreen.y },
        viewport,
      )
      applyShape(move.id, { rect: translateRect(move.startRect, delta) })
    },
    [applyShape, commitHistory],
  )

  const onShapePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!moveRef.current) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    moveRef.current = null
    moveHistoryCommittedRef.current = false
  }, [])

  return {
    shapes,
    selectedId,
    selectedShape,
    draftRect,
    addShape,
    updateShape,
    selectShape,
    undo,
    redo,
    shapeDragEvents: { onPointerDown, onPointerMove, onPointerUp },
    shapeMoveEvents: { onPointerDown: onShapePointerDown, onPointerMove: onShapePointerMove, onPointerUp: onShapePointerUp },
  }
}