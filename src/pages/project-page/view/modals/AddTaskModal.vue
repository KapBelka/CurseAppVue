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
        <div class="form-label">Ресурсы</div>
        <div
          class="d-flex align-items-center mt-2"
          v-for="(resource, i) in resources"
        >
          <div class="input-group">
            <select
              v-model="resources[i].projectResourceKindId"
              class="form-select"
            >
              <option
                :value="resourceKind.id"
                :selected="neededTasksIds.includes(resourceKind.id)"
                v-for="(resourceKind, index) in getAvailableResourceKinds(resource)"
              >
                {{ index }} {{ resourceKind.name }}
              </option>
            </select>
            <button class="btn btn-primary btn-plus" @click="level = 1">
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
                (x) => x.projectResourceKindId != resource.projectResourceKindId
              )
            "
            class="bi-trash ms-2"
            style="cursor: pointer"
          ></i>
        </div>
        <a
          class="link-opacity-100 link-underline link-underline-opacity-0 c-pointer"
          style="color: #d66434"
          @click="addNewResource()"
          >+ добавить</a
        >
      </div>
      <div class="mb-3">
        <div class="form-label">Требуемые задачи</div>
        <div
          class="d-flex align-items-center mt-2"
          v-for="(taskId, i) in neededTasksIds"
        >
          <select v-model="neededTasksIds[i]" class="form-select">
            <option
              :value="task.id"
              :selected="neededTasksIds.includes(task.id)"
              v-for="(task, index) in tasks.filter(
                (x) => x.id == taskId || neededTasksIds.includes(x.id) == false
              ).sort((a, b) => a.order - b.order)""
            >
              {{ task.order + 1 }} {{ task.name }}
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
          style="color: #d66434"
          @click="addNewNeededTask()"
          >+ добавить</a
        >
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-outline-primary c-pointer btn-add ms-2"
        @click="onClose"
      >
        Отмена
      </button>
      <button
        :disabled="!canSave"
        class="btn btn-outline-primary c-pointer btn-add2 ms-2"
        @click="save"
      >
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
<style lang="scss" scoped>
// .form-label {
//   font-weight: 700;
//   font-size: 20px;
//   color: #fff;
// }

// .form-control, .input-group, .btn, .form-select {
//   border-radius: 20px;
// }

// .btn-plus {
//   background-color: #D66434;
//   font-size: 20px;
//   border-radius: 20px;
//   border-color: #D66434;
// }

// .btn-plus:hover {
//   color: #fff;
//   background-color: #9c4926 !important;
//   border-color: #9c4926;
// }

// .btn-plus:active {
//   color: #fff;
//   background-color: #9c4926 !important;
//   border-color: #9c4926;
// }

// .btn-add {
//   color: #D66434;
//   font-size: 20px;
//   border-radius: 20px;
//   border: 1px solid #D66434;
//   box-shadow: 0 0 1px 0px #D66434 inset, 0 0 1px 0px #D66434
// }

// .btn-add:hover {
//   color: #fff;
//   background-color: #D66434;
//   border: 1px solid #D66434;
//   box-shadow: 0 0 1px 0px #D66434 inset, 0 0 1px 0px #D66434
// }

// .btn-add:active {
//   color: #fff;
//   background-color: #9c4926 !important;
// }

// .btn-add2 {
//   color: #fff;
//   font-size: 20px;
//   border-radius: 20px;
//   border: 1px solid #fff;
//   box-shadow: 0 0 1px 0px #fff inset, 0 0 1px 0px #fff
// }

// .btn-add2:hover {
//   color: #000;
//   background-color: #fff;
//   border: 1px solid #fff;
//   box-shadow: 0 0 1px 0px #fff inset, 0 0 1px 0px #fff
// }

// .btn-add2:active {
//   color: #fff;
//   background-color: #fff !important;
// }
</style>
<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../../../../components/modal/modal.vue";
import Storage from "../../store/index";
import {
  ResourceKindDto,
  TaskDto,
} from "../../../../services/projects/dtos/project-dto";

interface Data {
  isLoadingSubmitButton: boolean;
  storage: Storage;
  name: null | string;
  resourceKindName: null | string;
  duration: null | number;
  neededTasksIds: (null | string)[];
  resources: Resource[];
  level: number;
}

interface Resource {
  projectResourceKindId: string | null;
  count: number;
}

export default defineComponent({
  props: {
    showModal: {
      type: Boolean,
      default: false,
    }
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
            (x) => x.projectResourceKindId != null && x.count > 0
          ) &&
          this.neededTasksIds.every((x) => x != null))
      );
    },
    tasks(): TaskDto[] {
      return this.storage.tasks;
    },
    resourceKinds(): ResourceKindDto[] {
      return this.storage.resourceKinds;
    },
  },
  methods: {
    getAvailableResourceKinds(resource: Resource) {
      return this.resourceKinds.filter(
        (x) =>
          x.id == resource.projectResourceKindId ||
          this.resources.some((y) => y.projectResourceKindId == x.id) == false
      );
    },
    addNewResource() {
      this.resources.push({ projectResourceKindId: null, count: 0 });
    },
    addNewNeededTask() {
      this.neededTasksIds.push(null);
    },
    onCheckClick(taskId: string) {
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
        this.storage.addTask({
          name: this.name!,
          duration: this.duration!,
          needProjectTasksIds: this.neededTasksIds.map((x) => x!),
          resources: this.resources.map((x) => {
            return {
              projectResourceKindId: x.projectResourceKindId!,
              count: x.count,
            };
          }),
        });

        this.isLoadingSubmitButton = false;
        this.$emit("close");
      } else {
        this.storage.addResourceKind({
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
