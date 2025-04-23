<template>
  <ResourceGraph
    @mousemove="onCanvasInteract($event)"
    @mousedown="onCanvasInteract($event)"
    @mouseup="onCanvasInteract($event)"
    @mouseleave="onCanvasInteract($event)"
    :rects="rects"
    :hasCursor="hasCursor"
    :horizontalLines="
      taskForMove ? [taskForMove.earlyStart, taskForMove.lateEnd] : []
    "
    title="График Скорректированный"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../../store/index";
import AddTaskModal from "../modals/AddTaskModal.vue";
import UpdateTaskModal from "../modals/UpdateTaskModal.vue";
import {
  calculatedTasksRectsNormal,
  TaskRect,
} from "../../store/taskCalculator";
import PageContainer from "../../../../components/pageContainer/page-container.vue";
import { TaskDto } from "../../../../services/projects/dtos/project-dto";
import ResourceGraph from "./resource-graph.vue";

export default defineComponent({
  components: {
    AddTaskModal,
    UpdateTaskModal,
    PageContainer,
    ResourceGraph,
  },
  data() {
    return {
      storage: storage.getInstance(),
      taskForMove: null as null | TaskDto,
      rects: [] as TaskRect[],
      lastMouseX: null as number | null,
      hasCursor: false as boolean,
    };
  },
  methods: {
    getRect(rects: TaskRect[], x: number, y: number): TaskRect | null {
      this.rects.find(
        (i) => x >= i.x1! && x <= i.x2! && y >= i.y1! && y <= i.y2!
      );

      var findedRect: TaskRect | null = null;

      for (var rect of rects) {
        if (x >= rect.x1! && x <= rect.x2! && y >= rect.y1! && y <= rect.y2!)
          return rect;

        findedRect =
          rect.upperRects.find(
            (i) => x >= i.x1! && x <= i.x2! && y >= i.y1! && y <= i.y2!
          ) ?? null;
        if (findedRect) return findedRect;

        findedRect = this.getRect(rect.upperRects, x, y);
        if (findedRect) return findedRect;
      }

      return findedRect;
    },
    onCanvasInteract(event: MouseEvent) {
      if (event.type == "mousedown") {
        var rect = this.getRect(this.rects, event.offsetX, event.offsetY);

        if (rect != null) {
          var task = this.tasks.find((x) => x.id == rect!.id)!;
          if (task.isCritical == false) this.taskForMove = task;
          else this.taskForMove = null;
        }

        this.lastMouseX = event.offsetX;
      }

      if (event.type == "mouseup" || event.type == "mouseleave") {
        if (this.taskForMove)
          this.storage.updateTaskOptimizedTime({
            id: this.taskForMove.id,
            start: this.taskForMove.optimizedStart!,
            end: this.taskForMove.optimizedEnd!,
          });

        this.taskForMove = null;

        this.lastMouseX = event.offsetX;
      }

      if (event.type == "mousemove") {
        var rect = this.getRect(this.rects, event.offsetX, event.offsetY);

        if (rect != null) {
          var task = this.tasks.find((x) => x.id == rect!.id)!;
          if (task.isCritical == false) this.hasCursor = true;
          else this.hasCursor = false;
        } else {
          this.hasCursor = false;
        }

        if (this.taskForMove) {
          if (Math.abs(event.offsetX - this.lastMouseX!) >= 20) {
            if (event.offsetX - this.lastMouseX! > 0) {
              if (
                this.taskForMove.optimizedEnd + 1 <=
                this.taskForMove.lateEnd
              ) {
                this.taskForMove.optimizedStart += 1;
                this.taskForMove.optimizedEnd += 1;
              }
            } else {
              if (
                this.taskForMove.optimizedStart - 1 >=
                this.taskForMove.earlyStart
              ) {
                this.taskForMove.optimizedStart -= 1;
                this.taskForMove.optimizedEnd -= 1;
              }
            }

            this.lastMouseX = event.offsetX;
          }
        }
      }

      this.rects = calculatedTasksRectsNormal(
        this.tasks.filter(
          (x) => x.optimizedStart != null && x.optimizedEnd != null
        )
      );
    },
  },
  computed: {
    tasks(): TaskDto[] {
      return this.storage.tasks;
    },
  },
  watch: {
    tasks: {
      handler: async function () {
        this.rects = calculatedTasksRectsNormal(this.tasks);
      },
      deep: true,
    },
  },
});
</script>
