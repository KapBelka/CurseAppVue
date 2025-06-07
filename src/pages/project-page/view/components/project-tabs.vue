<template>
  <div class="btn-group" id="project-tabs" role="tablist">
      <button
        class="btn btn-dark active"
        id="main-tab"
        data-bs-toggle="tab"
        data-bs-target="#main"
        type="button"
        role="tab"
        aria-controls="main"
        aria-selected="true"
      >
        Главная
      </button>
      <button
        class="btn btn-dark"
        id="resources-tab"
        data-bs-toggle="tab"
        data-bs-target="#resources"
        type="button"
        role="tab"
        aria-controls="resources"
        aria-selected="false"
      >
        Ресурсы
      </button>
      <button
        class="btn btn-dark"
        id="users-tab"
        data-bs-toggle="tab"
        data-bs-target="#users"
        type="button"
        role="tab"
        aria-controls="users"
        aria-selected="false"
      >
        Участники
      </button>
  </div>
  <div class="tab-content mt-2" id="myTabContent">
    <div
      class="tab-pane fade show active"
      id="main"
      role="tabpanel"
      aria-labelledby="main-tab"
    >
      <MainTab />
    </div>
    <div
      class="tab-pane fade"
      id="resources"
      role="tabpanel"
      aria-labelledby="resources-tab"
    >
      <ResourcesTab />
    </div>
    <div
      class="tab-pane fade"
      id="users"
      role="tabpanel"
      aria-labelledby="users-tab"
    >
      <UsersTab />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../../store/index";
import MainTab from "./main-tab/main-tab.vue";
import ResourcesTab from "./resources-tab/resources-tab.vue";
import UsersTab from "./users-tab/users-tab.vue";

export default defineComponent({
  components: { MainTab, ResourcesTab, UsersTab },
  data() {
    return {
      storage: storage.getInstance(),
    };
  },
  methods: {},
  computed: {},
  async mounted() {},
});
</script>
