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
          :class="states?.find((x) => x.id == task.stateId)?.class"
          v-for="(task, index) in tasksByStatus(status.id)"
          :key="task.id"
          draggable="true"
          @dragstart="onDragStart($event, task.id)"
          @dragend="onDragEnd"
        >
          <div class="task-header">{{ task.title }}</div>
          <div class="task-details">
            <p><strong>Исполнитель:</strong> {{ task.executor }}</p>
            <p><strong>Описание:</strong> {{ task.description }}</p>
            <p><strong>Подзадачи:</strong></p>
            <ul>
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
import { defineComponent } from "vue";
import PageContainer from "../../../components/pageContainer/page-container.vue";

interface Task {
  id: number;
  title: string;
  description: string;
  executor: string;
  subtasks: string[];
  statusId: number; // соответствует id статуса
  stateId: number;
}

interface Status {
  id: number;
  name: string;
}

interface TaskState {
  id: number;
  name: string;
  class: string;
}

export default defineComponent({
  components: {
    PageContainer
  },
  data() {
    return {
      statuses: [
        { id: 1, name: "Сделать" },
        { id: 2, name: "В работе" },
        { id: 3, name: "Сделано" },
        { id: 4, name: "Принято" },
      ] as Status[],
      states: [
        { id: 1, class: "status-wait-reserve", name: "Сделать" },
        { id: 2, class: "status-delayed", name: "В работе" },
        { id: 3, class: "status-completed", name: "Сделано" },
        { id: 4, class: "status-default", name: "" },
      ] as TaskState[],

      tasks: [
        {
          id: 1,
          title: "Создать дизайн макеты",
          description:
            "Разработать начальные макеты интерфейса для мобильной и десктопной версий проекта.",
          executor: "Иван Иванов",
          subtasks: ["Создать wireframes", "Подготовить прототипы"],
          statusId: 1,
          stateId: 1,
        },
        {
          id: 2,
          title: "Настроить бекенд API",
          description:
            "Разработать REST API для управления задачами и пользователями.",
          executor: "Мария Смирнова",
          subtasks: ["Создать модели данных", "Реализовать эндпоинты CRUD"],
          statusId: 2,
          stateId: 2,
        },
        {
          id: 3,
          title: "Разработать фронтенд интерфейс",
          description:
            "Создать пользовательский интерфейс на React с интеграцией API.",
          executor: "Павел Кузнецов",
          subtasks: ["Настроить проект", "Создать компоненты задач"],
          statusId: 3,
          stateId: 3,
        },
        {
          id: 4,
          title: "Тестирование системы",
          description:
            "Провести юнит-тесты и интеграционное тестирование всех компонентов.",
          executor: "Елена Федорова",
          subtasks: [
            "Написать тесты для API",
            "Провести нагрузочное тестирование",
          ],
          statusId: 4,
          stateId: 4,
        },
        {
          id: 5,
          title: "Подготовка документации",
          description: "Создать документацию по использованию системы и API.",
          executor: "Алексей Новиков",
          subtasks: [
            "Написать руководство пользователя",
            "Обновить README в репозитории",
          ],
          statusId: 4,
          stateId: 1,
        },
      ] as Task[],

      draggedTaskId: null as number | null,

      // Для хранения информации о месте перетаскивания
      dropIndexMap: {} as Record<number, number>, // исправлено
    };
  },

  methods: {
    onDragStart(event: any, taskId: number) {
      this.draggedTaskId = taskId;
      event.dataTransfer.effectAllowed = "move";
    },

    onDragEnd() {
      this.draggedTaskId = null;
    },

    // Обработка перетаскивания над колонкой
    onDragOver(event: DragEvent, statusId: number) {
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
    onDrop(event: any, statusId: number) {
      if (this.draggedTaskId !== null) {
        const task = this.tasks.find((t) => t.id === this.draggedTaskId);
        if (task) {
          // меняем статус задачи
          task.statusId = statusId;

          // получаем индекс вставки для этой колонки
          const insertIdx = this.dropIndexMap[statusId];
          if (insertIdx !== undefined) {
            // Удаляем задачу из текущего массива
            const currentTasks = this.tasks.filter((t) => t.id !== task!.id);

            // Вставляем задачу в нужную позицию
            currentTasks.splice(insertIdx, 0, task);

            // Обновляем массив задач так чтобы порядок соответствовал новому порядку
            this.tasks = currentTasks;

            // Очистка карты после вставки
            delete this.dropIndexMap[statusId];
          }
        }
      }
    },

    // Получение задач по статусу с учетом порядка
    tasksByStatus(statusId: number): Task[] {
      return this.tasks.filter((t) => t.statusId === statusId);
    },

    // Вспомогательная функция для получения индекса статуса (для селектора)
    statusIndex(statusId: number): number {
      return this.statuses.findIndex((s) => s.id === statusId);
    },
  },

  computed: {
    // Можно оставить как есть или убрать если не нужно
  },
});
</script>

<style scoped src="./assets/canban-board-styles.scss"></style>
