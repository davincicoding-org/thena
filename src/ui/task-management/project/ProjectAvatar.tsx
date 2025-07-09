import type { AvatarProps } from "@mantine/core";
import { forwardRef } from "react";
import { Avatar, createPolymorphicComponent } from "@mantine/core";

import type { ProjectSelect } from "@/core/task-management";

export interface ProjectAvatarProps extends AvatarProps {
  project: Pick<ProjectSelect, "id" | "title" | "image" | "color">;
}

export const ProjectAvatar = createPolymorphicComponent<
  "div",
  ProjectAvatarProps
>(
  forwardRef<HTMLDivElement, ProjectAvatarProps>(function Component(
    { project, ...props },
    ref,
  ) {
    return (
      <Avatar
        ref={ref}
        src={project.image}
        alt={project.image ? project.title : undefined}
        name={project.title}
        color={project.color ?? "gray"}
        {...props}
      />
    );
  }),
);
