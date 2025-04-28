import { useCallback, useMemo } from "react";

import type { Project, ProjectInput } from "@/core/task-management";
import { uploadImage } from "@/server/actions";

import { useProjectsStore } from "./useProjectsStore";

export interface ProjectsHookReturn {
  loading: boolean;
  projects: Project[];
  createProject: (
    project: ProjectInput,
    callback?: (project: Project) => void,
  ) => void;
  updateProject: (
    projectId: Project["id"],
    updates: Partial<Omit<Project, "id">>,
  ) => void;
  deleteProject: (projectId: Project["id"]) => void;
}

/**
 * Manages stored projects.
 */

export function useProjects(): ProjectsHookReturn {
  const projectsStore = useProjectsStore();
  const projects = useMemo(
    () =>
      Object.entries(projectsStore.pool).map(([id, project]) => ({
        id,
        ...project,
      })),
    [projectsStore.pool],
  );

  const createProject = useCallback<ProjectsHookReturn["createProject"]>(
    ({ imageFile, ...input }, callback) => {
      projectsStore.addProject(input, async (project) => {
        if (callback) callback?.(project);
        if (imageFile) {
          const url = await uploadImage("projects", project.id, imageFile);
          projectsStore.updateProject(project.id, { image: url });
          project.image = url;
        }
        // store project in backend
      });
    },
    [],
  );

  const updateProject = useCallback<ProjectsHookReturn["updateProject"]>(
    (projectId, updates) => {
      projectsStore.updateProject(projectId, updates, () => {
        // TODO update in backend
      });
    },
    [],
  );

  const deleteProject = useCallback<ProjectsHookReturn["deleteProject"]>(
    (projectId) => {
      projectsStore.removeProject(projectId);
      // TODO delete in backend
    },
    [],
  );

  return {
    loading: !projectsStore.ready,
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
}
