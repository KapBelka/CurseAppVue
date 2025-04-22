<template>
  <Modal
    :showModal="show"
    :title="title"
    @close="$emit('close')"
    @open="onOpen"
  >
    <template v-slot>
      <slot></slot>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="$emit('close')">Отмена</button>
      <button class="btn btn-primary" @click="confirm">Подтвердить</button>
    </template>
  </Modal>
</template>
<style lang="scss" scoped></style>
<script lang="ts">
import { defineComponent } from "vue";
import modal from "./modal.vue";

interface Data {}

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  components: {
    Modal: modal,
  },
  data() {
    return {} as Data;
  },
  watch: {},
  computed: {},
  methods: {
    onOpen(): void {},
    confirm(): void {
      this.$emit("confirm");
    },
  },
  mounted() {},
});
</script>
