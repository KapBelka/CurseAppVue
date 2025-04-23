<template>
  <PageContainer>
    <div>
      <div class="d-flex align-items-center justify-content-between">
        <!-- <div class="d-flex">
        <input
          :disabled="storage.tasks.length > 0"
          v-model="projectKey"
          type="password"
          class="form-control"
          placeholder="Ключ к проекту"
          id="nameInput"
        />

        <button
          @click="loadProject()"
          type="button"
          class="btn btn-outline-primary c-pointer btn-add ms-2"
        >
          Ок
        </button>
        <input placeholder="Поиск" class="form-control py-2 search-field" type="text" style="background-color: #4F4752; border-radius: 20px; border: none; width: 400px; color: #fff"></input>
      </div> -->
        <div class="d-flex gap-3">
          <button
            v-show="storage.project"
            @click="addTask()"
            type="button"
            class="btn btn-outline-primary c-pointer btn-add"
          >
            Добавить
          </button>
          <!-- <button class="py-1 px-3 btn" style="color: #FFFFFF; font-size: 20px; border: 1px solid #FFFFFF; border-radius: 20px; background-color: #ffffff00; box-shadow: 0 0 1px 0px white inset, 0 0 1px 0px white">Изменить</button> -->
          <!-- <button class="py-1 px-3 btn" style="color: #FFFFFF; font-size: 20px; border: 1px solid #FFFFFF; border-radius: 20px; background-color: #ffffff00; box-shadow: 0 0 1px 0px white inset, 0 0 1px 0px white">Удалить</button> -->
        </div>
      </div>
      <div
        v-show="storage.project"
        class="mt-5 py-3"
        style="background-color: #fff; border-radius: 20px; font-size: 14px"
      >
        <div class="px-3" style="overflow-y: auto; max-height: 360px">
          <div
            class="row pb-2 border-bottom"
            style="position: sticky; top: 0; background-color: #fff"
          >
            <div class="fw-500" style="width: 100px">Номер задачи</div>
            <div class="fw-500" style="width: 600px">Название</div>
            <div class="fw-500" style="width: 60px">Срок</div>
            <div class="fw-500" style="width: 130px">Предыдущие задачи</div>
            <div class="fw-500" style="width: 80px">Ресурсы</div>
            <div class="fw-500" style="width: 80px">Раннее начало</div>
            <div class="fw-500" style="width: 100px">Раннее окончание</div>
            <div class="fw-500" style="width: 80px">Позднее начало</div>
            <div class="fw-500" style="width: 100px">Позднее окончание</div>
            <div class="fw-500" style="width: 90px">Полный резерв</div>
            <div class="fw-500" style="width: 80px">Свободный резерв</div>
          </div>
          <div
            class="row border-top row-hover py-1"
            style="border-color: #4f4752"
            v-for="(task, index) in tasks.sort(x => x.order)"
          >
            <div style="width: 100px">
              {{ task.order + 1 }}
              <i
                @click="updateTask(task)"
                class="bi-pencil ms-2"
                style="cursor: pointer"
              ></i>
              <i
                @click="deleteTask(task.id)"
                class="bi-trash ms-2"
                style="cursor: pointer"
              ></i>
              <i 
                @click="moveUpTask(task)" 
                class="bi bi-caret-up-square"
                style="cursor: pointer"
              ></i>
              <i 
                @click="moveDownTask(task)" 
                class="bi bi-caret-down-square"
                style="cursor: pointer"
              ></i>
            </div>
            <div style="width: 600px">{{ task.name }}</div>
            <div style="width: 60px">{{ task.duration }}</div>
            <div style="width: 130px">{{ tasks.filter(x => task.needProjectTasksIds.includes(x.id)).map(x => x.order + 1).join("; ") }}</div>
            <div style="width: 80px">
              {{
                getCalculatedTask(task).resources.reduce(
                  (a, b) => a + b.count,
                  0
                )
              }}
            </div>
            <div style="width: 80px">
              {{ getCalculatedTask(task).earlyStart }}
            </div>
            <div style="width: 100px">
              {{ getCalculatedTask(task).earlyEnd }}
            </div>
            <div style="width: 80px">
              {{ getCalculatedTask(task).lateStart }}
            </div>
            <div style="width: 100px">
              {{ getCalculatedTask(task).lateEnd }}
            </div>
            <div style="width: 90px">
              {{ getCalculatedTask(task).fullReserv }}
            </div>
            <div style="width: 80px">{{ getCalculatedTask(task).reserv }}</div>
          </div>
        </div>
      </div>
      <div class="mt-5 d-flex gap-3" v-if="projectLoaded">
        <div
          style="
            background-color: #4f4752;
            border-radius: 20px;
            font-size: 14px;
            flex: 1;
          "
        >
          <div class="px-4 py-2" style="color: #fff">
            График Ранний
          </div>
          <div
            class="px-3"
            style="
              background-color: #fff;
              border-radius: 20px;
              box-shadow: 0 -8px 12px #00000029;
            "
          >
            <div
              class="example-div d-flex"
              @scroll="onScroll"
              style="overflow-x: auto; width: 500px"
            >
              <canvas
                class="d-block"
                style="position: sticky; left: 0"
                id="example11"
              ></canvas
              ><canvas class="d-block" id="example"></canvas>
            </div>
          </div>
        </div>
        <div
          style="
            background-color: #4f4752;
            border-radius: 20px;
            font-size: 14px;
            flex: 1;
          "
        >
          <div class="px-4 py-2" style="color: #fff">
            График Поздний
          </div>
          <div
            class="px-3"
            style="
              background-color: #fff;
              border-radius: 20px;
              box-shadow: 0 -8px 12px #00000029;
            "
          >
            <div
              class="example-div d-flex"
              @scroll="onScroll"
              style="overflow-x: auto; width: 500px"
            >
              <canvas
                class="d-block"
                style="position: sticky; left: 0"
                id="example21"
              ></canvas
              ><canvas class="d-block" id="example2"></canvas>
            </div>
          </div>
        </div>
        <div
          style="
            background-color: #4f4752;
            border-radius: 20px;
            font-size: 14px;
            flex: 1;
          "
        >
          <div class="px-4 py-2" style="color: #fff">График Скорректированный</div>
          <div
            class="px-3"
            style="
              background-color: #fff;
              border-radius: 20px;
              box-shadow: 0 -8px 12px #00000029;
            "
          >
            <div
              class="example-div d-flex"
              @scroll="onScroll"
              style="overflow-x: auto; width: 500px"
            >
              <canvas
                class="d-block"
                style="position: sticky; left: 0"
                id="example31"
              ></canvas
              ><canvas 
                @mousemove="onCanvasClick($event)"
                @mousedown="onCanvasClick($event)"
                @mouseup="onCanvasClick($event)"
                @mouseleave="onCanvasClick($event)"
                class="d-block" id="example3"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddTaskModal
      :showModal="showAddTaskModal"
      @close="showAddTaskModal = false"
    />
    <UpdateTaskModal
      :showModal="showUpdateTaskModal"
      :selectedTask="selectedTask"
      @close="showUpdateTaskModal = false"
    />
  </PageContainer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../store/index";
import AddTaskModal from "./modals/AddTaskModal.vue";
import UpdateTaskModal from "./modals/UpdateTaskModal.vue";
import {
  calculatedTasksRectsEarly,
  calculatedTasksRectsLate,
  calculatedTasksRectsNormal,
  TaskRect,
} from "../store/taskCalculator";
import PageContainer from "../../../components/pageContainer/page-container.vue";
import { ResourceKindDto, TaskDto } from "../../../services/projects/dtos/project-dto";

export default defineComponent({
  components: {
    AddTaskModal,
    UpdateTaskModal,
    PageContainer
  },
  data() {
    return {
      editable: false,
      storage: storage.getInstance(),
      selectedResourceKindId: null as string | null,
      showAddTaskModal: false,
      showUpdateTaskModal: false,
      selectedTask: null as null | TaskDto,
      taskForMove: null as null | TaskDto,
      normalRects: [] as TaskRect[],
      lastMouseX: null as number | null
    };
  },
  methods: {
    getRect(rects: TaskRect[], x: number, y: number): TaskRect | null {
      this.normalRects.find(i => x >= i.x1! && x <= i.x2! && y >= i.y1! && y <= i.y2!)
      
      var findedRect: TaskRect | null = null;

      for (var rect of rects) {
        findedRect = rect.upperRects.find(i => x >= i.x1! && x <= i.x2! && y >= i.y1! && y <= i.y2!) ?? null
        if (findedRect)
          return findedRect

        findedRect = this.getRect(rect.upperRects, x, y)
        if (findedRect)
          return findedRect
      }

      return findedRect;
    },
    onCanvasClick(event: MouseEvent) {
      if (event.type == 'mousedown') {
        var rect = this.getRect(this.normalRects, event.offsetX, event.offsetY)
        
        if (rect != null) {
          this.taskForMove = this.tasks.find(x => x.id == rect!.id)!
        }

        this.lastMouseX = event.offsetX
      }

      if (event.type == 'mouseup' || event.type == 'mouseleave') {
        
        if (this.taskForMove)
          this.storage.updateTaskOptimizedTime({ id: this.taskForMove.id, start: this.taskForMove.optimizedStart!, end: this.taskForMove.optimizedEnd! })

        this.taskForMove = null

        this.lastMouseX = event.offsetX

        var example3 = document.getElementById(
          "example3"
        ) as HTMLCanvasElement;
        if (!example3) return;
        this.normalRects = calculatedTasksRectsNormal(this.tasks.filter(x => x.optimizedStart != null && x.optimizedEnd != null))
        this.drawGraph(
          example3,
          this.normalRects
        );
      }

      if (event.type == 'mousemove') {
        if (this.taskForMove) {
          if (Math.abs(event.offsetX - this.lastMouseX!) >= 20) {
            if ((event.offsetX - this.lastMouseX!) > 0) {
              if (this.taskForMove.optimizedEnd + 1 <= this.taskForMove.lateEnd) {
                this.taskForMove.optimizedStart += 1
                this.taskForMove.optimizedEnd += 1
              }
            }
            else { 
              if (this.taskForMove.optimizedStart - 1 >= this.taskForMove.earlyStart) {
                this.taskForMove.optimizedStart -= 1
                this.taskForMove.optimizedEnd -= 1
              }
            }

            var example3 = document.getElementById(
              "example3"
            ) as HTMLCanvasElement;
            if (!example3) return;
            this.normalRects = calculatedTasksRectsNormal(this.tasks.filter(x => x.optimizedStart != null && x.optimizedEnd != null))
            this.drawGraph(
              example3,
              this.normalRects
            );
            

            this.lastMouseX = event.offsetX
          }
        }
      }
    },
    onScroll(event: Event) {
      var div = event.target as HTMLDivElement;
      for (var innerDiv of document.getElementsByClassName(
        "example-div"
      ) as HTMLCollectionOf<HTMLDivElement>) {
        innerDiv.scrollLeft = div.scrollLeft;
      }
    },
    getCalculatedTask(task: TaskDto) {
      return this.tasks.find((x) => x.id == task.id)!;
    },
    criticalTasks() {
      var tasks = this.tasks.filter(
        (x) => this.isCritical(x) && x.duration
      );
      var newTasks = [] as TaskDto[];
      for (var task of tasks) {
        if (
          newTasks.some(
            (x) =>
              x.earlyStart == task.earlyStart && x.earlyEnd == task.earlyEnd
          )
        )
          continue;

        newTasks.push(task);
      }
      return newTasks;
    },
    criticalTasksLate() {
      var tasks = this.tasks.filter(
        (x) => this.isCritical(x) && x.duration
      );
      var newTasks = [] as TaskDto[];
      for (var task of tasks) {
        if (
          newTasks.some(
            (x) => x.lateStart == task.lateStart && x.lateEnd == task.lateEnd
          )
        )
          continue;

        newTasks.push(task);
      }
      return newTasks;
    },
    addTask() {
      this.showAddTaskModal = true;
    },
    deleteTask(taskId: string) {
      this.storage.deleteTask({ taskId });
    },
    updateTask(task: TaskDto) {
      this.showUpdateTaskModal = true;
      this.selectedTask = task;
    },
    moveUpTask(task: TaskDto) {
      this.storage.moveUpTask(task)
    },
    moveDownTask(task: TaskDto) {
      this.storage.moveDownTask(task)
    },
    isCritical(task: TaskDto): string {
      if (task.earlyEnd == task.lateEnd && task.earlyStart == task.lateStart)
        return "*";
      return "";
    },
    maxEnd() {
      return Math.max(...this.tasks.map((x) => x.earlyEnd!), 0);
    },
    drawRects(rects: TaskRect[], toUp: number, ctx: CanvasRenderingContext2D) {
      for (var rect of rects) {
        let widthFor1 = 20;
        let heightFor1 = 20;
        let startX = 5;
        let startY = 240;
        ctx.strokeStyle = toUp ? "#4F4752" : "#D66434";

        rect.x1 = startX + widthFor1 * rect.a
        rect.y1 = startY - heightFor1 * (rect.resources + toUp)
        rect.x2 = rect.x1 + widthFor1 * (rect.b - rect.a)
        rect.y2 = rect.y1 + heightFor1 * rect.resources

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
          '',// `${rect.id}`,
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

      if (this.taskForMove) {
        ctx.strokeStyle = "#D66434";
        ctx.lineWidth = 1;
        ctx.moveTo(5 + this.taskForMove.earlyStart * 20, 0)
        ctx.lineTo(5 + this.taskForMove.earlyStart * 20, canvas.height - 40)

        ctx.moveTo(5 + this.taskForMove.lateEnd * 20, 0)
        ctx.lineTo(5 + this.taskForMove.lateEnd * 20, canvas.height - 40)
      }
      // for (var i = 0; i < ((canvas.height) / 20) - 2; i++) {
      //   ctx.fillText(`${canvas.height / 20 - i - 3}`, 5, 25 + 20 * i);
      // }

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
    resourceKinds(): ResourceKindDto[] {
      return this.storage.resourceKinds;
    },
    projectLoaded(): boolean {
      return this.storage.project != null;
    },
  },
  watch: {
    // calculatedTasks: {
    //   handler: function () {
    //     var example = document.getElementById("example") as HTMLCanvasElement;
    //     if (!example) return;

    //     this.drawGraph(
    //       example,
    //       calculatedTasksRectsEarly(this.calculatedTasks)
    //     );

    //     var example11 = document.getElementById(
    //       "example11"
    //     ) as HTMLCanvasElement;
    //     if (!example11) return;
    //     this.drawHead(example11);

    //     var example2 = document.getElementById("example2") as HTMLCanvasElement;
    //     if (!example2) return;
    //     this.drawGraph(
    //       example2,
    //       calculatedTasksRectsLate(this.calculatedTasks)
    //     );

    //     var example21 = document.getElementById(
    //       "example21"
    //     ) as HTMLCanvasElement;
    //     if (!example21) return;
    //     this.drawHead(example21);

    //     var example3 = document.getElementById("example3") as HTMLCanvasElement;
    //     if (!example3) return;
    //     this.drawGraph(
    //       example3,
    //       calculatedTasksRectsNormal(this.calculatedTasks)
    //     );

    //     var example31 = document.getElementById(
    //       "example31"
    //     ) as HTMLCanvasElement;
    //     if (!example31) return;
    //     this.drawHead(example31);
    //   },
    //   deep: true,
    // },
    projectLoaded: {
      handler: async function () {
        this.$nextTick(function () {
          var example = document.getElementById("example") as HTMLCanvasElement;
          if (!example) return;

          this.drawGraph(
            example,
            calculatedTasksRectsEarly(this.tasks)
          );

          var example11 = document.getElementById(
            "example11"
          ) as HTMLCanvasElement;
          if (!example11) return;
          this.drawHead(example11);

          var example2 = document.getElementById(
            "example2"
          ) as HTMLCanvasElement;
          if (!example2) return;
          this.drawGraph(
            example2,
            calculatedTasksRectsLate(this.tasks)
          );

          var example21 = document.getElementById(
            "example21"
          ) as HTMLCanvasElement;
          if (!example21) return;
          this.drawHead(example21);

          var example3 = document.getElementById(
            "example3"
          ) as HTMLCanvasElement;
          if (!example3) return;
          this.normalRects = calculatedTasksRectsNormal(this.tasks.filter(x => x.optimizedStart != null && x.optimizedEnd != null))
          this.drawGraph(
            example3,
            this.normalRects
          );

          var example31 = document.getElementById(
            "example31"
          ) as HTMLCanvasElement;
          if (!example31) return;
          this.drawHead(example31);
        });
      },
      deep: true,
    },
  },
  async mounted() {
    var id = this.$route.params.id as string;
    await this.storage.loadProject({ id: id });
  },
});
</script>

<style>
.c-pointer {
  cursor: pointer;
}

.bg-gray {
  background-color: lightgray;
}

.fw-500 {
  font-weight: 500;
}

.row-hover:hover {
  background-color: lightgray;
}

/* width */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px lightblue;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: lightskyblue;
  border-radius: 10px;
}

.app-icon {
  background-image: url("data:image/svg+xml,%3Csvg width='76' height='76' viewBox='0 0 76 76' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Crect x='21' y='16' width='37' height='12' fill='url(%23pattern0_44_108)'/%3E%3Crect x='21' y='42' width='27' height='12' fill='url(%23pattern1_44_108)'/%3E%3Cpath d='M33.0238 41.1667V53.8333M45.6904 15.8333V28.5M7.69043 9.5V60.1667C7.69043 61.8464 8.35769 63.4573 9.54542 64.645C10.7332 65.8327 12.3441 66.5 14.0238 66.5H64.6904M23.5238 41.1667H45.6904C47.4393 41.1667 48.8571 42.5844 48.8571 44.3333V50.6667C48.8571 52.4156 47.4393 53.8333 45.6904 53.8333H23.5238C21.7749 53.8333 20.3571 52.4156 20.3571 50.6667V44.3333C20.3571 42.5844 21.7749 41.1667 23.5238 41.1667ZM23.5238 15.8333H55.1904C56.9393 15.8333 58.3571 17.2511 58.3571 19V25.3333C58.3571 27.0822 56.9393 28.5 55.1904 28.5H23.5238C21.7749 28.5 20.3571 27.0822 20.3571 25.3333V19C20.3571 17.2511 21.7749 15.8333 23.5238 15.8333Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cdefs%3E%3Cpattern id='pattern0_44_108' patternContentUnits='objectBoundingBox' width='0.432432' height='0.666667'%3E%3Cuse xlink:href='%23image0_44_108' transform='scale(0.00108108 0.00333333)'/%3E%3C/pattern%3E%3Cpattern id='pattern1_44_108' patternContentUnits='objectBoundingBox' width='0.592593' height='0.666667'%3E%3Cuse xlink:href='%23image0_44_108' transform='scale(0.00148148 0.00333333)'/%3E%3C/pattern%3E%3Cimage id='image0_44_108' width='400' height='200' xlink:href='data:image/png;base64,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'/%3E%3C/defs%3E%3C/svg%3E%0A");
}
.search-field::placeholder {
  color: #888;
  opacity: 1; /* Firefox */
}

.btn-add {
  color: #d66434;
  font-size: 20px;
  border-radius: 20px;
  border: 1px solid #d66434;
  box-shadow: 0 0 1px 0px #d66434 inset, 0 0 1px 0px #d66434;
}

.btn-add:hover {
  color: #fff;
  background-color: #d66434;
  border: 1px solid #d66434;
  box-shadow: 0 0 1px 0px #d66434 inset, 0 0 1px 0px #d66434;
}

.btn-add:active {
  color: #fff;
  background-color: #9c4926 !important;
}

.form-control,
.input-group,
.btn,
.form-select {
  border-radius: 20px;
}
</style>
