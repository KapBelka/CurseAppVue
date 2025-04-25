<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Имя</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users">
        <td>
          {{ user.surname }} {{ user.name }}
          <span v-if="project?.creatorUserId == user.id">*</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../../../store/index";
import {
  ProjectDto,
  ProjectUserDto,
} from "../../../../../services/projects/dtos/project-dto";

export default defineComponent({
  components: {},
  data() {
    return {
      storage: storage.getInstance(),
    };
  },
  methods: {},
  computed: {
    users(): ProjectUserDto[] {
      return this.storage.users;
    },
    project(): ProjectDto | null {
      return this.storage.project;
    },
  },
  async mounted() {},
});
</script>

<style></style>
