<template>
  <Modal
    :showModal="showModal"
    title="Добавление вида ресурса"
    @close="$emit('close')"
    @open="onOpen"
  >
    <template v-slot>
      <div class="mb-3">
        <label for="nameInput" class="form-label">Название</label>
        <input v-model="name" type="text" class="form-control" id="nameInput" />
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
import Storage from "../store/index";
import ResourceKind from "../store/dto/resource-kind";

interface Data {
  isLoadingSubmitButton: boolean;
  storage: Storage;
  name: null | string;
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
      name: null
    } as Data;
  },
  watch: {
    showModal() {},
  },
  computed: {
    canSave(): boolean {
      return !!this.name;
    },
    resourceKinds(): ResourceKind[] {
      return this.storage.resourceKinds;
    },
  },
  methods: {
    onOpen(): void {
      this.isLoadingSubmitButton = false;
      this.name = null
    },
    save(): void {
      this.isLoadingSubmitButton = true;
      var id = 0
      if (this.resourceKinds.length)
        id = Math.max(...this.resourceKinds.map(x => x.id)) + 1

      this.storage.addResourceKind({
        id: id,
        name: this.name!,
      });
      this.isLoadingSubmitButton = false;
      this.$emit('close')
    },
  },
  mounted() {},
});
</script>
