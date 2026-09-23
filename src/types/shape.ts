export type ShapeType = 'rectangle' | 'ellipse'

export type Tool = 'select' | 'rectangle' | 'ellipse'

export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Shape {
  id: string
  type: ShapeType
  rect: Rect
  fill: string
  stroke: string
  strokeWidth: number
}

export interface Viewport {
  zoom: number
  pan: Point
}