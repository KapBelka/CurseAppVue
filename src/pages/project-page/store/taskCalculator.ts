import { TaskDto } from "../../../services/projects/dtos/project-dto";

export interface TaskRect {
  id: string
  order: number
  a: number
  b: number
  x1: number | null
  x2: number | null
  y1: number | null
  y2: number | null
  isResourceExceeded: boolean
  resources: number
  upperRects: TaskRect[]
}

export function calculatedTasksRectsEarly(calculatedTasks: TaskDto[], resourceKindId: string | null = null): TaskRect[] {
  let sourceRects = calculatedTasks.filter(x => !x.isCritical && x.resources.length).map(x => { 
    return {
      id: x.id,
      order: x.order,
      a: x.earlyStart,
      b: x.earlyEnd,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      isResourceExceeded: x.isEarlyResourceExceeded,
      resources: x.resources.filter(y => resourceKindId == null || y.projectResourceKindId == resourceKindId).reduce((s, a) => s += a.count, 0),
      upperRects: []
    } as TaskRect
  })

  let foundationRects = calculatedTasks.filter(x => x.isCritical && x.resources.length).map(x => { 
    return {
      id: x.id,
      order: x.order,
      a: x.earlyStart,
      b: x.earlyEnd,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      isResourceExceeded: x.isEarlyResourceExceeded,
      resources: x.resources.filter(y => resourceKindId == null || y.projectResourceKindId == resourceKindId).reduce((s, a) => s += a.count, 0),
      upperRects: []
    } as TaskRect
  })

  return calculateTasksRects(sourceRects, foundationRects)
}

export function calculatedTasksRectsLate(calculatedTasks: TaskDto[], resourceKindId: string | null = null): TaskRect[] {
  let sourceRects = calculatedTasks.filter(x => !x.isCritical && x.resources.length).map(x => { 
    return {
      id: x.id,
      order: x.order,
      a: x.lateStart,
      b: x.lateEnd,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      isResourceExceeded: x.isLateResourceExceeded,
      resources: x.resources.filter(y => resourceKindId == null || y.projectResourceKindId == resourceKindId).reduce((s, a) => s += a.count, 0),
      upperRects: []
    } as TaskRect
  })

  let foundationRects = calculatedTasks.filter(x => x.isCritical && x.resources.length).map(x => { 
    return {
      id: x.id,
      order: x.order,
      a: x.lateStart,
      b: x.lateEnd,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      isResourceExceeded: x.isLateResourceExceeded,
      resources: x.resources.filter(y => resourceKindId == null || y.projectResourceKindId == resourceKindId).reduce((s, a) => s += a.count, 0),
      upperRects: []
    } as TaskRect
  })

  return calculateTasksRects(sourceRects, foundationRects)
}

export function calculatedTasksRectsNormal(calculatedTasks: TaskDto[], resourceKindId: string | null = null): TaskRect[] {
  let sourceRects = calculatedTasks.filter(x => !x.isCritical && x.resources.length).map(x => { 
    return {
      id: x.id,
      order: x.order,
      a: x.optimizedStart,
      b: x.optimizedEnd,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      isResourceExceeded: x.isOptimizedResourceExceeded,
      resources: x.resources.filter(y => resourceKindId == null || y.projectResourceKindId == resourceKindId).reduce((s, a) => s += a.count, 0),
      upperRects: []
    } as TaskRect
  })

  let foundationRects = calculatedTasks.filter(x => x.isCritical && x.resources.length).map(x => { 
    return {
      id: x.id,
      order: x.order,
      a: x.optimizedStart,
      b: x.optimizedEnd,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      isResourceExceeded: x.isOptimizedResourceExceeded,
      resources: x.resources.filter(y => resourceKindId == null || y.projectResourceKindId == resourceKindId).reduce((s, a) => s += a.count, 0),
      upperRects: []
    } as TaskRect
  })

  return calculateTasksRects(sourceRects, foundationRects)
}

export function calculateTasksRects(sourceRects: TaskRect[], foundationRects: TaskRect[]): TaskRect[] {
  for (var rect of foundationRects) {
    rect.upperRects = getRectsRecursive(rect.a, rect.b, sourceRects)
  }

  return foundationRects
}

function getRectsRecursive(a: number, b: number, sourceRects: TaskRect[]): TaskRect[] {
  let rects = [] as TaskRect[]

  let includesSourceRects = sourceRects.filter(x => x.a < b && x.a >= a || x.b > a && x.b <= b)
  if (!includesSourceRects.length)
    return rects

  let rectWithMaxLenght: TaskRect | null = null
  includesSourceRects.reduce((s, x) => {
    let length = getLenght(x, a, b)
    if (length > s) {
      rectWithMaxLenght = x
      return length
    }
    return s
  }, 0)
  if (!rectWithMaxLenght)
    return rects

  let upperRect = getRect(rectWithMaxLenght, a, b)
  upperRect.upperRects = getRectsRecursive(upperRect.a, upperRect.b, sourceRects.filter(x => x.id != upperRect.id))
  rects.push(upperRect)

  if (upperRect.a > a) {
    let leftRects = getRectsRecursive(a, upperRect.a, sourceRects.filter(x => x.id != upperRect.id))
    for (var rect of leftRects)
      rects.push(rect)
  }

  if (upperRect.b < b) {
    let leftRects = getRectsRecursive(upperRect.b, b, sourceRects.filter(x => x.id != upperRect.id))
    for (var rect of leftRects)
      rects.push(rect)
  }

  return rects
}

function getLenght(rect: TaskRect, a: number, b: number): number {
  let localA = a
  if (rect.a > localA)
    localA = rect.a

  let localB = b
  if (rect.b < localB)
    localB = rect.b

  return localB - localA
}

function getRect(rect: TaskRect, a: number, b: number): TaskRect {
  let localA = a
  if (rect.a > localA)
    localA = rect.a

  let localB = b
  if (rect.b < localB)
    localB = rect.b

  return {
    id: rect.id,
    order: rect.order,
    a: localA,
    b: localB,
    x1: null,
    x2: null,
    y1: null,
    y2: null,
    isResourceExceeded: rect.isResourceExceeded,
    resources: rect.resources,
    upperRects: []
  }
}
