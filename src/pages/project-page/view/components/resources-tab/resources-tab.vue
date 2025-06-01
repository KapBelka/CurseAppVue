<template>
  <div>
    <table class="table rounded overflow-hidden">
      <thead>
        <tr>
          <th scope="col">Название</th>
          <th scope="col">Ограничение</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resourceKind in resourceKinds">
          <td class="py-3">{{ resourceKind.name }}</td>
          <td class="align-content-center">
            <div class="d-flex align-items-center">
            <input
              v-if="selectedResourceKind?.id == resourceKind.id"
              v-model="inputValue"
              type="text"
              class="form-control"
              style="width: 100px;"
              id="constraintInput"
            />
            <span v-else>{{
              resourceKind.countConstraint ?? "Не ограничено"
            }}</span>
            <i
              v-if="selectedResourceKind?.id != resourceKind.id"
              @click="editResourceKind(resourceKind)"
              class="bi-pencil ms-2"
              style="cursor: pointer"
            ></i>
            <i
              v-else
              @click="setResourceKindConstraint()"
              class="bi-check ms-2"
              style="cursor: pointer"
            ></i>
            </div>
          </td>
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
      selectedResourceKind: null as ResourceKindDto | null,
      inputValue: 0 as Number,
    };
  },
  methods: {
    editResourceKind(resourceKind: ResourceKindDto) {
      this.inputValue = resourceKind.countConstraint ?? 0;
      this.selectedResourceKind = resourceKind;
    },
    async setResourceKindConstraint() {
      if (this.selectedResourceKind == null) return;

      await this.storage.setResourceKindConstraint({
        id: this.selectedResourceKind.id,
        countConstraint: this.inputValue == 0 ? null : this.inputValue,
      });

      this.inputValue = 0;
      this.selectedResourceKind = null;
    },
  },
  computed: {
    resourceKinds(): ResourceKindDto[] {
      return this.storage.resourceKinds;
    },
  },
  async mounted() {},
});
</script>

<style></style>
