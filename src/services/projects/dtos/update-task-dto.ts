import { TaskResourceDto } from "./project-dto"

export default interface UpdateTaskDto {
    name: string
    duration: number
    resources: TaskResourceDto[]
    needProjectTasksIds: string[]
}