import { use } from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  subtasks: Subtask[];
}

interface State {
  tasksByStatus: {
    [status: string]: Task[];
  };
}

export default new Vuex.Store<State>({
  state: {
    tasksByStatus: {
      Сделать: [
        {
          id: 1,
          title: "Задача 1",
          description: "Описание задачи 1",
          assignee: "Иван",
          subtasks: [
            { id: 1, title: "Подзадача 1", completed: false },
            { id: 2, title: "Подзадача 2", completed: true },
          ],
        },
      ],
      "В работе": [],
      Сделано: [],
      Принято: [],
    },
  },
  mutations: {
    moveTask(state, payload) {
      const { taskId, fromStatus, toStatus } = payload;
      const taskIndex = state.tasksByStatus[fromStatus].findIndex(
        (t) => t.id === taskId
      );
      if (taskIndex !== -1) {
        const [task] = state.tasksByStatus[fromStatus].splice(taskIndex, 1);
        state.tasksByStatus[toStatus].push(task);
      }
    },
    addTask(state, payload) {
      const { status, task } = payload;
      state.tasksByStatus[status].push(task);
    },
    updateTask(state, payload) {
      const { status, task } = payload;
      const index = state.tasksByStatus[status].findIndex(
        (t) => t.id === task.id
      );
      if (index !== -1) {
        Vue.set(state.tasksByStatus[status], index, task);
      }
    },
    deleteTask(state, payload) {
      const { status, taskId } = payload;
      const index = state.tasksByStatus[status].findIndex(
        (t) => t.id === taskId
      );
      if (index !== -1) {
        state.tasksByStatus[status].splice(index, 1);
      }
    },
  },
});
