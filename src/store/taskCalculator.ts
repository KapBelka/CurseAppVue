import Task, { CalculatedTask } from "./dto/task";

/**
 * Прямой проход вычисляющий ранние начало и конец
 * @param tasks задачи 
 */
function forwardCalculate(tasks: CalculatedTask[]) {
  forwardCalculateZeroTasks(tasks);
  forwardCalculateOtherTasks(tasks);
}


/**
 * Вычисление ранних начало и конец для операций начинающиеся в 0 момент времени
 * @param tasks задачи
 */
function forwardCalculateZeroTasks(tasks: CalculatedTask[]) {
  var zeroTasks = tasks.filter((x) => x.needTasksIds.length == 0);
  for (var task of zeroTasks) {
    task.earlyStart = 0;
    task.earlyEnd = task.duration;
  }
}

/**
 * Вычисление ранних начало и конец для всех операций кроме начинающихся в 0 момент времени
 * @param tasks задачи
 */
function forwardCalculateOtherTasks(tasks: CalculatedTask[]) {
  while (tasks.some((x) => x.earlyStart == null)) {
    var tasksForCalculate = tasks.filter((x) => x.earlyStart == null);

    for (var task of tasksForCalculate) {
      var neededTasks = getNeededTasks(task, tasks);
      if (neededTasks.every((x) => x.earlyStart != null)) {
        var earlyStart = Math.max(...neededTasks.map((x) => x.earlyEnd!));
        task.earlyStart = earlyStart;
        task.earlyEnd = earlyStart + task.duration;
      }
    }
  }
}

/**
 * Обратный проход вычисляющий поздние начало и конец
 * @param tasks задачи 
 */
function backCalculate(tasks: CalculatedTask[]) {
  backCalculateZeroTasks(tasks);
  backCalculateOtherTasks(tasks);
}

/**
 * Вычисление поздних начало и конец для операций заканчивающихся в момент завершения проекта
 * @param tasks задачи
 */
function backCalculateZeroTasks(
  tasks: CalculatedTask[]
) {
  var earlyEndOfAll = Math.max(...tasks.map((x) => x.earlyEnd!));

  var zeroTasks = tasks.filter((x) => getTasksThatNeed(x, tasks).length == 0);
  for (var task of zeroTasks) {
    task.lateEnd = earlyEndOfAll;
    task.lateStart = earlyEndOfAll - task.duration;
  }
}

/**
 * Вычисление поздних начало и конец для всех операций кроме заканчивающихся в момент завершения проекта
 * @param tasks задачи
 */
function backCalculateOtherTasks(tasks: CalculatedTask[]) {
  while (tasks.some((x) => x.lateStart == null)) {
    var tasksForCalculate = tasks.filter((x) => x.lateStart == null);

    for (var task of tasksForCalculate) {
      var tasksThatNeed = getTasksThatNeed(task, tasks);
      if (tasksThatNeed.every((x) => x.lateStart != null)) {
        var lateEnd = Math.min(...tasksThatNeed.map((x) => x.lateStart!));

        task.lateEnd = lateEnd;
        task.lateStart = lateEnd - task.duration;
      }
    }
  }
}

/**
 * Получаем операции которые должны быть выполнены перед началом операции {@link task}
 * @param task операция
 * @param tasks операции
 * @returns набор операции необходимые для начала выполнения операции {@link task}
 */
function getNeededTasks(
  task: CalculatedTask,
  tasks: CalculatedTask[]
): CalculatedTask[] {
  return tasks.filter((x) => task.needTasksIds.includes(x.id));
}

/**
 * Получаем операции для начала которых, необходимо выполнить операцию {@link task}
 * @param task операция
 * @param tasks операции
 * @returns набор операции для начала которых, необходимо выполнить операцию {@link task}
 */
function getTasksThatNeed(
  task: CalculatedTask,
  tasks: CalculatedTask[]
): CalculatedTask[] {
  return tasks.filter((x) => x.needTasksIds.includes(task.id));
}

/**
 * Подготавливаем данные для вычисления ранних и поздних начала и конец и полного и свободного резервов
 * @param tasks операции
 * @returns подготовленные для заполнения данные
 */
function mapCalculatedTask(tasks: Task[]): CalculatedTask[] {
  var calculatedTasks = [] as CalculatedTask[];
  for (var task of tasks) {
    calculatedTasks.push({
      id: task.id,
      name: task.name,
      duration: task.duration,
      power: task.power,
      needTasksIds: task.needTasksIds,
      isCritical: null,
      earlyStart: null,
      earlyEnd: null,
      lateStart: null,
      lateEnd: null,
      fullReserv: null,
      reserv: null,
    });
  }
  return calculatedTasks;
}

/**
 * Вычисляем для операций {@link tasks} резервы
 * @param tasks задачи
 */
function calculateReserv(tasks: CalculatedTask[]) {
  var earlyEndOfAll = Math.max(...tasks.map((x) => x.earlyEnd!));

  for (var task of tasks) {
    task.fullReserv = task.lateStart! - task.earlyStart!

    var neededTasks = getTasksThatNeed(task, tasks);
    if (neededTasks.length) {
      task.reserv = Math.max(...neededTasks.map(x => x.earlyStart!)) - task.earlyStart! - task.duration
    }
    else {
      task.reserv = earlyEndOfAll - task.earlyStart! - task.duration
    }
  }
}

/**
 * Вычисляем ранние и поздние начала и конец и полного и свободного резервов
 * @param tasks задачи
 * @returns задачи с их вычисленными ранними и поздними началами и концами и полным и свободными резервами
 */
export default function calculateTasks(tasks: Task[]): CalculatedTask[] {
  var calculatedTasks = mapCalculatedTask(tasks);
  forwardCalculate(calculatedTasks);
  backCalculate(calculatedTasks);
  calculateReserv(calculatedTasks);

  return calculatedTasks;
}
