<template>
  <div class="task-card" draggable="true" @dragstart="onDragStart">
    <h4>{{ task.title }}</h4>
    <p><strong>Исполнитель:</strong> {{ task.assignee }}</p>
    <p>{{ task.description }}</p>
    <div v-if="task.subtasks.length">
      <h5>Подзадачи:</h5>
      <ul>
        <li v-for="(subtask, index) in task.subtasks" :key="index">
          {{ subtask }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  subtasks: string[];
  statusId: number;
}

export default defineComponent({
  name: "TaskCard",
  props: {
    task: { type: Object as () => Task, required: true },
  },
  methods: {
    onDragStart(event: any) {
      event.dataTransfer.setData("text/plain", this.task.id.toString());
    },
  },
});
</script>

<style scoped>
.task-card.dragging {
  opacity: 0.5;
}
</style>
