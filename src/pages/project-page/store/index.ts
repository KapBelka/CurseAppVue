import storage from "./store";
import ProjectListItemDto from "../../../services/projects/dtos/project-list-item-dto";
import {
  ProjectDto,
  ResourceKindDto,
  TaskDto,
  TaskResourceDto,
} from "../../../services/projects/dtos/project-dto";

export default class Storage {
  //private storage = storage // переменная, чтобы было видно хранилище во Vue DevTools
  private static instance: Storage;

  private constructor() {}

  static getInstance(): Storage {
    if (!Storage.instance) Storage.instance = new Storage();
    return Storage.instance;
  }

  get tasks(): TaskDto[] {
    return storage.state.project?.tasks ?? [];
  }

  get resourceKinds(): ResourceKindDto[] {
    return storage.state.project?.resourceKinds ?? [];
  }

  get projectsList(): ProjectListItemDto[] {
    return storage.state.projectsList;
  }

  get project(): ProjectDto | null {
    return storage.state.project;
  }

  async loadProjectsList() {
    await storage.dispatch("loadProjectsList");
  }

  async loadCurrentUser() {
    await storage.dispatch("loadCurrentUser");
  }

  async loadProject(payload: {id: string}) {
    await storage.dispatch("loadProject", payload);
  }

  async createProject(payload: { name: string }) {
    await storage.dispatch("createProject", payload);
  }

  async deleteProject(payload: { id: string }) {
    await storage.dispatch("deleteProject", payload);
  }

  async addTask(payload: {
    name: string;
    duration: number;
    resources: TaskResourceDto[];
    needProjectTasksIds: string[];
  }) {
    await storage.dispatch("addTask", payload);
  }

  async deleteTask(payload: { taskId: string }) {
    await storage.dispatch("deleteTask", payload);
  }

  async updateTask(payload: {
    id: string;
    name: string;
    duration: number;
    resources: TaskResourceDto[];
    needProjectTasksIds: string[];
  }) {
    await storage.dispatch("updateTask", payload);
  }

  async moveUpTask(payload: TaskDto) {
    await storage.dispatch("moveUpTask", payload);
  }

  async moveDownTask(payload: TaskDto) {
    await storage.dispatch("moveDownTask", payload);
  }

  async updateTaskOptimizedTime(payload: {
    id: string;
    start: number;
    end: number;
  }) {
    await storage.dispatch("updateTaskOptimizedTime", payload);
  }

  async addResourceKind(payload: { name: string }) {
    await storage.dispatch("addResourceKind", payload);
  }
}
