import type { AvatarProps, TooltipProps } from "@mantine/core";
import { forwardRef } from "react";
import { Avatar, createPolymorphicComponent, Tooltip } from "@mantine/core";

import type { ProjectSelect } from "@/core/task-management";

export interface ProjectAvatarProps extends AvatarProps {
  project: Pick<ProjectSelect, "id" | "title" | "image">;
  tooltipProps?: Omit<TooltipProps, "label" | "children">;
}

export const ProjectAvatar = createPolymorphicComponent<
  "div",
  ProjectAvatarProps
>(
  forwardRef<HTMLDivElement, ProjectAvatarProps>(function Component(
    { project, tooltipProps, ...props },
    ref,
  ) {
    return (
      <Tooltip label={project.title} {...tooltipProps}>
        <Avatar
          ref={ref}
          src={project.image}
          alt={project.image ? project.title : undefined}
          name={project.title}
          // color={project.color ?? "gray"}
          {...props}
        />
      </Tooltip>
    );
  }),
);
