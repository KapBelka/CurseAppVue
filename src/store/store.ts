import Vuex from 'vuex'
import { Commit } from 'vuex/types/index.js'
import Task, { CalculatedTask } from './dto/task'
import calculateTasks from './taskCalculator'
import ResourceKind from './dto/resource-kind'

interface State {
  tasks: Task[]
  calculatedTasks: CalculatedTask[]
  selectedTask: Task | null
  resourceKinds: ResourceKind[]
}

// Create a new store instance.
const store = new Vuex.Store({
  state () {
    return {
      tasks: [],
      calculatedTasks: [],
      selectedTask: null,
      resourceKinds: []
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
        existTask.resources = task.resources
      }
    },
    deleteTask(state: State, taskId: number) {
      state.tasks = state.tasks.filter(x => x.id != taskId)
      for (var task of state.tasks) {
        task.needTasksIds = task.needTasksIds.filter(x => x != taskId)
      }
    },
    addResourceKind(state: State, resourceKind: ResourceKind) {
      state.resourceKinds.push(resourceKind)
    },
    updateResourceKind(state: State, resourceKind: ResourceKind) {
      // var existResourceKind = state.tasks.find(x => x.id == task.id)
      // if (existTask) {
      //   existTask.name = task.name
      //   existTask.duration = task.duration
      //   existTask.needTasksIds = task.needTasksIds
      //   existTask.power = task.power
      // }
    },
    deleteResourceKind(state: State, resourceKindId: number) {
      //state.resourceKinds = state.tasks.filter(x => x.id != resourceKindId)
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
    addResourceKind({ commit }: { commit: Commit}, resourceKind: ResourceKind) {
      commit('addResourceKind', resourceKind)
    },
    updateResourceKind({ commit }: { commit: Commit}, resourceKind: ResourceKind) {
      commit('updateResourceKind', resourceKind)
    },
    deleteResourceKind({ commit }: { commit: Commit}, resourceKindId: number) {
      commit('deleteResourceKind', resourceKindId)
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