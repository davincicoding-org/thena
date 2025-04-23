import { useCallback, useState } from "react";
import { nanoid } from "nanoid";

import { Project } from "@/core/task-management";
import { ExternalState } from "@/ui/utils";

export interface ProjectsHookOptions {
  initialProjects?: Project[];
  externalState?: ExternalState<Project[]>;
}

export interface ProjectsHookReturn {
  projects: Project[];
  createProject: (project: Omit<Project, "id">) => Project;
  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void;
  deleteProject: (id: string) => void;
}

/**
 * Manages stored projects.
 */

export function useProjects({
  initialProjects = [],
  externalState: [projects, setProjects] = useState(initialProjects),
}: ProjectsHookOptions = {}): ProjectsHookReturn {
  const createProject = useCallback(
    (project: Omit<Project, "id">) => {
      const newProject: Project = {
        ...project,
        id: nanoid(),
      };
      setProjects([...projects, newProject]);
      return newProject;
    },
    [projects, setProjects],
  );

  const updateProject = useCallback<ProjectsHookReturn["updateProject"]>(
    (id, updates) => {
      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, ...updates } : project,
        ),
      );
    },
    [projects, setProjects],
  );

  const deleteProject = useCallback<ProjectsHookReturn["deleteProject"]>(
    (id) => {
      setProjects(projects.filter((project) => project.id !== id));
    },
    [projects, setProjects],
  );

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
}
