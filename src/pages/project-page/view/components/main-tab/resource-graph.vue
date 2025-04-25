<template>
  <div
    style="
      background-color: #4f4752;
      border-radius: 20px;
      font-size: 16px;
      flex: 1;
    "
    :class="{ 'c-pointer': hasCursor }"
  >
    <div class="px-4 py-2" style="color: #fff">{{ title }}</div>
    <div
      class="px-3"
      style="
        background-color: #fff;
        border-radius: 20px;
        box-shadow: 0 -8px 12px #00000029;
      "
    >
      <div
        class="graph-div d-flex"
        @scroll="onScroll"
        style="overflow-x: auto; width: 500px"
      >
        <canvas
          ref="graphHead"
          class="d-block"
          style="position: sticky; left: 0"
        ></canvas
        ><canvas
          @mousemove="onCanvasMove($event)"
          @mousedown="$emit('mousedown', $event)"
          @mouseup="$emit('mouseup', $event)"
          @mouseleave="$emit('mouseleave', $event)"
          class="d-block"
          ref="graphBody"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import storage from "../../../store/index";
import { TaskRect } from "../../../store/taskCalculator";
import { TaskDto } from "../../../../../services/projects/dtos/project-dto";

export default defineComponent({
  components: {},
  props: {
    rects: { type: Array as PropType<TaskRect[]>, default: [] },
    title: { type: String, required: true },
    hasCursor: { type: Boolean, default: false },
    horizontalLines: { type: Array as PropType<number[]>, default: [] },
  },
  data() {
    return {
      storage: storage.getInstance(),
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
    onCanvasMove(event: MouseEvent) {
      var graph = this.$refs.graphBody as HTMLCanvasElement;

      if (!graph) return;

      if (event.type == "mousemove") {
        var rect = this.getRect(this.rects, event.offsetX, event.offsetY);

        if (rect != null) {
          var task = this.tasks.find((x) => x.id == rect!.id)!;
          graph.title = task.name;
        }
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
        let widthFor1 = 20;
        let heightFor1 = 20;
        let startX = 5;
        let startY = 240;
        ctx.strokeStyle = toUp ? "#4F4752" : "#D66434";

        rect.x1 = startX + widthFor1 * rect.a;
        rect.y1 = startY - heightFor1 * (rect.resources + toUp);
        rect.x2 = rect.x1 + widthFor1 * (rect.b - rect.a);
        rect.y2 = rect.y1 + heightFor1 * rect.resources;

        ctx.strokeRect(
          rect.x1,
          rect.y1,
          widthFor1 * (rect.b - rect.a),
          heightFor1 * rect.resources
        );
        ctx.fillStyle = toUp ? "#4F475287" : "#D6643487";
        ctx.fillRect(
          rect.x1,
          rect.y1,
          widthFor1 * (rect.b - rect.a),
          heightFor1 * rect.resources
        );
        ctx.fillText(
          `${rect.order + 1}`,
          startX + widthFor1 * rect.a + (widthFor1 * (rect.b - rect.a)) / 2 - 3,
          startY - heightFor1 * (rect.resources / 2 + toUp) + 5
        );

        this.drawRects(rect.upperRects, toUp + rect.resources, ctx);
      }
    },
    drawGraph(canvas: HTMLCanvasElement, rects: TaskRect[]) {
      var ctx = canvas.getContext("2d")!;
      canvas.height = 280;
      canvas.width = 20 * rects.reduce((a, b) => (b.b > a ? b.b : a), 0) + 100;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#4F4752";
      ctx.lineWidth = 0.4;
      ctx.beginPath();

      ctx.font = "14px serif";

      for (var i = 0; i < canvas.height / 20 - 1; i++) {
        ctx.moveTo(5, i * 20);
        ctx.lineTo(canvas.width - 20, i * 20);
      }

      ctx.stroke();

      ctx.closePath();

      ctx.beginPath();

      ctx.strokeStyle = "#D66434";
      ctx.lineWidth = 1;

      for (var line of this.horizontalLines) {
        ctx.moveTo(5 + line * 20, 0);
        ctx.lineTo(5 + line * 20, canvas.height - 40);
      }

      for (var i = 0; i < canvas.width / 20 - 2; i++) {
        ctx.fillText(`${i}`, 2 + 20 * i, 265);
      }

      ctx.stroke();

      ctx.closePath();

      this.drawRects(rects, 0, ctx);
    },
    drawHead(canvas: HTMLCanvasElement) {
      var ctx = canvas.getContext("2d")!;
      canvas.height = 280;
      canvas.width = 20;
      ctx.font = "14px serif";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000000";
      for (var i = 0; i < canvas.height / 20 - 2; i++) {
        ctx.fillText(`${canvas.height / 20 - i - 3}`, 5, 25 + 20 * i);
      }

      ctx.stroke();
    },
  },
  computed: {
    tasks(): TaskDto[] {
      return this.storage.tasks;
    },
  },
  watch: {
    rects: {
      handler: async function () {
        this.$nextTick(function () {
          var graphBody = this.$refs.graphBody as HTMLCanvasElement;
          if (!graphBody) return;

          this.drawGraph(graphBody, this.rects);

          var graphHead = this.$refs.graphHead as HTMLCanvasElement;
          if (!graphHead) return;
          this.drawHead(graphHead);
        });
      },
      deep: true,
    },
  },
});
</script>
