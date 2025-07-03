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

  return {
    items: data,
    isLoading,
    create,
  };
}
