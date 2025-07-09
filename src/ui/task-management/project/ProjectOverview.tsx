import Link from "next/link";
import {
  ActionIcon,
  Blockquote,
  Button,
  Card,
  Divider,
  Flex,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";

import type { ProjectSelect } from "@/core/task-management";

import { ProjectAvatar } from "./ProjectAvatar";

export interface ProjectOverviewProps {
  project: ProjectSelect;
  onDelete: () => void;
  summary:
    | {
        todosCount: number;
        completedCount: number;
        totalFocusMinutes: number;
      }
    | undefined;
}

export function ProjectOverview({
  project,
  onDelete,
  summary,
}: ProjectOverviewProps) {
  return (
    <div>
      <Stack gap="sm" className="p-4">
        <div className="flex items-center gap-4">
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
                onClick={onDelete}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <Blockquote
          color="gray"
          p="xs"
          className="rounded-sm italic empty:hidden"
        >
          {project.description}
        </Blockquote>
      </Stack>

      <Divider />

      <Stack className="p-4">
        <Flex gap="md">
          <Card flex={1} ta="center" p="xs" radius="md">
            <span className="text-4xl">{summary?.completedCount ?? "-"}</span>
            <Text>Completed Tasks</Text>
          </Card>
          <Card flex={1} ta="center" p="xs" radius="md">
            <span className="text-4xl">
              {summary?.totalFocusMinutes.toFixed(0) ?? "-"}
            </span>
            <Text>Focus Time</Text>
          </Card>
        </Flex>

        <Card ta="center" p="xs" radius="md">
          <Flex justify="space-between" align="center">
            <Text size="lg">
              <span className="mr-1 text-3xl">
                {summary?.todosCount ?? "-"}
              </span>
              TODOS
            </Text>

            <Button
              size="md"
              component={Link}
              href={`/focus?project=${project.id}`}
            >
              Tackle Them
            </Button>
          </Flex>
        </Card>
      </Stack>
    </div>
  );
}
