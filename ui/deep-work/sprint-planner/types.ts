export interface SubtaskReference {
  taskId: string;
  subtaskId: string;
}

export interface TaskSelection {
  taskId: string;
  subtasks?: string[];
}