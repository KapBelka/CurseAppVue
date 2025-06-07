export interface ProjectDto {
  id: string;
  name: string;
  startTime: Date;
  creatorUserId: string;
  linksForJoin: LinkForJoinDto[];
  users: ProjectUserDto[];
  tasks: TaskDto[];
  boardTasks: BoardTaskDto[];
  resourceKinds: ResourceKindDto[];
}

export interface LinkForJoinDto {
  link: string;
  expiresDate: Date;
}

export interface TaskDto {
  id: string;
  order: number;
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
  isEarlyResourceExceeded: boolean;
  isLateResourceExceeded: boolean;
  isOptimizedResourceExceeded: boolean;
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
  countConstraint: number | null;
  remainingCount: number | null;
  optimalCount: number;
}

export interface BoardTaskDto {
  id: string;
  projectTaskId: string | null;
  name: string;
  description: string | null; 
  executor: string | null;
  subtasks: [];
  status: string;
  state: string;
  order: number;
  planTimeBegin: Date | null;
  planTimeEnd: Date | null;
  factTimeBegin: Date | null;
  factTimeEnd: Date | null;
  reservTime: number;
}
