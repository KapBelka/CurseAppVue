<template>
  <div
    ref="toast"
    class="toast"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    data-bs-autohide="false"
  >
    <div class="toast-header">
      <strong class="me-auto">Произошла ошибка</strong>
      <small class="text-body-secondary">{{}}</small>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
    <div class="toast-body">{{error}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as bootstrap from 'bootstrap'

interface Data {}

export default defineComponent({
  components: {},
  props: {
    error: { type: String }
  },
  data() {
    return {} as Data;
  },
  methods: {
  },
  computed: {},
  watch: {},
  async mounted() {
    var toast = bootstrap.Toast.getOrCreateInstance(this.$refs.toast as Element)
    toast.show();
  },
});
</script>
