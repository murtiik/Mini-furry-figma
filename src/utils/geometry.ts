import type { Point, Rect, Viewport } from '../types/shape'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function screenToCanvas(screen: Point, viewport: Viewport): Point {
  return {
    x: (screen.x - viewport.pan.x) / viewport.zoom,
    y: (screen.y - viewport.pan.y) / viewport.zoom,
  }
}

export function canvasToScreen(canvasPoint: Point, viewport: Viewport): Point {
  return {
    x: canvasPoint.x * viewport.zoom + viewport.pan.x,
    y: canvasPoint.y * viewport.zoom + viewport.pan.y,
  }
}

export function normalizeRect(a: Point, b: Point): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }
}

export function screenDeltaToCanvas(screenDelta: Point, viewport: Viewport): Point {
  return {
    x: screenDelta.x / viewport.zoom,
    y: screenDelta.y / viewport.zoom,
  }
}

export function translateRect(rect: Rect, delta: Point): Rect {
  return {
    ...rect,
    x: rect.x + delta.x,
    y: rect.y + delta.y,
  }
}