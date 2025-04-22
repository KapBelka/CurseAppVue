<template>
  <PageContainer>
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-outline-primary"
            @click="showCreateProjectModal = true"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <div class="rounded overflow-hidden">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Проект</th>
                <th scope="col">Владелец</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in storage.projectsList">
                <td>
                  <i
                    @click="onDeleteProjectClick(project)"
                    class="bi-trash ms-2"
                    style="cursor: pointer"
                  ></i>
                  <a class="link-opacity-100 c-pointer" @click="openProject(project)">{{
                    project.name
                  }}</a>
                </td>
                <td>
                  {{ getCreatorUser(project).surname }}
                  {{ getCreatorUser(project).name[0] }}.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <CreateProjectModal
      :show="showCreateProjectModal"
      @close="showCreateProjectModal = false"
    />
    <ConfirmModal
      :show="showConfirmDeleteProjectModal"
      @close="showConfirmDeleteProjectModal = false"
      @confirm="deleteProject()"
    >
      Вы уверены, что хотите удалить проект "<span
        class="fw-500"
        v-if="selectedProject"
        >{{ selectedProject.name }}</span
      >"
    </ConfirmModal>
  </PageContainer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import storage from "../store/index";
import PageContainer from "../../../components/pageContainer/page-container.vue";
import ProjectListItemDto from "../../../services/projects/dtos/project-list-item-dto";
import CreateProjectModal from "./modals/CreateProjectModal.vue";
import ConfirmModal from "../../../components/modal/confirm-modal.vue";

interface Data {
  storage: storage;
  showCreateProjectModal: boolean;
  showConfirmDeleteProjectModal: boolean;
  selectedProject: ProjectListItemDto | null;
}

export default defineComponent({
  components: {
    PageContainer,
    CreateProjectModal,
    ConfirmModal,
  },
  data() {
    return {
      storage: storage.getInstance(),
      showCreateProjectModal: false,
      showConfirmDeleteProjectModal: false,
      selectedProject: null,
    } as Data;
  },
  methods: {
    getCreatorUser(project: ProjectListItemDto) {
      return project.users.find((x) => x.id == project.creatorUserId)!;
    },
    onDeleteProjectClick(project: ProjectListItemDto) {
      this.selectedProject = project;
      this.showConfirmDeleteProjectModal = true;
    },
    deleteProject() {
      if (this.selectedProject)
        this.storage.deleteProject({ id: this.selectedProject.id });

      this.showConfirmDeleteProjectModal = false;
      this.selectedProject = null;
    },
    openProject(project: ProjectListItemDto) {
      this.$router.push("/project/" + project.id);
    },
  },
  computed: {},
  watch: {},
  async mounted() {
    await this.storage.loadCurrentUser();
    await this.storage.loadProjectsList();
  },
});
</script>

<style></style>
