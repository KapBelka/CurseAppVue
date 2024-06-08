import Task, { CalculatedTask } from "./dto/task"
import storage from "./store"

export default class Storage {
  //private storage = storage // переменная, чтобы было видно хранилище во Vue DevTools
  private static instance: Storage

  private constructor() {}

  static getInstance(): Storage {
    if (!Storage.instance) Storage.instance = new Storage()
    return Storage.instance
  }

  get tasks(): Task[] {
    return storage.state.tasks
  }

  get calculatedTasks(): CalculatedTask[] {
    return storage.state.calculatedTasks
  }

  get selectedTask(): Task {
    return storage.state.selectedTask
  }

  addTask(task: Task) {
    storage.dispatch('addTask', task)
  }
  
  deleteTask(taskId: number) {
    storage.dispatch('deleteTask', taskId)
  }
  
  updateTask(task: Task) {
    storage.dispatch('updateTask', task)
  }

  selectTask(task: Task) {
    storage.dispatch('selectTask', task)
  }

  initialiseStore() {
    if(localStorage.getItem('store')) {
      // Replace the state object with the stored item
      storage.replaceState(
        Object.assign(storage.state, JSON.parse(localStorage.getItem('store')!))
      );
      storage.commit('calculateTasks')
    }
  }
}
