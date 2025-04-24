import { Avatar, AvatarProps, Tooltip, TooltipProps } from "@mantine/core";

import { Project } from "@/core/task-management";

export interface ProjectAvatarProps {
  project: Project;
  tooltipProps?: Omit<TooltipProps, "label" | "children">;
}

export function ProjectAvatar({
  project,
  tooltipProps,
  ...props
}: ProjectAvatarProps & AvatarProps) {
  return (
    <Tooltip label={project.name} {...tooltipProps}>
      <Avatar
        src={project.image}
        alt={project.name}
        name={project.name}
        color={project.color || "gray"}
        {...props}
      />
    </Tooltip>
  );
}
