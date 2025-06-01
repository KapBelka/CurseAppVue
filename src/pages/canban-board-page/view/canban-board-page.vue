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
          v-for="(task, index) in tasksByStatus(status.id)"
          :key="task.id"
          draggable="true"
          @dragstart="onDragStart($event, task.id)"
          @dragend="onDragEnd"
        >
          <div class="task-header">{{ task.name }}</div>
          <div class="task-details">
            <p v-if="task.executor"><strong>Исполнитель:</strong> {{ task.executor }}</p>
            <p v-if="task.description"><strong>Описание:</strong> {{ task.description }}</p>
            <p v-if="task.subtasks.length"><strong>Подзадачи:</strong></p>
            <ul v-if="task.subtasks.length">
              <li v-for="sub in task.subtasks" :key="sub">{{ sub }}</li>
            </ul>
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
    PageContainer
  },
  data() {
    return {
      storage: storage.getInstance(),
      statuses: [
        { id: 'NotStarted', name: "Сделать" },
        { id: 'InProcess', name: "В работе" },
        { id: 'Done', name: "Сделано" },
        { id: 'Approved', name: "Принято" },
      ] as Status[],
      states: [
        { id: 'NotExpired', class: "status-wait-reserve", name: "Сделать" },
        { id: 'ExpiredOnReserv', class: "status-delayed", name: "В работе" },
        { id: 'Expired', class: "status-completed", name: "Сделано" },
        { id: 'Done', class: "status-default", name: "" },
      ] as TaskState[],

      draggedTaskId: null as string | null,

      // Для хранения информации о месте перетаскивания
      dropIndexMap: {} as Record<number, number>, // исправлено
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

    // Обработка перетаскивания над колонкой
    onDragOver(event: DragEvent, statusId: string) {
      event.preventDefault();

      const columnEl = event.currentTarget as HTMLElement;
      const tasksEls = Array.from(
        columnEl.querySelectorAll(".task")
      ) as HTMLElement[];

      let insertIndex = tasksEls.length; // по умолчанию вставляем в конец

      for (let i = 0; i < tasksEls.length; i++) {
        const rect = tasksEls[i].getBoundingClientRect();
        if (event.clientY < rect.top + rect.height / 2) {
          insertIndex = i;
          break;
        }
      }

      this.dropIndexMap[statusId] = insertIndex;
    },

    // Обработка сброса задачи
    onDrop(event: any, status: string) {
      if (this.draggedTaskId !== null) {
        const task = this.tasks.find((t) => t.id === this.draggedTaskId);
        if (task) {
          // меняем статус задачи
          task.status = status;

          // получаем индекс вставки для этой колонки
          const insertIdx = this.dropIndexMap[status];
          if (insertIdx !== undefined) {
            // Удаляем задачу из текущего массива
            const currentTasks = this.tasks.filter((t) => t.id !== task!.id);

            // Вставляем задачу в нужную позицию
            currentTasks.splice(insertIdx, 0, task);

            // Обновляем массив задач так чтобы порядок соответствовал новому порядку
            this.tasks = currentTasks;

            // Очистка карты после вставки
            delete this.dropIndexMap[status];
          }
        }
      }
    },

    // Получение задач по статусу с учетом порядка
    tasksByStatus(status: string): BoardTaskDto[] {
      return this.tasks.filter((t) => t.status === status);
    },

    // Вспомогательная функция для получения индекса статуса (для селектора)
    statusIndex(status: string): number {
      return this.statuses.findIndex((s) => s.id === status);
    },
  },

  computed: {
    tasks() {
      return this.storage.tasks
    }
    // Можно оставить как есть или убрать если не нужно
  },
  async mounted() {
    var id = this.$route.params.id as string;
    await this.storage.loadProject({ id: id });
  },
});
</script>

<style scoped src="./assets/canban-board-styles.scss"></style>
