<template>
  <div
    id="error-toasts-container"
    class="toast-container top-0 end-0 p-3"
  >
    <Toast v-for="error in errors" :error="(error as string)"></Toast>
  </div>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Toast from "./components/errorMessages/toast.vue";
import { toastStore } from "./components/errorMessages/ErrorMessages";

interface Data { }

export default defineComponent({
  components: {
    Toast
  },
  data() {
    return {
    } as Data;
  },
  methods: {},
  computed: {
    errors() {
      return toastStore.errors;
    }
  },
  watch: {
  },
  async mounted() {},
});
</script>

<style></style>
