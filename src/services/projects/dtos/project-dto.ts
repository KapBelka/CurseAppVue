export interface ProjectDto {
  id: string;
  name: string;
  creatorUserId: string;
  linksForJoin: LinkForJoinDto[];
  users: ProjectUserDto[];
  tasks: TaskDto[];
  resourceKinds: ResourceKindDto[];
}

export interface LinkForJoinDto {
  link: string;
  expiresDate: Date;
}

export interface TaskDto {
  id: string;
  name: string;
  duration: number;
  resources: TaskResourceDto[];
  needProjectTasksIds: string[];
  isCritical: boolean;
  earlyStart: number;
  earlyEnd: number;
  lateStart: number;
  lateEnd: number;
  optimizedStart: number;
  optimizedEnd: number;
  fullReserv: number;
  reserv: number;
}

export interface TaskResourceDto {
  projectResourceKindId: string;
  count: number;
}

export interface ProjectUserDto {
  id: string;
  name: string;
  surname: string;
}

export interface ResourceKindDto {
  id: string;
  name: string;
}
