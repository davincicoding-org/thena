// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { ProjectSelect } from "./db";
import type { StandaloneTask, Tag, TaskTree } from "./types";

export const createMockTasks = (subtasks: number[]) =>
  subtasks.map<TaskTree | StandaloneTask>((subtask = 0, index) => ({
    uid: index,
    title: `Task ${index + 1}`,
    subtasks: subtask
      ? Array.from({ length: subtask }, (_, i) => ({
          uid: index * 1000 + i,
          title: `Subtask ${index + 1}-${i + 1}`,
          parrent: {
            uid: index,
            title: `Task ${index + 1}`,
          },
        }))
      : undefined,
  }));

export const MOCK_PROJECTS: ProjectSelect[] = [
  { uid: 1, title: "Thena", description: null, image: null },
  { uid: 2, title: "KOCO", description: null, image: null },
  { uid: 3, title: "DAVINCI CODING", description: null, image: "/dvc.png" },
  { uid: 4, title: "Swissinfluece", description: null, image: null },
  { uid: 5, title: "T4 Capital", description: null, image: null },
];

export const MOCK_TAGS: Tag[] = [
  { id: "res", name: "Research", color: "yellow" },
  { id: "des", name: "Design", color: "green" },
  { id: "dev", name: "Development", color: "cyan" },
  { id: "mar", name: "Marketing", color: "grape" },
  { id: "man", name: "Management" },
];
