import Vuex from "vuex";
import { Commit, Store } from "vuex/types/index.js";
import { ProjectPageServices } from "./services";
import ProjectListItemDto from "../../../services/projects/dtos/project-list-item-dto";
import CurrentUserDto from "../../../services/auth/dtos/current-user-dto";
import {
  ProjectDto,
  ResourceKindDto,
  TaskDto,
  TaskResourceDto,
} from "../../../services/projects/dtos/project-dto";

interface State {
  currentUser: CurrentUserDto | null;
  projectsList: ProjectListItemDto[];
  project: ProjectDto | null;
}

// Create a new store instance.
const store = new Vuex.Store({
  state(): State {
    return {
      currentUser: null,
      projectsList: [],
      project: null,
      calculatedTasks: [],
    } as State;
  },
  mutations: {
    setCurrentUser(state: State, currentUser: CurrentUserDto) {
      state.currentUser = currentUser;
    },
    setProjectsList(state: State, projects: ProjectListItemDto[]) {
      state.projectsList = projects;
    },
    setProject(state: State, project: ProjectDto) {
      state.project = project;
    },
    addProjectToList(state: State, project: ProjectListItemDto) {
      state.projectsList.push(project);
    },
    removeProjectFromList(state: State, id: string) {
      state.projectsList = state.projectsList.filter((x) => x.id != id);
    },
    addTask(state: State, task: TaskDto) {
      if (!state.project) return;

      state.project.tasks.push(task);
    },
    moveUpTask(state: State, task: TaskDto) {
      if (!state.project) return;

      var nextTask = state.project.tasks.find((x) => x.order == task.order + 1);

      if (nextTask) {
        nextTask.order--;
        task.order++;
      } 
    },
    moveDownTask(state: State, task: TaskDto) {
      if (!state.project) return;

      var prevTask = state.project.tasks.find((x) => x.order == task.order + 1);

      if (prevTask) {
        prevTask.order++;
        task.order--;
      } 
    },
    updateTask(state: State, task: TaskDto) {
      if (!state.project) return;

      var existTask = state.project.tasks.find((x) => x.id == task.id);
      if (existTask) {
        existTask.name = task.name;
        existTask.duration = task.duration;
        existTask.needProjectTasksIds = task.needProjectTasksIds;
        existTask.resources = task.resources;
      }
    },
    deleteTask(state: State, taskId: string) {
      if (!state.project) return;

      state.project.tasks.splice(
        state.project.tasks.findIndex((x) => x.id == taskId),
        1
      );
      for (var task of state.project.tasks) {
        if (task.needProjectTasksIds.includes(taskId))
          task.needProjectTasksIds.splice(
            task.needProjectTasksIds.findIndex((x) => x == taskId),
            1
          );
      }
    },
    addResourceKind(state: State, resourceKind: ResourceKindDto) {
      if (!state.project) return;

      state.project.resourceKinds.push(resourceKind);
    },
    // updateResourceKind(state: State, resourceKind: ResourceKindDto) {
    //   // var existResourceKind = state.tasks.find(x => x.id == task.id)
    //   // if (existTask) {
    //   //   existTask.name = task.name
    //   //   existTask.duration = task.duration
    //   //   existTask.needTasksIds = task.needTasksIds
    //   //   existTask.power = task.power
    //   // }
    // },
    // deleteResourceKind(state: State, resourceKindId: string) {
    //   //state.resourceKinds = state.tasks.filter(x => x.id != resourceKindId)
    // },
  },
  actions: {
    async loadCurrentUser({ commit }: { commit: Commit }) {
      var response = await ProjectPageServices.AuthService.GetCurrentUser();
      if (response instanceof Error) return;

      commit("setCurrentUser", response);
    },
    async loadProjectsList({ commit }: { commit: Commit }) {
      var response = await ProjectPageServices.ProjectService.GetList();
      if (response instanceof Error) return;

      commit("setProjectsList", response);
    },
    async createProject(
      { commit, state }: { commit: Commit; state: State },
      payload: { name: string }
    ) {
      var response = await ProjectPageServices.ProjectService.CreateProject(
        payload
      );
      if (response instanceof Error) return;

      if (!state.currentUser) return;

      commit("addProjectToList", {
        id: response,
        name: payload.name,
        creatorUserId: state.currentUser.id,
        users: [
          {
            id: state.currentUser.id,
            name: state.currentUser.name,
            surname: state.currentUser.surname,
          },
        ],
      } as ProjectListItemDto);
    },
    async deleteProject(
      { commit, state }: { commit: Commit; state: State },
      payload: { id: string }
    ) {
      var response = await ProjectPageServices.ProjectService.DeleteProject(
        payload.id
      );
      if (response instanceof Error) return;

      commit("removeProjectFromList", payload.id);
    },
    async loadProject(
      { commit, state }: { commit: Commit; state: State },
      payload: { id: string }
    ) {
      var response = await ProjectPageServices.ProjectService.Get(payload.id);
      if (response instanceof Error) return;

      commit("setProject", response);
    },
    async addTask(
      { commit, state }: { commit: Commit; state: State },
      payload: {
        name: string;
        duration: number;
        resources: TaskResourceDto[];
        needProjectTasksIds: string[];
      }
    ) {
      if (!state.project) return;

      var response = await ProjectPageServices.ProjectService.AddTask(
        state.project.id,
        payload
      );
      if (response instanceof Error) return;

      commit("addTask", { id: response, ...payload } as TaskDto);
    },
    async updateTask(
      { commit, state }: { commit: Commit; state: State },
      payload: {
        id: string;
        name: string;
        duration: number;
        resources: TaskResourceDto[];
        needProjectTasksIds: string[];
      }
    ) {
      if (!state.project) return;

      var response = await ProjectPageServices.ProjectService.UpdateTask(
        state.project.id,
        payload.id,
        payload
      );
      if (response instanceof Error) return;

      commit("updateTask", payload as TaskDto);
    },
    async updateTaskOptimizedTime(
      { commit, state }: { commit: Commit; state: State },
      payload: {
        id: string;
        start: number;
        end: number;
      }
    ) {
      if (!state.project) return;

      var response = await ProjectPageServices.ProjectService.UpdateTaskOptimizedTime(
        state.project.id,
        payload.id,
        payload
      );
      if (response instanceof Error) return;
    },
    async deleteTask(
      { commit, state }: { commit: Commit; state: State },
      payload: { taskId: string }
    ) {
      if (!state.project) return;

      var response = await ProjectPageServices.ProjectService.DeleteTask(
        state.project.id,
        payload.taskId
      );
      if (response instanceof Error) return;

      commit("deleteTask", payload.taskId);
    },
    async addResourceKind(
      { commit, state }: { commit: Commit; state: State },
      payload: { name: string }
    ) {
      if (!state.project) return;

      var response = await ProjectPageServices.ProjectService.AddResourceKind(
        state.project.id,
        payload
      );
      if (response instanceof Error) return;

      commit("addResourceKind", {
        id: response,
        name: payload.name,
      } as ResourceKindDto);
    },
    // async updateResourceKind(
    //   { commit }: { commit: Commit },
    //   resourceKind: ResourceKindDto
    // ) {
    //   commit("updateResourceKind", resourceKind);
    // },
    // async deleteResourceKind(
    //   { commit }: { commit: Commit },
    //   resourceKindId: number
    // ) {
    //   commit("deleteResourceKind", resourceKindId);
    // },
  },
}) as Store<State>;

export default store;
