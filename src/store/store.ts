import Vuex from 'vuex'
import { Commit } from 'vuex/types/index.js'
import Task, { CalculatedTask } from './dto/task'
import calculateTasks from './taskCalculator'

interface State {
  tasks: Task[]
  calculatedTasks: CalculatedTask[]
  selectedTask: Task | null
}

// Create a new store instance.
const store = new Vuex.Store({
  state () {
    return {
      tasks: [],
      calculatedTasks: [],
      selectedTask: null
    } as State
  },
  mutations: {
    addTask(state: State, task: Task) {
      state.tasks.push(task)
    },
    updateTask(state: State, task: Task) {
      var existTask = state.tasks.find(x => x.id == task.id)
      if (existTask) {
        existTask.name = task.name
        existTask.duration = task.duration
        existTask.needTasksIds = task.needTasksIds
        existTask.power = task.power
      }
    },
    deleteTask(state: State, taskId: number) {
      state.tasks = state.tasks.filter(x => x.id != taskId)
      for (var task of state.tasks) {
        task.needTasksIds = task.needTasksIds.filter(x => x != taskId)
      }
    },
    selectTask(state: State, task: Task) {
      state.selectedTask = task
    },
    calculateTasks(state: State) {
      state.calculatedTasks = calculateTasks(state.tasks)
    }
  },
  actions: {
    addTask({ commit }: { commit: Commit}, task: Task) {
      commit('addTask', task)
      commit('calculateTasks')
    },
    updateTask({ commit }: { commit: Commit}, task: Task) {
      commit('updateTask', task)
      commit('calculateTasks')
    },
    deleteTask({ commit }: { commit: Commit}, taskId: number) {
      commit('deleteTask', taskId)
      commit('calculateTasks')
    },
    selectTask({ commit }: { commit: Commit}, task: Task) {
      commit('selectTask', task)
    }
  }
})

store.subscribe((_mutation: any, state: State) => {
	localStorage.setItem('store', JSON.stringify(state));
})

export default store