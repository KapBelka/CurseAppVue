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
    return storage.state.project?.tasks?.sort((a, b) => a.order - b.order) ?? [];
  }

  get project() {
    return storage.state.project;
  }

  async loadCurrentUser() {
    await storage.dispatch("loadCurrentUser");
  }

  async loadProject(payload: {id: string}) {
    await storage.dispatch("loadProject", payload);
  }
}
