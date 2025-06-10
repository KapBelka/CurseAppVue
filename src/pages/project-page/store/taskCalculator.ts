import moment from "moment";
import {
  BoardTaskDto,
  ProjectDto,
  TaskDto,
} from "../../../services/projects/dtos/project-dto";

export interface TaskRect {
  id: string;
  order: number;
  isCritical: boolean;
  a: number;
  b: number;
  x1: number | null;
  x2: number | null;
  y1: number | null;
  y2: number | null;
  isResourceExceeded: boolean;
  resources: number;
  upperRects: TaskRect[];
  hidden: boolean;
}

export function calculatedTasksRectsEarly(
  calculatedTasks: TaskDto[],
  resourceKindId: string | null = null
): TaskRect[] {
  let sourceRects = calculatedTasks
    .filter((x) => !x.isCritical && x.resources.length)
    .map((x) => {
      return {
        id: x.id,
        order: x.order,
        isCritical: false,
        a: x.earlyStart,
        b: x.earlyEnd,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: x.isEarlyResourceExceeded,
        resources: x.resources
          .filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  let foundationRects = calculatedTasks
    .filter((x) => x.isCritical && x.resources.length)
    .map((x) => {
      return {
        id: x.id,
        order: x.order,
        isCritical: true,
        a: x.earlyStart,
        b: x.earlyEnd,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: x.isEarlyResourceExceeded,
        resources: x.resources
          .filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  return calculateTasksRects(sourceRects, foundationRects);
}

export function calculatedTasksRectsLate(
  calculatedTasks: TaskDto[],
  resourceKindId: string | null = null
): TaskRect[] {
  let sourceRects = calculatedTasks
    .filter((x) => !x.isCritical && x.resources.length)
    .map((x) => {
      return {
        id: x.id,
        order: x.order,
        isCritical: false,
        a: x.lateStart,
        b: x.lateEnd,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: x.isLateResourceExceeded,
        resources: x.resources
          .filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  let foundationRects = calculatedTasks
    .filter((x) => x.isCritical && x.resources.length)
    .map((x) => {
      return {
        id: x.id,
        order: x.order,
        isCritical: true,
        a: x.lateStart,
        b: x.lateEnd,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: x.isLateResourceExceeded,
        resources: x.resources
          .filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  return calculateTasksRects(sourceRects, foundationRects);
}

export function calculatedTasksRectsNormal(
  calculatedTasks: TaskDto[],
  resourceKindId: string | null = null
): TaskRect[] {
  let sourceRects = calculatedTasks
    .filter((x) => !x.isCritical && x.resources.length)
    .map((x) => {
      return {
        id: x.id,
        order: x.order,
        isCritical: false,
        a: x.optimizedStart,
        b: x.optimizedEnd,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: x.isOptimizedResourceExceeded,
        resources: x.resources
          .filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  let foundationRects = calculatedTasks
    .filter((x) => x.isCritical && x.resources.length)
    .map((x) => {
      return {
        id: x.id,
        order: x.order,
        a: x.optimizedStart,
        b: x.optimizedEnd,
        isCritical: true,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: x.isOptimizedResourceExceeded,
        resources: x.resources
          .filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  return calculateTasksRects(sourceRects, foundationRects);
}

export function calculatedTasksRectsByFactTime(
  project: ProjectDto,
  resourceKindId: string | null = null
): TaskRect[] {
  let sourceRects = project.boardTasks
    .filter(
      (x) =>
        !project.tasks.find((y) => y.id == x.projectTaskId)!.isCritical &&
        project.tasks.find((y) => y.id == x.projectTaskId)!.resources.length
    )
    .map((x) => {
      return {
        id: x.id,
        order: project.tasks.find((y) => y.id == x.projectTaskId)!.order,
        isCritical: false,
        a:
          Math.round(
            moment
              .duration(
                moment(x.factTimeBegin!).diff(moment(project.startTime!))
              )
              .as("days") * 1000
          ) / 1000,
        b:
          Math.round(
            moment
              .duration(moment(x.factTimeEnd!).diff(moment(project.startTime!)))
              .as("days") * 1000
          ) / 1000,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: false,
        resources: project.tasks
          .find((y) => y.id == x.projectTaskId)!
          .resources.filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  let foundationRects = project.boardTasks
    .filter(
      (x) =>
        project.tasks.find((y) => y.id == x.projectTaskId)!.isCritical &&
        project.tasks.find((y) => y.id == x.projectTaskId)!.resources.length
    )
    .map((x) => {
      return {
        id: x.projectTaskId,
        order: project.tasks.find((y) => y.id == x.projectTaskId)!.order,
        isCritical: true,
        a:
          Math.round(
            moment
              .duration(
                moment(x.factTimeBegin!).diff(moment(project.startTime!))
              )
              .as("days") * 1000
          ) / 1000,
        b:
          Math.round(
            moment
              .duration(moment(x.factTimeEnd!).diff(moment(project.startTime!)))
              .as("days") * 1000
          ) / 1000,
        x1: null,
        x2: null,
        y1: null,
        y2: null,
        isResourceExceeded: false,
        resources: project.tasks
          .find((y) => y.id == x.projectTaskId)!
          .resources.filter(
            (y) =>
              resourceKindId == null ||
              y.projectResourceKindId == resourceKindId
          )
          .reduce((s, a) => (s += a.count), 0),
        upperRects: [],
        hidden: false,
      } as TaskRect;
    });

  return calculateTasksRects(foundationRects.concat(sourceRects), [
    {
      id: "",
      order: 0,
      isCritical: false,
      a: 0,
      b: Math.max(
        ...project.boardTasks.map((x) =>
          moment
            .duration(moment(x.factTimeEnd!).diff(moment(project.startTime!)))
            .as("days")
        )
      ),
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      isResourceExceeded: false,
      resources: 0,
      upperRects: [],
      hidden: true,
    },
  ]);
}

export function calculateTasksRects(
  sourceRects: TaskRect[],
  foundationRects: TaskRect[]
): TaskRect[] {
  for (var rect of foundationRects) {
    rect.upperRects = getRectsRecursive(rect.a, rect.b, sourceRects);
  }

  return foundationRects;
}

function getRectsRecursive(
  a: number,
  b: number,
  sourceRects: TaskRect[]
): TaskRect[] {
  let rects = [] as TaskRect[];
  
  let includesSourceRects = sourceRects.filter(
    (x) =>
      (x.a <= b && x.a >= a) || (x.b >= a && x.b <= b) || (a >= x.a && b <= x.b)
  );
  if (!includesSourceRects.length) return rects;

  let rectWithMaxLenght: TaskRect | null = null;
  includesSourceRects.reduce((s, x) => {
    let length = getLenght(x, a, b);
    if (length > s) {
      rectWithMaxLenght = x;
      return length;
    }
    return s;
  }, 0);
  if (!rectWithMaxLenght) return rects;

  let upperRect = getRect(rectWithMaxLenght, a, b);
  upperRect.upperRects = getRectsRecursive(
    upperRect.a,
    upperRect.b,
    sourceRects.filter((x) => x.id != upperRect.id)
  );
  rects.push(upperRect);

  if (upperRect.a > a) {
    let leftRects = getRectsRecursive(
      a,
      upperRect.a,
      sourceRects.filter((x) => x.id != upperRect.id)
    );
    for (var rect of leftRects) rects.push(rect);
  }

  if (upperRect.b < b) {
    let leftRects = getRectsRecursive(
      upperRect.b,
      b,
      sourceRects.filter((x) => x.id != upperRect.id)
    );
    for (var rect of leftRects) rects.push(rect);
  }

  return rects;
}

function getLenght(rect: TaskRect, a: number, b: number): number {
  let localA = a;
  if (rect.a > localA) localA = rect.a;

  let localB = b;
  if (rect.b < localB) localB = rect.b;

  return Math.round((localB - localA) * 1000) / 1000;
}

function getRect(rect: TaskRect, a: number, b: number): TaskRect {
  let localA = a;
  if (rect.a > localA) localA = rect.a;

  let localB = b;
  if (rect.b < localB) localB = rect.b;

  return {
    id: rect.id,
    order: rect.order,
    isCritical: rect.isCritical,
    a: localA,
    b: localB,
    x1: null,
    x2: null,
    y1: null,
    y2: null,
    isResourceExceeded: rect.isResourceExceeded,
    resources: rect.resources,
    upperRects: [],
    hidden: false,
  };
}
