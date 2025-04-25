<template>
  <div
    v-show="storage.project"
    class="mt-5 py-3 tasks-table fs-16px"
  >
    <div class="px-3" style="overflow-y: auto; max-height: 360px">
      <div
        class="row pb-2 border-bottom"
        style="position: sticky; top: 0; background-color: #fff"
      >
        <div class="fw-500" style="width: 140px">Номер задачи</div>
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
        v-for="task in tasks.sort((a, b) => a.order - b.order)"
      >
        <div style="width: 140px">
          {{ task.order + 1 }}
          <i
            @click="updateTask(task)"
            class="bi-pencil ms-2"
            style="cursor: pointer"
          ></i>
          <i
            @click="deleteTask(task.id)"
            class="bi-trash ms-1"
            style="cursor: pointer"
          ></i>
          <i
            @click="moveUpTask(task)"
            class="bi bi-caret-up-square ms-1"
            style="cursor: pointer"
          ></i>
          <i
            @click="moveDownTask(task)"
            class="bi bi-caret-down-square ms-1"
            style="cursor: pointer"
          ></i>
        </div>
        <div style="width: 600px">{{ task.name }}</div>
        <div style="width: 60px">{{ task.duration }}</div>
        <div style="width: 130px">
          {{
            tasks
              .filter((x) => task.needProjectTasksIds.includes(x.id))
              .map((x) => x.order + 1)
              .join("; ")
          }}
        </div>
        <div style="width: 80px">
          {{ task.resources.reduce((a, b) => a + b.count, 0) }}
        </div>
        <div style="width: 80px">
          {{ task.earlyStart }}
        </div>
        <div style="width: 100px">
          {{ task.earlyEnd }}
        </div>
        <div style="width: 80px">
          {{ task.lateStart }}
        </div>
        <div style="width: 100px">
          {{ task.lateEnd }}
        </div>
        <div style="width: 90px">
          {{ task.fullReserv }}
        </div>
        <div style="width: 80px">{{ task.reserv }}</div>
      </div>
    </div>
    <UpdateTaskModal
      :showModal="showUpdateTaskModal"
      :selectedTask="selectedTask"
      @close="showUpdateTaskModal = false"
    />
  </div>
</template>

<style scoped lang="scss">
.tasks-table {
  border-radius: 20px;
  background-color: white;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../../store/index";
import UpdateTaskModal from "../modals/UpdateTaskModal.vue";
import { TaskDto } from "../../../../services/projects/dtos/project-dto";

export default defineComponent({
  components: {
    UpdateTaskModal,
  },
  data() {
    return {
      storage: storage.getInstance(),
      showUpdateTaskModal: false,
      selectedTask: null as null | TaskDto,
    };
  },
  methods: {
    async deleteTask(taskId: string) {
      await this.storage.deleteTask({ taskId });
    },
    updateTask(task: TaskDto) {
      this.showUpdateTaskModal = true;
      this.selectedTask = task;
    },
    async moveUpTask(task: TaskDto) {
      await this.storage.moveUpTask(task);
    },
    async moveDownTask(task: TaskDto) {
      await this.storage.moveDownTask(task);
    },
  },
  computed: {
    tasks(): TaskDto[] {
      return this.storage.tasks;
    },
  },
});
</script>
