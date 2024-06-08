<template>
  <Modal
    :showModal="showModal"
    title="Подтверждение"
    @close="$emit('close')"
    @open="onOpen"
  >
    <template v-slot>
      <div class="mb-3">
        <label for="nameInput" class="form-label">Название</label>
        <input v-model="name" type="text" class="form-control" id="nameInput" />
      </div>
      <div class="mb-3">
        <label for="durationInput" class="form-label">Продолжительность</label>
        <input
          v-model="duration"
          type="number"
          class="form-control"
          id="durationInput"
        />
      </div>
      <div class="mb-3">
        <label for="durationInput" class="form-label">Сила</label>
        <input
          v-model="power"
          type="number"
          class="form-control"
          id="durationInput"
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="neededJobsInput">Требуемые работы</label>
        <ul class="list-group overflow-auto" style="max-height: 300px">
          <li class="list-group-item" v-for="task in tasks">
            <label class="form-check-label"
              ><input
                class="form-check-input me-1"
                type="checkbox"
                @click="onCheckClick(task.id)"
                :checked="neededTasksIds.includes(task.id)"
              />({{ task.id }}) {{ task.name }}
            </label>
          </li>
        </ul>
        <!-- <select
          v-model="neededTasksIds"
          multiple
          class="form-select"
          id="neededJobsInput"
        >
          <option
            :value="task.id"
            :selected="neededTasksIds.includes(task.id)"
            v-for="task in tasks"
          >
            {{ task.id }} {{ task.name }}
          </option>
        </select> -->
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="$emit('close')">Отмена</button>
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
import Task from "../store/dto/task";
import Storage from "../store/index";

interface Data {
  isLoadingSubmitButton: boolean;
  storage: Storage;
  name: null | string;
  duration: null | number;
  power: null | number;
  neededTasksIds: number[];
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
      power: null,
      neededTasksIds: [],
    } as Data;
  },
  watch: {
    showModal() {},
  },
  computed: {
    canSave(): boolean {
      return !!this.name && this.duration != null && this.power != null;
    },
    tasks(): Task[] {
      return this.storage.tasks;
    },
  },
  methods: {
    onCheckClick(taskId: number) {
      if (this.neededTasksIds.includes(taskId)) {
        this.neededTasksIds = this.neededTasksIds.filter(x => x != taskId);
      }
      else {
        this.neededTasksIds.push(taskId)
      }
    },
    onOpen(): void {
      this.isLoadingSubmitButton = false;
      this.name = null
      this.duration = null
      this.power = null
      this.neededTasksIds = []
    },
    save(): void {
      this.isLoadingSubmitButton = true;
      var id = 0
      if (this.tasks.length)
        id = Math.max(...this.tasks.map(x => x.id)) + 1

      this.storage.addTask({
        id: id,
        name: this.name!,
        duration: this.duration!,
        power: this.power!,
        needTasksIds: this.neededTasksIds,
      });
      this.isLoadingSubmitButton = false;
      this.$emit('close')
    },
  },
  mounted() {},
});
</script>
