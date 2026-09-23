import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'
import type { Point, Viewport } from '../types/shape'
import { clamp, screenToCanvas } from '../utils/geometry'

export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 4

const ZOOM_STEP = 1.1

export interface ViewportEvents {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void
}

interface UseViewportResult {
  viewport: Viewport
  elementRef: RefObject<HTMLDivElement | null>
  isSpaceDown: boolean
  isPanning: boolean
  viewportEvents: ViewportEvents
}

export function useViewport(): UseViewportResult {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const [viewport, setViewport] = useState<Viewport>({ zoom: 1, pan: { x: 0, y: 0 } })
  const [isSpaceDown, setIsSpaceDown] = useState(false)
  const [isPanning, setIsPanning] = useState(false)

  const isSpaceDownRef = useRef(false)
  const isPanningRef = useRef(false)
  const lastPointerRef = useRef<Point | null>(null)

  useEffect(() => {
    isSpaceDownRef.current = isSpaceDown
  }, [isSpaceDown])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    const frame = requestAnimationFrame(() => {
      setViewport((prev) => ({
        ...prev,
        pan: { x: element.clientWidth / 2, y: element.clientHeight / 2 },
      }))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      event.preventDefault()
      if (!event.repeat) {
        isSpaceDownRef.current = true
        setIsSpaceDown(true)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      event.preventDefault()
      isSpaceDownRef.current = false
      isPanningRef.current = false
      lastPointerRef.current = null
      setIsSpaceDown(false)
      setIsPanning(false)
    }
    const onWindowBlur = () => {
      isSpaceDownRef.current = false
      isPanningRef.current = false
      lastPointerRef.current = null
      setIsSpaceDown(false)
      setIsPanning(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onWindowBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      const cursor: Point = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
      setViewport((prev) => {
        const zoom = clamp(prev.zoom * factor, MIN_ZOOM, MAX_ZOOM)
        if (zoom === prev.zoom) return prev
        const canvasPoint = screenToCanvas(cursor, prev)
        return {
          zoom,
          pan: {
            x: cursor.x - canvasPoint.x * zoom,
            y: cursor.y - canvasPoint.y * zoom,
          },
        }
      })
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isSpaceDownRef.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    isPanningRef.current = true
    lastPointerRef.current = { x: event.clientX, y: event.clientY }
    setIsPanning(true)
  }, [])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isPanningRef.current || !lastPointerRef.current) return
    const dx = event.clientX - lastPointerRef.current.x
    const dy = event.clientY - lastPointerRef.current.y
    lastPointerRef.current = { x: event.clientX, y: event.clientY }
    setViewport((prev) => ({
      ...prev,
      pan: { x: prev.pan.x + dx, y: prev.pan.y + dy },
    }))
  }, [])

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isPanningRef.current) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    isPanningRef.current = false
    lastPointerRef.current = null
    setIsPanning(false)
  }, [])

  return {
    viewport,
    elementRef,
    isSpaceDown,
    isPanning,
    viewportEvents: { onPointerDown, onPointerMove, onPointerUp },
  }
}