import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";

import type { ProjectSelect } from "@/core/task-management";

import { ProjectAvatar } from "./ProjectAvatar";

export interface ProjectOverviewProps {
  project: ProjectSelect;
  onDeleteProject: () => void;
}

export function ProjectOverview({
  project,
  onDeleteProject,
}: ProjectOverviewProps) {
  return (
    <div>
      <div className="flex items-center gap-4 px-4 py-3">
        <ProjectAvatar project={project} size={48} />
        <h1 className="my-0 flex-1 text-2xl font-bold">{project.title}</h1>
        <Menu
          position="bottom-end"
          withArrow
          arrowPosition="center"
          classNames={{
            itemLabel: "font-medium",
          }}
        >
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={onDeleteProject}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      {/* <Divider />
      <div className="p-4">
        <Blockquote
          color="gray"
          p="xs"
          className="rounded-sm italic empty:hidden"
        >
          {project.description}
        </Blockquote>

        <div className="flex gap-4">
          <p>Completed Tasks</p>
          <p>Focus Time</p>
        </div>

        <p>TODOS</p>
      </div> */}
    </div>
  );
}
