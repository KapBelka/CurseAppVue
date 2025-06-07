<template>
  <div
    v-show="storage.project"
    class="mt-2 py-3 tasks-table fs-16px"
  >
    <div class="px-3" style="overflow-y: auto; max-height: 360px">
      <div
        class="row pb-2 border-bottom"
        style="position: sticky; top: 0; background-color: #fff"
      >
        <div class="fw-500 col-1">Номер задачи</div>
        <div class="fw-500 col-4">Название</div>
        <div class="fw-500 col-1">Срок</div>
        <div class="fw-500 col-2">Ресурсы</div>
        <div class="fw-500 col-4">Предыдущие задачи <i class="bi bi-info-square float-end c-pointer" @click="openTasksTableModal()"></i></div>
      </div>
      <div
        class="row border-top hover py-1"
        style="border-color: #4f4752"
        v-for="task in tasks.sort((a, b) => a.order - b.order)"
      >
        <div class="col-1">
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
        <div class="col-4">{{ task.name }}</div>
        <div class="col-1">{{ task.duration }}</div>
        <div class="col-2">
          <div v-for="resource in task.resources">{{ resource.count }} {{ resourceKinds.find(x => x.id == resource.projectResourceKindId)?.name }}</div>
        </div>
        <div class="col-4">
          <div v-for="task in tasks.filter((x) => task.needProjectTasksIds.includes(x.id))">{{ task.order + 1 }} - {{ task.name }}</div>
        </div>
      </div>
    </div>
    <UpdateTaskModal
      :showModal="showUpdateTaskModal"
      :selectedTask="selectedTask"
      @close="showUpdateTaskModal = false"
    />
    <TasksTableModal
      :showModal="showTasksTableModal"
      @close="showTasksTableModal = false" 
    />
  </div>
</template>

<style scoped lang="scss">
.tasks-table {
  border-radius: 6px;
  background-color: white;
}

.tasks-table .hover:hover {
  background-color: #EAE4F4;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../../../store/index";
import UpdateTaskModal from "../../modals/UpdateTaskModal.vue";
import { ResourceKindDto, TaskDto } from "../../../../../services/projects/dtos/project-dto";
import TasksTableModal from "../../modals/TasksTableModal.vue";

export default defineComponent({
  components: {
    UpdateTaskModal,
    TasksTableModal
  },
  data() {
    return {
      storage: storage.getInstance(),
      showUpdateTaskModal: false,
      showTasksTableModal: false,
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
    openTasksTableModal() {
      this.showTasksTableModal = true;
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
    resourceKinds(): ResourceKindDto[] {
      return this.storage.resourceKinds;
    },
  },
});
</script>
