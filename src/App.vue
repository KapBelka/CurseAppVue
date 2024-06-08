<template>
  <div class="app p-4">
    <div class="row" style="width: 100%">
      <div class="col-5">
        <h5>Задачи</h5>
        <div class="row">
          <div class="col-1 fw-500">Номер</div>
          <div class="col-5 fw-500">Название</div>
          <div class="col-2 fw-500">Прод.</div>
          <div class="col-2 fw-500">Задачи</div>
          <div class="col-2 fw-500">Ресурс</div>
        </div>
        <div class="row border row-hover" v-for="job in tasks">
          <div class="col-1">
            {{ job.id
            }}<a @click="deleteTask(job.id)" class="ms-2" style="cursor: pointer">У</a>
            <a @click="updateTask(job)" class="ms-2" style="cursor: pointer">И</a>
          </div>
          <div class="col-5">{{ job.name }}</div>
          <div class="col-1">{{ job.duration }}</div>
          <div class="col-3">{{ job.needTasksIds }}</div>
          <div class="col-2">{{ job.power }}</div>
        </div>
        <button class="btn btn-primary mt-2" @click="addTask()">Добавить</button>
      </div>
      <div class="col-7 mt-4">
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
        <div class="row border row-hover" style="width:92.7%" v-for="job in calculatedTasks">
          <div class="col-4">{{ job.name }} {{ isCritical(job) }}</div>
          <div class="col-1">{{ job.duration }}</div>
          <div class="col-1">{{ job.earlyStart }}</div>
          <div class="col-1">{{ job.earlyEnd }}</div>
          <div class="col-1">{{ job.lateStart }}</div>
          <div class="col-1">{{ job.lateEnd }}</div>
          <div class="col-1">{{ job.fullReserv }}</div>
          <div class="col-1">{{ job.reserv }}</div>
        </div>
      </div>
    </div>
    <div style="font-size: 12px; overflow-x: auto;">
      <button class="btn btn-secondary" @click="optimize()">click</button>
      <div class="d-flex align-items-end" :style="`height: ${20}vh;padding-bottom: 10px`">
        <div v-for="criticalTask in criticalTasks()"
          :style="`min-width: ${criticalTask.duration * 20}px;max-width: ${criticalTask.duration * 20}px;`">
          <GraphPart :a="criticalTask.earlyStart!" :b="criticalTask.earlyEnd!"
            :processedTaskIds="criticalTasks().map(x => x.id)" />
          <div :title="criticalTask.name" class="d-flex align-items-center justify-content-center c-pointer"
            :style="`height: ${criticalTask.power * 15}px; width: ${criticalTask.duration * 20}px; border: 1px solid black;`">
            {{ criticalTask.id }}</div>
        </div>
      </div>


      <div class="d-flex align-items-end" :style="` height: ${20}vh;padding-bottom: 10px`">
        <div v-for="criticalTask in criticalTasksLate()"
          :style="`min-width: ${criticalTask.duration * 20}px;max-width: ${criticalTask.duration * 20}px;`"
          class="d-flex align-items-end flex-column">
          <GraphPartLate :a="criticalTask.lateStart!" :b="criticalTask.lateEnd!"
            :processedTaskIds="criticalTasksLate().map(x => x.id)" />
          <div :title="criticalTask.name" class="d-flex align-items-center justify-content-center c-pointer"
            :style="`height: ${criticalTask.power * 15}px; width: ${criticalTask.duration * 20}px; border: 1px solid black;`">
            {{ criticalTask.id }}</div>
        </div>
      </div>

      <div class="d-flex align-items-end" :style="`height: ${20}vh;padding-bottom: 10px`">
        <div v-for="criticalTask in criticalTasks()"
          :style="`min-width: ${criticalTask.duration * 20}px;max-width: ${criticalTask.duration * 20}px;`">
          <GraphPartCommon :a="criticalTask.earlyStart!" :b="criticalTask.earlyEnd!"
            :processedTaskIds="criticalTasks().map(x => x.id)" />
          <div :title="criticalTask.name" class="d-flex align-items-center justify-content-center c-pointer"
            :style="`height: ${criticalTask.power * 15}px; width: ${criticalTask.duration * 20}px; border: 1px solid black;`">
            {{ criticalTask.id }}</div>
        </div>
      </div>

      <div class="d-flex align-items-end" :style="` height: ${20}vh;padding-bottom: 10px`">
        <div v-for="criticalTask in criticalTasksLate()"
          :style="`min-width: ${criticalTask.duration * 20}px;max-width: ${criticalTask.duration * 20}px;`"
          class="d-flex align-items-end flex-column">
          <GraphPartCommon :a="criticalTask.lateStart!" :b="criticalTask.lateEnd!"
            :processedTaskIds="criticalTasksLate().map(x => x.id)" />
          <div :title="criticalTask.name" class="d-flex align-items-center justify-content-center c-pointer"
            :style="`height: ${criticalTask.power * 15}px; width: ${criticalTask.duration * 20}px; border: 1px solid black;`">
            {{ criticalTask.id }}</div>
        </div>
      </div>
    </div>
    <AddTaskModal :showModal="showAddTaskModal" @close="showAddTaskModal = false" />
    <UpdateTaskModal :showModal="showUpdateTaskModal" @close="showUpdateTaskModal = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "./store/index";
import Task, { CalculatedTask } from "./store/dto/task";
import AddTaskModal from "./modals/AddTaskModal.vue"
import UpdateTaskModal from "./modals/UpdateTaskModal.vue"
import GraphPart from "./components/GraphPart/GraphPart.vue"
import GraphPartCommon from "./components/GraphPart/GraphPartCommon.vue"
import GraphPartLate from "./components/GraphPart/GraphPartLate.vue"

export default defineComponent({
  components: {
    AddTaskModal,
    UpdateTaskModal,
    GraphPart,
    GraphPartCommon,
    GraphPartLate
  },
  props: {
    /*todo: {
        type: Object as PropType<ToDo>,
        required: true
      }*/
  },
  data() {
    return {
      editable: false,
      storage: storage.getInstance(),
      optimizedCalculatedTasks: [] as CalculatedTask[],
      showAddTaskModal: false,
      showUpdateTaskModal: false
    };
  },
  methods: {
    getEarlyMaxHeight() {
      var max1 = 0
      for (var i = 0; i < this.maxEnd(); i++) {
        max1 = Math.max(max1, this.optimizedCalculatedTasks.filter(x => x.earlyStart! <= i && x.earlyEnd! > i).map(x => x.power).reduce((a, b) => a + b, 0))
      }
      return max1
    },
    getLateMaxHeight() {
      var max2 = 0
      for (var i = 0; i < this.maxEnd(); i++) {
        max2 = Math.max(max2, this.optimizedCalculatedTasks.filter(x => x.lateStart! < i && x.lateEnd! >= i).map(x => x.power).reduce((a, b) => a + b, 0))
      }
      return max2
    },
    optimize() {
      this.optimizedCalculatedTasks = JSON.parse(JSON.stringify(this.calculatedTasks))
      var height = this.getEarlyMaxHeight();

      for (var j = 0; j < this.optimizedCalculatedTasks.length; j++) {
        for (var task of this.optimizedCalculatedTasks) {
          var optimizedLateStart = task.lateStart!
          var optimizedLateEnd = task.lateEnd!
          for (var i = 0; i < task.reserv!; i++) {
            task.reserv! -= 1
            task.lateStart! -= 1
            task.lateEnd! -= 1
            var newHeight = this.getEarlyMaxHeight();
            if (newHeight < height) {
              height = newHeight
              optimizedLateStart = task.lateStart!
              optimizedLateEnd = task.lateEnd!
            }
          }
          task.lateStart = optimizedLateStart
          task.lateEnd = optimizedLateEnd
        }
      }
      console.log(height)
    },
    criticalTasks() {
      var tasks = this.calculatedTasks.filter(x => this.isCritical(x) && x.duration)
      var newTasks = [] as CalculatedTask[]
      for (var task of tasks) {
        if (newTasks.some(x => x.earlyStart == task.earlyStart && x.earlyEnd == task.earlyEnd))
          continue

        newTasks.push(task)
      }
      return newTasks
    },
    criticalTasksLate() {
      var tasks = this.calculatedTasks.filter(x => this.isCritical(x) && x.duration)
      var newTasks = [] as CalculatedTask[]
      for (var task of tasks) {
        if (newTasks.some(x => x.lateStart == task.lateStart && x.lateEnd == task.lateEnd))
          continue

        newTasks.push(task)
      }
      return newTasks
    },
    addTask() {
      this.showAddTaskModal = true;
    },
    deleteTask(taskId: number) {
      this.storage.deleteTask(taskId);
    },
    updateTask(task: Task) {
      this.storage.selectTask(task)
      this.showUpdateTaskModal = true;
    },
    isCritical(task: CalculatedTask): string {
      if (task.earlyEnd == task.lateEnd && task.earlyStart == task.lateStart)
        return "*";
      return "";
    },
    maxEnd() {
      return Math.max(...this.calculatedTasks.map(x => x.earlyEnd!))
    }
  },
  computed: {
    tasks(): Task[] {
      return this.storage.tasks;
    },
    calculatedTasks(): CalculatedTask[] {
      // var task = this.storage.calculatedTasks.find(x => x.id == 7);
      // if (!task)
      //   return [];
      // task!.earlyStart = 7
      // task!.earlyEnd = 8
      return this.storage.calculatedTasks;
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
