import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { Project } from "@/core/task-management";
import { createUniqueId } from "@/ui/utils";

import { localDB } from "../../store";

export type ProjectMatcher = (project: Project) => boolean;

export interface ProjectsStoreState {
  // Projects data - storing tasks without redundant IDs
  pool: Record<string, Omit<Project, "id">>;
  ready: boolean;

  addProject: (
    project: Omit<Project, "id">,
    callback?: (project: Project) => void | Promise<void>,
  ) => void;
  addProjects: (
    projects: Omit<Project, "id">[],
    callback?: (projects: Project[]) => void | Promise<void>,
  ) => void;
  updateProject: (
    projectId: Project["id"],
    update: Partial<Omit<Project, "id">>,
    callback?: (project: Project) => void | Promise<void>,
  ) => void;
  removeProject: (projectId: Project["id"]) => void;
}

export const useProjectsStore = create<ProjectsStoreState>()(
  devtools(
    persist(
      (set) => ({
        pool: {},
        items: [],
        ready: false,
        addProject: (project, callback) =>
          set((state) => {
            const id = createUniqueId(state.pool);

            void callback?.({ ...project, id });

            return {
              pool: {
                ...state.pool,
                [id]: project,
              },
            };
          }),
        addProjects: (projects, callback) => {
          set((state) => {
            const newProjects = projects.reduce<ProjectsStoreState["pool"]>(
              (acc, project) => ({
                ...acc,
                [createUniqueId({
                  ...acc,
                  ...state.pool,
                })]: { ...project, addedAt: new Date().toISOString() },
              }),
              {},
            );

            void callback?.(
              Object.entries(newProjects).map(([id, project]) => ({
                ...project,
                id,
              })),
            );

            return {
              pool: { ...state.pool, ...newProjects },
            };
          });
        },
        updateProject: (projectId, updates, callback) => {
          set((state) => {
            const existingProject = state.pool[projectId];
            if (!existingProject) return state;

            const updatedProject = { ...existingProject, ...updates };

            void callback?.({ ...updatedProject, id: projectId });

            return {
              pool: {
                ...state.pool,
                [projectId]: updatedProject,
              },
            };
          });
        },
        removeProject: (projectId) => {
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [projectId]: _removedProject, ...remainingProjects } =
              state.pool;

            return {
              pool: remainingProjects,
            };
          });
        },
      }),
      {
        name: "projects",
        storage: {
          getItem: async (name) => {
            const value = await localDB.getItem(name);
            if (!value) return { state: { pool: {}, ready: true } };

            const pool = JSON.parse(
              value as string,
            ) as ProjectsStoreState["pool"];
            return {
              state: {
                pool,
                ready: true,
              },
            };
          },
          setItem: (name, { state }) => {
            void localDB.setItem(name, JSON.stringify(state.pool));
          },
          removeItem: (name) => {
            void localDB.removeItem(name);
          },
        },
      },
    ),
  ),
);
