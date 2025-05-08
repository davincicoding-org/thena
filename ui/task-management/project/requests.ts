import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

import type {
  ProjectInput,
  ProjectSelect,
  ProjectUpdate,
} from "@/core/task-management";
import { getClientDB } from "@/db/client";
import { projects } from "@/db/schema";
import { uploadImage } from "@/server/actions";

export const useProjectsQuery = () => {
  const queryClient = useQueryClient();
  return useQuery<ProjectSelect[]>(
    {
      queryKey: ["projects"],
      queryFn: async () => {
        const db = await getClientDB();
        return db.query.projects.findMany();
      },
    },
    queryClient,
  );
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation<ProjectSelect | undefined, Error, ProjectInput>({
    mutationKey: ["create-project"],
    mutationFn: async ({ imageFile, ...project }) => {
      const db = await getClientDB();
      if (!user) throw new Error("User not found");
      const [result] = await db
        .insert(projects)
        .values({ ...project, userId: user.id })
        .returning();

      if (!result) return undefined;

      if (!imageFile) return result;

      const url = await uploadImage(
        "projects",
        result.id.toString(),
        imageFile,
      );
      const [updated] = await db
        .update(projects)
        .set({ image: url })
        .where(eq(projects.id, result.id))
        .returning();
      return updated;
    },
    onSuccess: (project) => {
      queryClient.setQueryData(["projects"], (old: ProjectSelect[]) => [
        ...old,
        project,
      ]);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ProjectSelect | undefined,
    Error,
    Pick<ProjectSelect, "id"> & ProjectUpdate
  >({
    mutationKey: ["update-project"],
    mutationFn: async ({ id, ...updates }) => {
      const db = await getClientDB();
      const [result] = await db
        .update(projects)
        .set(updates)
        .where(eq(projects.id, id))
        .returning();
      return result;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(["projects"], (old: ProjectSelect[]) =>
        old.map((project) =>
          project.id === updatedProject?.id ? updatedProject : project,
        ),
      );
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<ProjectSelect | undefined, Error, ProjectSelect["id"]>({
    mutationKey: ["delete-project"],
    mutationFn: async (projectId) => {
      const db = await getClientDB();
      const [result] = await db
        .delete(projects)
        .where(eq(projects.id, projectId))
        .returning();
      return result;
    },
    onSuccess: (deletedProject) => {
      queryClient.setQueryData(["projects"], (old: ProjectSelect[]) =>
        old.filter((project) => project.id !== deletedProject?.id),
      );
    },
  });
};
