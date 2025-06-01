<template>
  <Modal
    size="xl"
    :showModal="show"
    title="Детали задач"
    @close="$emit('close')"
  >
    <template v-slot>
      <div class="px-1" style=" max-height: 600px">
        <!-- <table style="position: sticky; top: 0; > -->
        <table class="table table-striped rounded overflow-hidden">
          <thead>
            <tr>
              <th scope="col">Номер задачи</th>
              <th scope="col">Название</th>
              <th scope="col">Срок</th>
              <th scope="col">Предыдущие задачи</th>
              <th scope="col">Раннее начало</th>
              <th scope="col">Раннее окончание</th>
              <th scope="col">Позднее начало</th>
              <th scope="col">Позднее окончание</th>
              <th scope="col">Полный резерв</th>
              <th scope="col">Свободный резерв</th>
            </tr>
          </thead>
          <tbody>
            <tr
              style="border-color: #4f4752"
              v-for="task in tasks.sort((a, b) => a.order - b.order)"
            >
              <th scope="row">
                {{ task.order + 1 }}
              </th>
              <td>{{ task.name }}</td>
              <td>{{ task.duration }}</td>
              <td>
                {{
                  tasks
                    .filter((x) => task.needProjectTasksIds.includes(x.id))
                    .map((x) => x.order + 1)
                    .join("; ")
                }}
              </td>
              <td>
                {{ task.earlyStart }}
              </td>
              <td>
                {{ task.earlyEnd }}
              </td>
              <td>
                {{ task.lateStart }}
              </td>
              <td>
                {{ task.lateEnd }}
              </td>
              <td>
                {{ task.fullReserv }}
              </td>
              <td>{{ task.reserv }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </Modal>
</template>
<style lang="scss">
.modal-tasks-table.modal-content {
    width: 800px !important;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../../../../components/modal/modal.vue";
import Storage from "../../store/index";
import { TaskDto } from "../../../../services/projects/dtos/project-dto";

interface Data {
  storage: Storage;
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
      storage: Storage.getInstance(),
    } as Data;
  },
  watch: {
    showModal() {},
  },
  computed: {
    tasks(): TaskDto[] {
      return this.storage.tasks;
    },
  },
  methods: {},
  mounted() {},
});
</script>
