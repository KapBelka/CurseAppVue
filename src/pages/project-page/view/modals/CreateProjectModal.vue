<template>
  <Modal
    :showModal="show"
    title="Создание проекта"
    @close="$emit('close')"
    @open="onOpen"
  >
    <template v-slot>
      <div class="form-group">
        <label for="projectName">Название</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          id="projectName"
          placeholder="Название"
        />
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
        Создать
      </button>
    </template>
  </Modal>
</template>
<style lang="scss" scoped></style>
<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../../../../components/modal/modal.vue";
import Storage from "../../store/index";

interface Data {
  isLoadingSubmitButton: boolean;
  storage: Storage;
  name: null | string;
}

export default defineComponent({
  props: {
    show: {
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
    } as Data;
  },
  watch: {
    showModal() {},
  },
  computed: {
    canSave(): boolean {
      return !!this.name;
    },
  },
  methods: {
    onOpen(): void {
      this.isLoadingSubmitButton = false;
      this.name = null;
    },
    save(): void {
      if (!this.canSave) return;

      this.isLoadingSubmitButton = true;

      this.storage.createProject({ name: this.name! });

      this.isLoadingSubmitButton = false;
      this.$emit("close");
    },
  },
  mounted() {},
});
</script>
