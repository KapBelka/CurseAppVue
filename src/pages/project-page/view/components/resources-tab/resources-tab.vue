<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Название</th>
          <th scope="col">Ограничение</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resourceKind in resourceKinds">
          <td>{{ resourceKind.name }}</td>
          <td>Не ограничено</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../../../store/index";
import { ResourceKindDto } from "../../../../../services/projects/dtos/project-dto";

export default defineComponent({
  components: {},
  data() {
    return {
      storage: storage.getInstance(),
    };
  },
  methods: {},
  computed: {
    resourceKinds(): ResourceKindDto[] {
      return this.storage.resourceKinds;
    },
  },
  async mounted() {},
});
</script>

<style></style>
