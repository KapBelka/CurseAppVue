import ProjectUserDto from "./project-user-dto"

export default interface ProjectListItemDto {
    id: string
    name: string
    creatorUserId: string
    stage: ProjectStage
    startTime: Date | null
    endTime: Date | null
    users: ProjectUserDto[]
}

export enum ProjectStage {
    Planning,
    InProcess,
    Done
}