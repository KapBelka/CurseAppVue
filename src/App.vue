<template>
  <div class="app p-4">
    <div class="row" style="width: 100%; font-size: 14px">
      <div>
        <h5>Задачи</h5>
        <div class="row">
          <div class="fw-500" style="width: 100px">Номер</div>
          <div class="fw-500" style="width: 400px">Название</div>
          <div class="fw-500" style="width: 60px">Прод.</div>
          <div class="fw-500" style="width: 170px">Задачи</div>
          <div class="fw-500" style="width: 80px">Ресурс</div>
          <div class="fw-500" style="width: 40px">Р.Н.</div>
          <div class="fw-500" style="width: 40px">Р.О.</div>
          <div class="fw-500" style="width: 40px">П.Н.</div>
          <div class="fw-500" style="width: 40px">П.О.</div>
          <div class="fw-500" style="width: 80px">п. рез</div>
          <div class="fw-500" style="width: 80px">с. рез</div>
        </div>
        <div class="row border row-hover" v-for="task in tasks">
          <div style="width: 100px">
            {{ task.id }}
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
          </div>
          <div style="width: 400px">{{ task.name }}</div>
          <div style="width: 60px">{{ task.duration }}</div>
          <div style="width: 170px">{{ task.needTasksIds }}</div>
          <div style="width: 80px">{{ getCalculatedTask(task).power }}</div>
          <div style="width: 40px">
            {{ getCalculatedTask(task).earlyStart }}
          </div>
          <div style="width: 40px">{{ getCalculatedTask(task).earlyEnd }}</div>
          <div style="width: 40px">{{ getCalculatedTask(task).lateStart }}</div>
          <div style="width: 40px">{{ getCalculatedTask(task).lateEnd }}</div>
          <div style="width: 80px">
            {{ getCalculatedTask(task).fullReserv }}
          </div>
          <div style="width: 80px">{{ getCalculatedTask(task).reserv }}</div>
        </div>
        <button class="btn btn-primary mt-2" @click="addTask()">
          Добавить
        </button>
      </div>
      <!-- <div class="col-7 mt-4">
        <div class="row mt-2" style="width:92.7%">
          <div class="col-4 fw-500">Название *крит.</div>
          <div class="col-1 fw-500">Длит.</div>
          <div class="col-1 fw-500">Р.Н.</div>
          <div class="col-1 fw-500">Р.О.</div>
          <div class="col-1 fw-500">П.Н.</div>
          <div class="col-1 fw-500">П.О.</div>
          <div class="col-1 fw-500">п. рез</div>
          <div class="col-1 fw-500">с. рез</div>
        </div>
        <div class="row border row-hover" style="width:92.7%" v-for="task in calculatedTasks">
          <div class="col-4">{{ task.name }} {{ isCritical(task) }}</div>
          <div class="col-1">{{ task.duration }}</div>
          <div class="col-1">{{ task.earlyStart }}</div>
          <div class="col-1">{{ task.earlyEnd }}</div>
          <div class="col-1">{{ task.lateStart }}</div>
          <div class="col-1">{{ task.lateEnd }}</div>
          <div class="col-1">{{ task.fullReserv }}</div>
          <div class="col-1">{{ task.reserv }}</div>
        </div>
      </div> -->
    </div>
    <div class="mt-3 mb-3" style="width: 400px">
      <select v-model="selectedResourceKindId" class="form-select">
        <option :value="null" :selected="selectedResourceKindId == null">
          Все виды ресурсов
        </option>
        <option
          :value="resourceKind.id"
          :selected="selectedResourceKindId == resourceKind.id"
          v-for="resourceKind in resourceKinds"
        >
          {{ resourceKind.id }} {{ resourceKind.name }}
        </option>
      </select>
    </div>
    <div class="d-flex">
      <div>
        <div
          :style="`height: ${
            getEarlyMaxHeight() * 15 + 20
          }px;border-left: 1px solid black;`"
        >
          <div
            v-for="i in getEarlyMaxHeight() + 1"
            :style="`border-bottom: 1px solid black;
            width: 10px;
            position: absolute;
            margin-left: -5px;
            margin-top: ${15 * (i - 1) + 20}px;`"
          >
            <div
              style="
                position: absolute;
                font-size: 10px;
                margin-top: -8px;
                margin-left: -10px;
              "
            >
              {{ getEarlyMaxHeight() - i + 1 }}
            </div>
          </div>
        </div>
        <div
          :style="`height: ${
            getLateMaxHeight() * 15 + 20
          }px;border-left: 1px solid black;margin-top: 16px;`"
        >
          <div
            v-for="i in getLateMaxHeight() + 1"
            :style="`border-bottom: 1px solid black;
            width: 10px;
            position: absolute;
            margin-left: -5px;
            margin-top: ${15 * (i - 1) + 20}px;`"
          >
            <div
              style="
                position: absolute;
                font-size: 10px;
                margin-top: -8px;
                margin-left: -10px;
              "
            >
              {{ getLateMaxHeight() - i + 1 }}
            </div>
          </div>
        </div>
      </div>
      <div style="font-size: 12px; overflow-x: auto">
        <div
          class="d-flex align-items-end"
          :style="`height: ${getEarlyMaxHeight() * 15 + 20}px;`"
        >
          <div
            v-for="criticalTask in criticalTasks()"
            :style="`min-width: ${criticalTask.duration * 20}px;max-width: ${
              criticalTask.duration * 20
            }px;`"
          >
            <GraphPart
              :a="criticalTask.earlyStart!"
              :b="criticalTask.earlyEnd!"
              :resourceKindId="selectedResourceKindId"
              :processedTaskIds="criticalTasks().map((x) => x.id)"
            />
            <div
              :title="criticalTask.name"
              class="d-flex align-items-center justify-content-center c-pointer"
              :style="`height: ${getPower(criticalTask) * 15}px; width: ${
                criticalTask.duration * 20
              }px; border: 1px solid black;`"
            >
              {{ criticalTask.id }}
            </div>
          </div>
        </div>
        <div
          :style="`width: ${
            maxEnd() * 20
          }px; border-bottom: 1px solid black; display: flex; margin-bottom: 16px; position: relative;`"
        >
          <div
            :style="`
              position: absolute;
              height: 10px;
              border-left: 1px solid black;
              margin-top: -5px;
              margin-left: ${20 * (i - 1)}px;
            `"
            v-for="i in maxEnd() + 1"
          >
            <div
              style="
                position: absolute;
                font-size: 10px;
                margin-top: 10px;
                margin-left: -8px;
              "
            >
              {{ i - 1 }}
            </div>
          </div>
        </div>

        <div
          class="d-flex align-items-end"
          :style="` height: ${getLateMaxHeight() * 15 + 20}px;`"
        >
          <div
            v-for="criticalTask in criticalTasksLate()"
            :style="`min-width: ${criticalTask.duration * 20}px;max-width: ${
              criticalTask.duration * 20
            }px;`"
            class="d-flex align-items-end flex-column"
          >
            <GraphPartLate
              :a="criticalTask.lateStart!"
              :b="criticalTask.lateEnd!"
              :resourceKindId="selectedResourceKindId"
              :processedTaskIds="criticalTasksLate().map((x) => x.id)"
            />
            <div
              :title="criticalTask.name"
              class="d-flex align-items-center justify-content-center c-pointer"
              :style="`height: ${getPower(criticalTask) * 15}px; width: ${
                criticalTask.duration * 20
              }px; border: 1px solid black;`"
            >
              {{ criticalTask.id }}
            </div>
          </div>
        </div>
        <div
          :style="`width: ${
            maxEnd() * 20
          }px; border-bottom: 1px solid black; display: flex; margin-bottom: 24px; position: relative;`"
        >
          <div
            :style="`
              position: absolute;
              height: 10px;
              border-left: 1px solid black;
              margin-top: -5px;
              margin-left: ${20 * (i - 1)}px;
            `"
            v-for="i in maxEnd() + 1"
          >
            <div
              style="
                position: absolute;
                font-size: 10px;
                margin-top: 10px;
                margin-left: -8px;
              "
            >
              {{ i - 1 }}
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
      @close="showUpdateTaskModal = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "./store/index";
import Task, { CalculatedTask } from "./store/dto/task";
import AddTaskModal from "./modals/AddTaskModal.vue";
import UpdateTaskModal from "./modals/UpdateTaskModal.vue";
import GraphPart from "./components/GraphPart/GraphPart.vue";
import GraphPartLate from "./components/GraphPart/GraphPartLate.vue";
import ResourceKind from "./store/dto/resource-kind";

export default defineComponent({
  components: {
    AddTaskModal,
    UpdateTaskModal,
    GraphPart,
    GraphPartLate,
  },
  data() {
    return {
      editable: false,
      storage: storage.getInstance(),
      selectedResourceKindId: null as Number | null,
      showAddTaskModal: false,
      showUpdateTaskModal: false,
    };
  },
  methods: {
    getEarlyMaxHeight() {
      var max1 = 0;
      for (var i = 0; i < this.maxEnd(); i++) {
        max1 = Math.max(
          max1,
          this.calculatedTasks
            .filter((x) => x.earlyStart! <= i && x.earlyEnd! > i)
            .map((x) => x.power)
            .reduce((a, b) => a + b, 0)
        );
      }
      return max1;
    },
    getLateMaxHeight() {
      var max2 = 0;
      for (var i = 0; i < this.maxEnd(); i++) {
        max2 = Math.max(
          max2,
          this.calculatedTasks
            .filter((x) => x.lateStart! < i && x.lateEnd! >= i)
            .map((x) => x.power)
            .reduce((a, b) => a + b, 0)
        );
      }
      return max2;
    },
    getPower(task: CalculatedTask) {
      if (this.selectedResourceKindId != null)
        return (
          task.resources.find(
            (x) => x.resourceKindId == this.selectedResourceKindId
          )?.count ?? 0
        );
      return task.power;
    },
    getCalculatedTask(task: Task) {
      return this.calculatedTasks.find((x) => x.id == task.id)!;
    },
    criticalTasks() {
      var tasks = this.calculatedTasks.filter(
        (x) => this.isCritical(x) && x.duration
      );
      var newTasks = [] as CalculatedTask[];
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
      var tasks = this.calculatedTasks.filter(
        (x) => this.isCritical(x) && x.duration
      );
      var newTasks = [] as CalculatedTask[];
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
    deleteTask(taskId: number) {
      this.storage.deleteTask(taskId);
    },
    updateTask(task: Task) {
      this.storage.selectTask(task);
      this.showUpdateTaskModal = true;
    },
    isCritical(task: CalculatedTask): string {
      if (task.earlyEnd == task.lateEnd && task.earlyStart == task.lateStart)
        return "*";
      return "";
    },
    maxEnd() {
      return Math.max(...this.calculatedTasks.map((x) => x.earlyEnd!), 0);
    },
  },
  computed: {
    tasks(): Task[] {
      return this.storage.tasks;
    },
    calculatedTasks(): CalculatedTask[] {
      return this.storage.calculatedTasks;
    },
    resourceKinds(): ResourceKind[] {
      return this.storage.resourceKinds;
    },
  },
  mounted() {
    this.storage.initialiseStore();
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
</style>
