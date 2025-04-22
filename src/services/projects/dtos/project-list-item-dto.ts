import ProjectUserDto from "./project-user-dto"

export default interface ProjectListItemDto {
    id: string
    name: string
    creatorUserId: string
    users: ProjectUserDto[]
}