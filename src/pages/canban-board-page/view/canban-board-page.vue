<template>
  <PageContainer>
    <div class="canban-board-page">
      <div class="board">
        <div
          class="column"
          v-for="status in statuses"
          :key="status.id"
          @dragover.prevent="onDragOver($event, status.id)"
          @drop="onDrop($event, status.id)"
        >
          <div class="column-header">{{ status.name }}</div>
          <div
            class="task"
            :class="states?.find((x) => x.id == task.state)?.class"
            v-for="task in tasksByStatus(status.id)"
            :key="task.id"
            :ref="'task-' + task.id"
            draggable="true"
            @dragstart="onDragStart($event, task.id)"
            @dragend="onDragEnd"
          >
            <div class="task-header">
              {{ task.name }}
              <div
                class="float-end c-pointer"
                @dragend.stop=""
                @dragstart.stop=""
                @click.stop="console.log('hui')"
              >
                <i class="bi-pencil" />
              </div>
            </div>
            <div class="task-details">
              <p v-if="task.executor">
                <strong>Исполнитель:</strong> {{ task.executor }}
              </p>
              <p v-if="task.description">
                <strong>Описание:</strong> {{ task.description }}
              </p>
              <!-- <p v-if="task.subtasks.length"><strong>Подзадачи:</strong></p>
              <ul v-if="task.subtasks.length">
                <li v-for="sub in task.subtasks" :key="sub">{{ sub }}</li>
              </ul> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script lang="ts">
import storage from "../store/index";
import { defineComponent } from "vue";
import PageContainer from "../../../components/pageContainer/page-container.vue";
import { BoardTaskDto } from "../../../services/projects/dtos/project-dto";

interface Status {
  id: string;
  name: string;
}

interface TaskState {
  id: string;
  name: string;
  class: string;
}

export default defineComponent({
  components: {
    PageContainer,
  },
  data() {
    return {
      storage: storage.getInstance(),
      statuses: [
        { id: "NotStarted", name: "Сделать" },
        { id: "InProcess", name: "В работе" },
        { id: "Done", name: "Сделано" },
        { id: "Approved", name: "Принято" },
      ] as Status[],
      states: [
        {
          id: "ExpiredOnReserv",
          class: "status-wait-reserve",
          name: "Сделать",
        },
        { id: "Expired", class: "status-delayed", name: "В работе" },
        { id: "Done", class: "status-completed", name: "Сделано" },
        { id: "NotExpired", class: "status-default", name: "" },
      ] as TaskState[],
      draggedTaskId: null as string | null,
      insertIndex: null as number | null,
    };
  },

  methods: {
    onDragStart(event: any, taskId: string) {
      this.draggedTaskId = taskId;
      event.dataTransfer.effectAllowed = "move";
    },
    onDragEnd() {
      this.draggedTaskId = null;
    },
    onDragOver(event: DragEvent, status: string) {
      event.preventDefault();

      // Получаем список задач в колонке
      const tasksInStatus = this.tasksByStatus(status);

      // Получаем координаты курсора
      const cursorY = event.clientY;

      // Ищем задачу, над которой находится курсор
      let insertIndex = tasksInStatus.length; // по умолчанию — вставка в конец

      for (let i = 0; i < tasksInStatus.length; i++) {
        const taskElement = this.$refs[
          `task-${tasksInStatus[i].id}`
        ]![0] as HTMLElement;
        const rect = taskElement.getBoundingClientRect();
        if (cursorY < rect.top + rect.height / 2) {
          insertIndex = i;
          break;
        }
      }

      this.insertIndex = insertIndex;
    },
    async onDrop(event: any, status: string) {
      if (this.draggedTaskId !== null) {
        await this.storage.updateTaskStatus({ taskId: this.draggedTaskId, status: status, order: this.insertIndex ?? this.tasksByStatus(status).length })
      }
    },
    tasksByStatus(status: string): BoardTaskDto[] {
      return this.tasks.filter((t) => t.status === status);
    },
    statusIndex(status: string): number {
      return this.statuses.findIndex((s) => s.id === status);
    },
  },

  computed: {
    tasks() {
      return this.storage.tasks;
    },
  },
  async mounted() {
    var id = this.$route.params.id as string;
    await this.storage.loadProject({ id: id });
  },
});
</script>

<style scoped src="./assets/canban-board-styles.scss"></style>
