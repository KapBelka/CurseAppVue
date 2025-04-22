import { TaskResourceDto } from "./project-dto";

export default interface AddTaskDto {
  name: string;
  duration: number;
  resources: TaskResourceDto[];
  needProjectTasksIds: string[];
}
