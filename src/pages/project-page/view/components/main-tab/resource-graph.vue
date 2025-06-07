<template>
  <div
    style="background-color: #4f4752; border-radius: 6px; font-size: 16px"
    :class="{ 'c-pointer': hasCursor }"
  >
    <div class="px-4 py-2" style="color: #fff">{{ title }}</div>
    <div
      ref="graphContainer"
      class="px-3"
      style="
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0 -8px 12px #00000029;
      "
    >
      <canvas
        @wheel.stop.prevent="onWheel($event)"
        @mousemove="onCanvasMove($event)"
        @mousedown="
          $emit('mousedown', $event);
          onMouseDown($event);
        "
        @mouseup="
          $emit('mouseup', $event);
          onMouseUpOrLeave();
        "
        @mouseleave="
          $emit('mouseleave', $event);
          onMouseUpOrLeave();
        "
        @scroll.stop.prevent=""
        class="d-block"
        ref="graphBody"
      ></canvas>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import storage from "../../../store/index";
import { TaskRect } from "../../../store/taskCalculator";
import { TaskDto } from "../../../../../services/projects/dtos/project-dto";
import deepcopy from "deepcopy";

export default defineComponent({
  components: {},
  props: {
    isCorrected: { type: Boolean, default: false },
    rects: { type: Array as PropType<TaskRect[]>, default: [] },
    tasks: { type: Array as PropType<TaskDto[]>, default: [] },
    title: { type: String, required: true },
    hasCursor: { type: Boolean, default: false },
    canDragged: { type: Boolean, default: true },
    horizontalLines: { type: Array as PropType<number[]>, default: [] },
  },
  data() {
    return {
      storage: storage.getInstance(),
      localRects: [] as TaskRect[],
      scale: 1,
      lastCursorX: 0,
      lastCursorY: 0,
      xOffset: 0,
      yOffset: 0,
      isDragged: false,
    };
  },
  computed: {
    widthPer1() {
      return 20 * this.scale;
    },
    heightPer1() {
      return 20 * this.scale;
    },
    height() {
      return 280;
    },
    width() {
      return (this.$refs.graphContainer as HTMLDivElement).clientWidth - 30; //20 * this.rects.reduce((a, b) => (b.b > a ? b.b : a), 0) + 100
    },
    graphOffsetY() {
      return 40;
    },
    graphOffsetX() {
      return 40;
    },
  },
  methods: {
    onWheel(event: WheelEvent) {
      if (event.deltaY > 0) {
        this.scale -= 0.1;
      } else if (event.deltaY < 0) {
        this.scale += 0.1;
      }

      if (this.scale > 2) this.scale = 2;

      if (this.scale < 0.4) this.scale = 0.4;
    },
    onMouseDown(event: MouseEvent) {
      this.lastCursorX = event.offsetX;
      this.lastCursorY = event.offsetY;
      this.isDragged = true;
    },
    onMouseUpOrLeave() {
      this.isDragged = false;
    },
    getRect(rects: TaskRect[], x: number, y: number): TaskRect | null {
      this.localRects.find(
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
    onCanvasMove(event: MouseEvent) {
      var graph = this.$refs.graphBody as HTMLCanvasElement;

      if (!graph) return;

      if (event.type == "mousemove") {
        var rect = this.getRect(this.localRects, event.offsetX, event.offsetY);

        if (rect != null) {
          var task = this.tasks.find((x) => x.id == rect!.id);
          if (task) graph.title = task.name;
        }

        if (this.isDragged && this.canDragged) {
          this.xOffset += event.offsetX - this.lastCursorX;
          if (this.xOffset > 0) this.xOffset = 0;
          this.yOffset += event.offsetY - this.lastCursorY;
          if (this.yOffset < 0) this.yOffset = 0;
        }

        this.lastCursorX = event.offsetX;
        this.lastCursorY = event.offsetY;
      }

      this.$emit("mousemove", event);
    },
    onScroll(event: Event) {
      var div = event.target as HTMLDivElement;
      for (var innerDiv of document.getElementsByClassName(
        "graph-div"
      ) as HTMLCollectionOf<HTMLDivElement>) {
        innerDiv.scrollLeft = div.scrollLeft;
      }
    },
    drawRects(rects: TaskRect[], toUp: number, ctx: CanvasRenderingContext2D) {
      for (var rect of rects) {
        if (!rect.hidden) {
          let startX = this.graphOffsetX + this.xOffset;
          let startY = 280 - this.graphOffsetY + this.yOffset;

          ctx.strokeStyle = !rect.isCritical ? "#4F4752" : "#D66434";
          if (rect.isResourceExceeded) ctx.strokeStyle = "#8B0000";

          rect.x1 = startX + this.widthPer1 * rect.a;
          rect.y1 = startY - this.heightPer1 * (rect.resources + toUp);
          rect.x2 = rect.x1 + this.widthPer1 * (rect.b - rect.a);
          rect.y2 = rect.y1 + this.heightPer1 * rect.resources;
          if (rect.x1 < this.graphOffsetX) {
            rect.x1 = this.graphOffsetX;
            if (rect.x2 < this.graphOffsetX) {
              this.drawRects(rect.upperRects, toUp + rect.resources, ctx);
              continue;
            }
          }
          if (rect.y2 > 280 - this.graphOffsetY) {
            rect.y2 = 280 - this.graphOffsetY;
            if (rect.y1 > 280 - this.graphOffsetY) {
              this.drawRects(rect.upperRects, toUp + rect.resources, ctx);
              continue;
            }
          }

          ctx.strokeRect(
            rect.x1,
            rect.y1,
            rect.x2 - rect.x1,
            rect.y2 - rect.y1
          );
          ctx.fillStyle = !rect.isCritical ? "#4F475287" : "#D6643487";
          if (rect.isResourceExceeded) ctx.fillStyle = "#8B000087";
          ctx.fillRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
          var fontScale = rect.b - rect.a;
          if (fontScale > 1) {
            fontScale = 1;
          }
          ctx.font = `${14 * this.scale * fontScale}px serif`;
          ctx.fillText(
            `${rect.order + 1}`,
            (rect.x1 + rect.x2) / 2 -
              (String(rect.order + 1).length * 14 * this.scale * fontScale) / 5,
            (rect.y1 + rect.y2) / 2 + (14 * this.scale * fontScale) / 2
          );
        }

        this.drawRects(rect.upperRects, toUp + rect.resources, ctx);
      }
    },
    drawGraph(canvas: HTMLCanvasElement, rects: TaskRect[]) {
      var ctx = canvas.getContext("2d")!;

      canvas.height = this.height;
      canvas.width = this.width;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#cccccc"; // цвет линий сетки
      ctx.lineWidth = 0.5;

      for (
        let y = canvas.height - this.graphOffsetY;
        y >= -this.yOffset;
        y -= this.heightPer1
      ) {
        if (y + this.yOffset > canvas.height - this.graphOffsetY)
          continue;

        ctx.beginPath();
        ctx.moveTo(this.graphOffsetX, y + this.yOffset);
        ctx.lineTo(canvas.width, y + this.yOffset);
        ctx.stroke();
        ctx.closePath();
      }

      for (
        let y = canvas.height - this.graphOffsetY;
        y >= -this.yOffset;
        y -= this.heightPer1
      ) {
        if (y + this.yOffset <= canvas.height - this.graphOffsetY)
          ctx.fillText(
            `${Math.round(
              (canvas.height - this.graphOffsetY) / this.heightPer1 -
                y / this.heightPer1
            )}`,
            20,
            y + this.yOffset
          );
      }

      // Вертикальные линии
      for (let x = this.graphOffsetX; x <= canvas.width - this.xOffset; x += this.widthPer1) {
        if (x + this.xOffset < this.graphOffsetX)
          continue;

        ctx.beginPath();
        ctx.moveTo(x + this.xOffset, 0);
        ctx.lineTo(x + this.xOffset, canvas.height - this.graphOffsetY);
        ctx.stroke();
        ctx.closePath();
      }

      for (let x = this.graphOffsetX; x <= canvas.width - this.xOffset; x += this.widthPer1) {
        if (x + this.xOffset >= this.graphOffsetX)
          ctx.fillText(
            `${Math.round((x - this.graphOffsetX) / this.widthPer1)}`,
            x + this.xOffset,
            canvas.height - 20
          );
      }
      
      let text = "Ресурсы";
      for (var i = 0; i < text.length; i++) {
        ctx.fillText(text[i], 0, canvas.height / 2 - (text.length * 10 / 2) + i*10);
      }
      
      let text2 = "Время";
      ctx.fillText(text2, canvas.width / 2 - (text.length * 10 / 2), canvas.height - 5);

      ctx.strokeStyle = "#000"; // цвет линий сетки
      ctx.lineWidth = 1;
      for (var line of this.horizontalLines) {
        ctx.beginPath();
        ctx.moveTo(this.graphOffsetX + line * this.widthPer1 * this.scale, 0);
        ctx.lineTo(
          this.graphOffsetX + line * this.widthPer1 * this.scale,
          canvas.height - this.graphOffsetY
        );
        ctx.stroke();
        ctx.closePath();
      }

      // Далее идет ваш существующий код для рисования рамок и текста...

      this.drawRects(rects, 0, ctx);

      this.$emit("rectsDrawed", rects);
    },
  },
  watch: {
    rects: {
      handler: async function () {
        this.$nextTick(function () {
          this.localRects = deepcopy(this.rects);

          var graphBody = this.$refs.graphBody as HTMLCanvasElement;
          if (!graphBody) return;

          this.drawGraph(graphBody, this.localRects);
        });
      },
      deep: true,
    },
    xOffset() {
      this.$nextTick(function () {
        var graphBody = this.$refs.graphBody as HTMLCanvasElement;
        if (!graphBody) return;

        this.drawGraph(graphBody, this.localRects);
      });
    },
    yOffset() {
      this.$nextTick(function () {
        var graphBody = this.$refs.graphBody as HTMLCanvasElement;
        if (!graphBody) return;

        this.drawGraph(graphBody, this.localRects);
      });
    },
    scale() {
      this.$nextTick(function () {
        var graphBody = this.$refs.graphBody as HTMLCanvasElement;
        if (!graphBody) return;

        this.drawGraph(graphBody, this.localRects);
      });
    },
  },
});
</script>
