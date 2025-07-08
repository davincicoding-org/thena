import type { CardProps } from "@mantine/core";
import { useRef } from "react";
import {
  ActionIcon,
  Avatar,
  Card,
  Divider,
  Flex,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import type { ProjectSelect } from "@/core/task-management";
import { ProjectAvatar } from "@/ui/task-management";
import { derive } from "@/ui/utils";

const LoadingSkeleton = () => (
  <div className="shrink-0">
    <Skeleton height={96} width={96} radius="md" />
    <Skeleton height={16} width={80} radius="md" mx="auto" mt={8} />
  </div>
);

const PROJECT_SKELETONS = Array.from({ length: 3 }, (_, index) => (
  <LoadingSkeleton key={index} />
));

export interface TasksTileProps {
  loadingTodos: boolean;
  todos: number;
  loadingProjects: boolean;
  projects: ProjectSelect[];
  onCreateProject: (callback: (projectId: ProjectSelect["id"]) => void) => void;
  onViewProject: (project: ProjectSelect) => void;
}

export function TasksTile({
  loadingTodos,
  todos,
  loadingProjects,
  projects,
  onCreateProject,
  onViewProject,
  ...props
}: TasksTileProps & CardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const todosLabel = derive(() => {
    if (todos === 0) return "-";
    if (todos <= 100) return todos.toString();
    return "100+";
  });

  return (
    <Card radius="md" shadow="sm" {...props}>
      <Card.Section>
        <ScrollArea
          scrollbars="x"
          scrollHideDelay={300}
          viewportRef={viewportRef}
        >
          <Flex gap="lg" py="sm" align="center">
            <div className="h-1 w-0.5 shrink-0" />

            {loadingTodos ? (
              <LoadingSkeleton />
            ) : (
              <div>
                <Avatar
                  size={96}
                  radius="md"
                  color="primary"
                  variant="light"
                  name={todosLabel}
                  className="cursor-pointer transition-transform hover:scale-105"
                  // onClick={() => onViewProject(project)}
                />

                <Text className="text-center !leading-none" mt={8}>
                  TODOS
                </Text>
              </div>
            )}

            <Divider orientation="vertical" />

            <div>
              <Text size="xs" tt="uppercase" mb={4}>
                Projects
              </Text>

              <div className="flex gap-4">
                {loadingProjects ? (
                  PROJECT_SKELETONS
                ) : (
                  <>
                    {projects.map((project) => (
                      <div key={project.id}>
                        <ProjectAvatar
                          project={project}
                          size={96}
                          radius="md"
                          tooltipProps={{ disabled: true }}
                          className="cursor-pointer transition-transform hover:scale-105"
                          onClick={() => onViewProject(project)}
                        />

                        <Text className="text-center !leading-none" mt={8}>
                          {project.title}
                        </Text>
                      </div>
                    ))}
                    <ActionIcon
                      variant="outline"
                      radius="md"
                      size={96}
                      onClick={() =>
                        onCreateProject(() => {
                          if (!viewportRef.current) return;
                          viewportRef.current.scrollTo({
                            left: 0,
                            behavior: "smooth",
                          });
                        })
                      }
                    >
                      <IconPlus size={48} stroke={1} />
                    </ActionIcon>
                  </>
                )}
              </div>
            </div>

            <div className="h-1 w-0.5 shrink-0" />
          </Flex>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
