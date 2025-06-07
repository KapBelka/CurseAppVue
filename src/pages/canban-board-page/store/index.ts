import storage from "./store";

export default class Storage {
  //private storage = storage // переменная, чтобы было видно хранилище во Vue DevTools
  private static instance: Storage;

  private constructor() {}

  static getInstance(): Storage {
    if (!Storage.instance) Storage.instance = new Storage();
    return Storage.instance;
  }

  get tasks() {
    return storage.state.project?.boardTasks?.sort((a, b) => a.order - b.order) ?? [];
  }

  get project() {
    return storage.state.project;
  }

  async updateTaskStatus(payload: { taskId: string, status: string, order: number }) {
    await storage.dispatch("updateTaskStatus", payload);
  }

  async loadCurrentUser() {
    await storage.dispatch("loadCurrentUser");
  }

  async loadProject(payload: {id: string}) {
    await storage.dispatch("loadProject", payload);
  }
  async endProject() {
    await storage.dispatch("endProject")
  }
}
