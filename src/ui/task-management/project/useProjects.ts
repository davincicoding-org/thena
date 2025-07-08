import type { ProjectSelect } from "@/core/task-management";
import { api } from "@/trpc/react";

export function useProjects() {
  const utils = api.useUtils();

  const { data = [], isLoading } = api.projects.list.useQuery();
  const create = api.projects.create.useMutation({
    onSuccess(newProject) {
      if (!newProject) return;
      utils.projects.list.setData(
        undefined,
        (prev) => prev && [newProject, ...prev],
      );
    },
  });

  const deleteProject = api.projects.delete.useMutation<{
    prev: ProjectSelect[] | undefined;
  }>({
    onMutate(deletedProject) {
      const prev = utils.projects.list.getData();
      utils.projects.list.setData(undefined, (prev = []) =>
        prev.filter((p) => p.id !== deletedProject.id),
      );
      return { prev };
    },
    onError(error, deletedProject, context) {
      if (!deletedProject) return;
      utils.projects.list.setData(undefined, context?.prev);
    },
  });

  return {
    items: data,
    isLoading,
    create,
    delete: deleteProject,
  };
}
