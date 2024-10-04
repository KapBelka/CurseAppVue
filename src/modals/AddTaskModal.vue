<template>
  <Modal
    :showModal="showModal"
    :title="level == 0 ? 'Добавление задачи' : 'Добавление вида ресурса'"
    @close="onClose"
    @open="onOpen"
  >
    <template v-slot v-if="level == 1">
      <div class="mb-3">
        <label for="nameInput" class="form-label">Название</label>
        <input
          v-model="resourceKindName"
          type="text"
          class="form-control"
          id="nameInput"
        />
      </div>
    </template>
    <template v-slot v-if="level == 0">
      <div class="mb-3">
        <label for="nameInput" class="form-label">Название</label>
        <input v-model="name" type="text" class="form-control" id="nameInput" />
      </div>
      <div class="mb-3">
        <div>
          <label class="form-label">Продолжительность</label>
        </div>
        <input
          v-model="duration"
          type="number"
          class="form-control"
          id="durationInput"
        />
      </div>
      <div class="mb-3">
        <div>Ресурсы</div>
        <div
          class="d-flex align-items-center mt-2"
          v-for="(resource, i) in resources"
        >
          <div class="input-group">
            <select v-model="resources[i].resourceKindId" class="form-select">
              <option
                :value="resourceKind.id"
                :selected="neededTasksIds.includes(resourceKind.id)"
                v-for="resourceKind in getAvailableResourceKinds(resource)"
              >
                {{ resourceKind.id }} {{ resourceKind.name }}
              </option>
            </select>
            <button class="btn btn-primary" @click="level = 1">
              <i class="bi bi-plus" style="cursor: pointer"></i>
            </button>
          </div>
          <input
            v-model="resources[i].count"
            type="number"
            class="form-control ms-2"
            style="width: 60px"
          />
          <i
            @click="
              resources = resources.filter(
                (x) => x.resourceKindId != resource.resourceKindId
              )
            "
            class="bi-trash ms-2"
            style="cursor: pointer"
          ></i>
        </div>
        <a
          class="link-opacity-100 link-underline link-underline-opacity-0 c-pointer"
          @click="addNewResource()"
          >+ добавить</a
        >
      </div>
      <div class="mb-3">
        <div>Требуемые работы</div>
        <div
          class="d-flex align-items-center mt-2"
          v-for="(taskId, i) in neededTasksIds"
        >
          <select v-model="neededTasksIds[i]" class="form-select">
            <option
              :value="task.id"
              :selected="neededTasksIds.includes(task.id)"
              v-for="task in tasks.filter(
                (x) => x.id == taskId || neededTasksIds.includes(x.id) == false
              )"
            >
              {{ task.id }} {{ task.name }}
            </option>
          </select>
          <i
            @click="neededTasksIds = neededTasksIds.filter((x) => x != taskId)"
            class="bi-trash ms-2"
            style="cursor: pointer"
          ></i>
        </div>
        <a
          class="link-opacity-100 link-underline link-underline-opacity-0 c-pointer"
          @click="addNewNeededTask()"
          >+ добавить</a
        >
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="onClose">Отмена</button>
      <button :disabled="!canSave" class="btn btn-primary" @click="save">
        <span
          v-show="isLoadingSubmitButton"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Подтвердить
      </button>
    </template>
  </Modal>
</template>
<style lang="scss" scoped></style>
<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../components/Modal/Modal.vue";
import Task, { Resource } from "../store/dto/task";
import Storage from "../store/index";
import ResourceKind from "../store/dto/resource-kind";

interface Data {
  isLoadingSubmitButton: boolean;
  storage: Storage;
  name: null | string;
  resourceKindName: null | string;
  duration: null | number;
  neededTasksIds: (number | null)[];
  resources: Resource[];
  level: number;
}

export default defineComponent({
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Modal,
  },
  data() {
    return {
      isLoadingSubmitButton: false,
      storage: Storage.getInstance(),
      name: null,
      duration: null,
      neededTasksIds: [],
      resources: [],
      showAddResourceKindModal: false,
      resourceKindName: null,
      level: 0,
    } as Data;
  },
  watch: {
    showModal() {},
  },
  computed: {
    canSave(): boolean {
      return (
        (this.level == 1 && !!this.resourceKindName) ||
        (this.level == 0 &&
          !!this.name &&
          this.duration != null &&
          this.resources.every(
            (x) => x.resourceKindId != null && x.count > 0
          ) &&
          this.neededTasksIds.every((x) => x != null))
      );
    },
    tasks(): Task[] {
      return this.storage.tasks;
    },
    selectedTask(): Task {
      return this.storage.selectedTask;
    },
    resourceKinds(): ResourceKind[] {
      return this.storage.resourceKinds;
    },
  },
  methods: {
    getAvailableResourceKinds(resource: Resource) {
      return this.resourceKinds.filter(
        (x) =>
          x.id == resource.resourceKindId ||
          this.resources.some((y) => y.resourceKindId == x.id) == false
      );
    },
    addNewResource() {
      this.resources.push({ resourceKindId: null, count: 0 });
    },
    addNewNeededTask() {
      this.neededTasksIds.push(null);
    },
    onCheckClick(taskId: number) {
      if (this.neededTasksIds.includes(taskId)) {
        this.neededTasksIds = this.neededTasksIds.filter((x) => x != taskId);
      } else {
        this.neededTasksIds.push(taskId);
      }
    },
    onOpen(): void {
      this.isLoadingSubmitButton = false;
      this.name = null;
      this.duration = null;
      this.neededTasksIds = [];
      this.resources = [];
      this.resourceKindName = null;
    },
    onClose(): void {
      this.resourceKindName = null;
      if (this.level == 0) this.$emit("close");
      else this.level = 0;
    },
    save(): void {
      this.isLoadingSubmitButton = true;
      if (this.level == 0) {
        var id = 0;
        if (this.tasks.length)
          id = Math.max(...this.tasks.map((x) => x.id)) + 1;

        this.storage.addTask({
          id: id,
          name: this.name!,
          duration: this.duration!,
          needTasksIds: this.neededTasksIds.map((x) => x!),
          resources: this.resources,
        });
        this.isLoadingSubmitButton = false;
        this.$emit("close");
      } else {
        var id = 0;
        if (this.resourceKinds.length)
          id = Math.max(...this.resourceKinds.map((x) => x.id)) + 1;

        this.storage.addResourceKind({
          id: id,
          name: this.resourceKindName!,
        });
        this.isLoadingSubmitButton = false;
        this.level = 0;
      }
    },
  },
  mounted() {},
});
</script>
