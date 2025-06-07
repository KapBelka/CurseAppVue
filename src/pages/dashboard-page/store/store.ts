import Vuex from "vuex";
import { Commit, Store } from "vuex/types/index.js";
import { ProjectPageServices } from "./services";
import CurrentUserDto from "../../../services/auth/dtos/current-user-dto";
import {
  ProjectDto
} from "../../../services/projects/dtos/project-dto";

interface State {
  currentUser: CurrentUserDto | null;
  project: ProjectDto | null;
}

// Create a new store instance.
const store = new Vuex.Store({
  state(): State {
    return {
      currentUser: null,
      project: null
    } as State;
  },
  mutations: {
    setCurrentUser(state: State, currentUser: CurrentUserDto) {
      state.currentUser = currentUser;
    },
    setProject(state: State, project: ProjectDto) {
      state.project = project;
    }
  },
  actions: {
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
    }
  },
}) as Store<State>;

export default store;
