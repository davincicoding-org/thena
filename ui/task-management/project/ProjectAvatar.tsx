import type { AvatarProps, TooltipProps } from "@mantine/core";
import { Avatar, Tooltip } from "@mantine/core";

import type { ProjectSelect } from "@/core/task-management";

export interface ProjectAvatarProps {
  project: ProjectSelect;
  tooltipProps?: Omit<TooltipProps, "label" | "children">;
}

export function ProjectAvatar({
  project,
  tooltipProps,
  ...props
}: ProjectAvatarProps & AvatarProps) {
  return (
    <Tooltip label={project.title} {...tooltipProps}>
      <Avatar
        src={project.image}
        alt={project.title}
        name={project.title}
        // color={project.color ?? "gray"}
        {...props}
      />
    </Tooltip>
  );
}
