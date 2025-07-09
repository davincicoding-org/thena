import type { ActionIconProps } from "@mantine/core";
import { ActionIcon, Menu } from "@mantine/core";
import { IconSortDescending } from "@tabler/icons-react";

import type { TaskFilters } from "./useFilteredTasks";

export interface TaskListSortProps {
  sort: TaskFilters["sort"];
  onChange: (sort: TaskFilters["sort"]) => void;
}

export function TaskListSort({
  sort,
  onChange,
  ...actionIconProps
}: TaskListSortProps & ActionIconProps) {
  return (
    <Menu
      position="bottom"
      offset={{
        mainAxis: 4,
      }}
      classNames={{
        itemLabel: "font-medium",
      }}
      transitionProps={{
        transition: "pop-top-left",
      }}
    >
      <Menu.Target>
        <ActionIcon variant="default" radius="md" {...actionIconProps}>
          <IconSortDescending size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Sort by</Menu.Label>
        <Menu.Item
          color={sort === "default" ? "primary" : undefined}
          onClick={() => onChange("default")}
        >
          Default
        </Menu.Item>
        <Menu.Item
          color={sort === "priority" ? "primary" : undefined}
          onClick={() => onChange("priority")}
        >
          Priority
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
