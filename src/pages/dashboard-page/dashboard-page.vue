<template>
  <PageContainer>
    <div>
      <h1 class="text-center" style="color: white">Дашборд проекта</h1>
      <ResourceGraph
        class="mt-3"
        title="Распределение ресурсов во времени — Фактический"
        :tasks="tasks"
        :rects="factRects"
      />
      <ResourceGraph
        class="mt-3"
        title="Распределение ресурсов во времени — Планируемый"
        :tasks="tasks"
        :rects="normalRects"
      />
      <!-- <div class="top-tasks">
        <div class="task-list">
          <h2 class="list-title">Топ задач, задержавших проект</h2>
          <ul>
            <li v-for="task in delayedTasks" :key="task.id" class="list-item">
              {{ task.name }} — задержка {{ task.delay }} дней
            </li>
          </ul>
        </div>
        <div class="task-list">
          <h2 class="list-title">Задачи выполнены раньше срока</h2>
          <ul>
            <li v-for="task in earlyTasks" :key="task.id" class="list-item">
              {{ task.name }} — выполнена {{ task.daysEarly }} дней раньше
            </li>
          </ul>
        </div>
      </div> -->
    </div>
  </PageContainer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "./store/index";
import PageContainer from "../../components/pageContainer/page-container.vue";
import ResourceGraph from "../project-page/view/components/main-tab/resource-graph.vue";
import { ProjectDto, TaskDto } from "../../services/projects/dtos/project-dto";
import {
  TaskRect,
  calculatedTasksRectsByFactTime,
  calculatedTasksRectsNormal,
} from "../project-page/store/taskCalculator";

export default defineComponent({
  components: {
    PageContainer,
    ResourceGraph,
  },
  data() {
    return {
      storage: storage.getInstance(),
      delayedTasks: [
        { id: 1, name: "Задача А", delay: 5 },
        { id: 2, name: "Задача Б", delay: 3 },
        { id: 3, name: "Задача В", delay: -1 },
      ],
      earlyTasks: [
        { id: 4, name: "Задача Г", daysEarly: -4 },
        { id: 5, name: "Задача Д", daysEarly: -2 },
      ],
    };
  },
  methods: {},
  computed: {
    normalRects(): TaskRect[] {
      return calculatedTasksRectsNormal(this.tasks, null);
    },
    factRects(): TaskRect[] {
      if (!this.project)
        return []

      console.log(calculatedTasksRectsByFactTime(this.project, null))
      return calculatedTasksRectsByFactTime(this.project, null);
    },

    tasks(): TaskDto[] {
      return this.storage.tasks ?? [];
    },

    project(): ProjectDto | null {
      return this.storage.project;
    }
  },
  async mounted() {
    var id = this.$route.params.id as string;
    await this.storage.loadProject({ id: id });
  },
});
</script>

<style scoped>
</style>
