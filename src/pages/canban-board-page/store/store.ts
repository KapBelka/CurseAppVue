import Vuex from "vuex";
import { Commit, Dispatch, Store } from "vuex/types/index.js";
import { ProjectPageServices } from "./services";
import CurrentUserDto from "../../../services/auth/dtos/current-user-dto";
import { ProjectDto } from "../../../services/projects/dtos/project-dto";

interface State {
  currentUser: CurrentUserDto | null;
  project: ProjectDto | null;
}

// Create a new store instance.
const store = new Vuex.Store({
  state(): State {
    return {
      currentUser: null,
      project: null,
    } as State;
  },
  mutations: {
    setCurrentUser(state: State, currentUser: CurrentUserDto) {
      state.currentUser = currentUser;
    },
    setProject(state: State, project: ProjectDto) {
      state.project = project;
    },
    setTaskStatus(
      state: State,
      payload: { taskId: string; status: string; order: number }
    ) {
      var task = state.project?.boardTasks.find((x) => x.id == payload.taskId);
      if (!task) return;

      task.status = payload.status;
      var tasksByStatus =
        state.project?.boardTasks.filter((x) => x.status == payload.status) ??
        [];

      var i = 0;
      tasksByStatus
        .filter((x) => x.id != task!.id)
        .forEach((x) => {
          if (i == payload.order) i++;

          x.order = i;
          i++;
        });

      task.order = payload.order ?? tasksByStatus.length;
    },
  },
  actions: {
    async updateTaskStatus(
      { commit, state }: { commit: Commit; state: State },
      payload: { taskId: string; status: string; order: number }
    ) {
      if (!state.project)
        return;

      var response = ProjectPageServices.ProjectService.UpdateBoardTaskStatus(state.project.id, payload.taskId, payload)
      if (response instanceof Error)
        return;

      commit("setTaskStatus", payload);
    },
    async loadCurrentUser({ commit }: { commit: Commit }) {
      var response = await ProjectPageServices.AuthService.GetCurrentUser();
      if (response instanceof Error) return;

      commit("setCurrentUser", response);
    },
    async loadProject(
      { commit, state }: { commit: Commit; state: State },
      payload: { id: string }
    ) {
      var response = await ProjectPageServices.ProjectService.Get(payload.id);
      if (response instanceof Error) return;

      commit("setProject", response);
    },
    async endProject({ commit, state, dispatch }: { commit: Commit; state: State, dispatch: Dispatch }) {
      if (!state.project) return;

      var response = await ProjectPageServices.ProjectService.EndProject(
        state.project.id
      );
      if (response instanceof Error) return;

      dispatch("loadProject", { id: state.project.id })
    }
  },
}) as Store<State>;

export default store;
