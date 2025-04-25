<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <!-- <div class="d-flex">
          <input placeholder="Поиск" class="form-control py-2 search-field" type="text" style="background-color: #4F4752; border-radius: 20px; border: none; width: 400px; color: #fff"></input>
        </div> -->
      <div class="d-flex gap-3">
        <button
          v-show="storage.project"
          @click="addTask()"
          type="button"
          class="btn btn-outline-primary c-pointer"
        >
          Добавить
        </button>
        <!-- <button class="py-1 px-3 btn" style="color: #FFFFFF; font-size: 20px; border: 1px solid #FFFFFF; border-radius: 20px; background-color: #ffffff00; box-shadow: 0 0 1px 0px white inset, 0 0 1px 0px white">Изменить</button> -->
        <!-- <button class="py-1 px-3 btn" style="color: #FFFFFF; font-size: 20px; border: 1px solid #FFFFFF; border-radius: 20px; background-color: #ffffff00; box-shadow: 0 0 1px 0px white inset, 0 0 1px 0px white">Удалить</button> -->
      </div>
    </div>
    <TasksTable />
    <div class="mt-2" style="width: 200px">
      <div class="form-label">Вид ресурса</div>
      <select v-model="selectedResourceKindId" class="form-select">
        <option :value="null" :selected="selectedResourceKindId == null">
          Все
        </option>
        <option
          :value="resourceKind.id"
          :selected="selectedResourceKindId == resourceKind.id"
          v-for="(resourceKind, index) in resourecKinds"
        >
          {{ resourceKind.name }}
        </option>
      </select>
    </div>
    <div class="mt-3 d-flex gap-3" v-if="projectLoaded">
      <ResourceGraph title="График Ранний" :rects="earlyRects" />
      <ResourceGraph title="График Поздний" :rects="lateRects" />
      <CorrectedResourceGraph :resourceKindId="selectedResourceKindId" />
    </div>
  </div>
  <AddTaskModal
    :showModal="showAddTaskModal"
    @close="showAddTaskModal = false"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../../../store/index";
import AddTaskModal from "../../modals/AddTaskModal.vue";
import PageContainer from "../../../../../components/pageContainer/page-container.vue";
import TasksTable from "./tasks-table.vue";
import ResourceGraph from "./resource-graph.vue";
import {
  calculatedTasksRectsEarly,
  TaskRect,
} from "../../../store/taskCalculator";
import {
  ResourceKindDto,
  TaskDto,
} from "../../../../../services/projects/dtos/project-dto";
import CorrectedResourceGraph from "./corrected-resource-graph.vue";

export default defineComponent({
  components: {
    AddTaskModal,
    TasksTable,
    PageContainer,
    ResourceGraph,
    CorrectedResourceGraph,
  },
  data() {
    return {
      storage: storage.getInstance(),
      showAddTaskModal: false,
      selectedResourceKindId: null as null | string,
    };
  },
  methods: {
    addTask() {
      this.showAddTaskModal = true;
    },
  },
  computed: {
    earlyRects(): TaskRect[] {
      return calculatedTasksRectsEarly(this.tasks, this.selectedResourceKindId);
    },
    lateRects(): TaskRect[] {
      return calculatedTasksRectsEarly(this.tasks, this.selectedResourceKindId);
    },
    tasks(): TaskDto[] {
      return this.storage.project?.tasks ?? [];
    },
    resourecKinds(): ResourceKindDto[] {
      return this.storage.resourceKinds;
    },
    projectLoaded(): boolean {
      return this.storage.project != null;
    },
  }
});
</script>

<style>
.app-icon {
  background-image: url("data:image/svg+xml,%3Csvg width='76' height='76' viewBox='0 0 76 76' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Crect x='21' y='16' width='37' height='12' fill='url(%23pattern0_44_108)'/%3E%3Crect x='21' y='42' width='27' height='12' fill='url(%23pattern1_44_108)'/%3E%3Cpath d='M33.0238 41.1667V53.8333M45.6904 15.8333V28.5M7.69043 9.5V60.1667C7.69043 61.8464 8.35769 63.4573 9.54542 64.645C10.7332 65.8327 12.3441 66.5 14.0238 66.5H64.6904M23.5238 41.1667H45.6904C47.4393 41.1667 48.8571 42.5844 48.8571 44.3333V50.6667C48.8571 52.4156 47.4393 53.8333 45.6904 53.8333H23.5238C21.7749 53.8333 20.3571 52.4156 20.3571 50.6667V44.3333C20.3571 42.5844 21.7749 41.1667 23.5238 41.1667ZM23.5238 15.8333H55.1904C56.9393 15.8333 58.3571 17.2511 58.3571 19V25.3333C58.3571 27.0822 56.9393 28.5 55.1904 28.5H23.5238C21.7749 28.5 20.3571 27.0822 20.3571 25.3333V19C20.3571 17.2511 21.7749 15.8333 23.5238 15.8333Z' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cdefs%3E%3Cpattern id='pattern0_44_108' patternContentUnits='objectBoundingBox' width='0.432432' height='0.666667'%3E%3Cuse xlink:href='%23image0_44_108' transform='scale(0.00108108 0.00333333)'/%3E%3C/pattern%3E%3Cpattern id='pattern1_44_108' patternContentUnits='objectBoundingBox' width='0.592593' height='0.666667'%3E%3Cuse xlink:href='%23image0_44_108' transform='scale(0.00148148 0.00333333)'/%3E%3C/pattern%3E%3Cimage id='image0_44_108' width='400' height='200' xlink:href='data:image/png;base64,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'/%3E%3C/defs%3E%3C/svg%3E%0A");
}
</style>
