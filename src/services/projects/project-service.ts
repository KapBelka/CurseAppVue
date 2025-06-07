import Client from "../../api/client"
import AddResourceKindDto from "./dtos/add-resource-kind-dto";
import AddTaskDto from "./dtos/add-task-dto";
import CreateProjectDto from "./dtos/create-project-dto";
import { ProjectDto } from "./dtos/project-dto";
import ProjectListItemDto from "./dtos/project-list-item-dto";
import { SetResourceKindConstraintDto } from "./dtos/set-resource-kind-constraint-dto";
import { UpdateBoardTaskStatusDto } from "./dtos/update-board-task-status-dto";
import UpdateTaskDto from "./dtos/update-task-dto";
import UpdateTaskOptimizedTimeDto from "./dtos/update-task-optimized-time-dto";

export default class ProjectService {
    public async GetList(): Promise<ProjectListItemDto[] | Error> {
        return await Client.Get("Projects")
    }

    public async Get(id: string): Promise<ProjectDto | Error> {
        return await Client.Get(`Projects/${id}`)
    }

    public async CreateProject(dto: CreateProjectDto): Promise<string | Error> {
        return await Client.Post("Projects/create", dto)
    }

    public async DeleteProject(projectId: string): Promise<string | Error> {
        return await Client.Post("Projects/delete/" + projectId)
    }

    public async AddTask(projectId: string, dto: AddTaskDto): Promise<string | Error> {
        return await Client.Post(`Projects/${projectId}/add-task`, dto)
    }

    public async UpdateTask(projectId: string, taskId: string, dto: UpdateTaskDto): Promise<void | Error> {
        return await Client.Post(`Projects/${projectId}/update-task/${taskId}`, dto)
    }

    public async MoveUpTask(projectId: string, taskId: string): Promise<void | Error> {
        return await Client.Post(`Projects/${projectId}/move-up-task/${taskId}`, {})
    }

    public async MoveDownTask(projectId: string, taskId: string): Promise<void | Error> {
        return await Client.Post(`Projects/${projectId}/move-down-task/${taskId}`, {})
    }

    public async UpdateTaskOptimizedTime(projectId: string, taskId: string, dto: UpdateTaskOptimizedTimeDto): Promise<void | Error> {
        return await Client.Post(`Projects/${projectId}/set-task-optimized-time/${taskId}`, dto)
    }

    public async AddResourceKind(projectId: string, dto: AddResourceKindDto): Promise<string | Error> {
        return await Client.Post(`Projects/${projectId}/add-resource-kind`, dto)
    }

    public async SetResourceKindConstraint(projectId: string, resourceKindId: string, dto: SetResourceKindConstraintDto): Promise<string | Error> {
        return await Client.Post(`Projects/${projectId}/resource-kind/${resourceKindId}/set-constraint`, dto)
    }

    public async DeleteTask(projectId: string, taskId: string): Promise<void | Error> {
        return await Client.Post(`Projects/${projectId}/remove-task/${taskId}`)
    }

    public async UpdateBoardTaskStatus(projectId: string, taskId: string, dto: UpdateBoardTaskStatusDto) {
        return await Client.Post(`Projects/${projectId}/board-tasks/${taskId}/update-status`, dto)
    }

    public async StartProject(projectId, date: Date) {
        return await Client.Post(`Projects/${projectId}/start`, { startTime: date })
    }

    public async EndProject(projectId) {
        return await Client.Post(`Projects/${projectId}/end`)
    }
}