import type { CardProps } from "@mantine/core";
import { useRef } from "react";
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import type { ProjectSelect } from "@/core/task-management";
import { ProjectAvatar } from "@/ui/task-management";
import { cn } from "@/ui/utils";

const LoadingSkeleton = () => (
  <div className="shrink-0">
    <Skeleton height={96} width={96} radius="md" />
    <Skeleton height={16} width={80} radius="md" mx="auto" mt={8} />
  </div>
);

const PROJECT_SKELETONS = Array.from({ length: 3 }, (_, index) => (
  <LoadingSkeleton key={index} />
));

export interface ProjectsCardProps {
  loading: boolean;
  items: ProjectSelect[];
  onCreateProject: (callback: (projectId: ProjectSelect["id"]) => void) => void;
  onViewProject: (project: ProjectSelect) => void;
}

export function ProjectsCard({
  loading,
  items,
  onCreateProject,
  onViewProject,
  className,
  ...props
}: ProjectsCardProps & CardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // const todosLabel = derive(() => {
  //   if (todos === 0) return "-";
  //   if (todos <= 100) return todos.toString();
  //   return "100+";
  // });

  return (
    <Card radius="md" className={cn("!overflow-visible", className)} {...props}>
      <Badge
        color="gray"
        size="lg"
        radius="md"
        pos="absolute"
        className="top-0 left-2 -translate-y-2/5"
      >
        Projects
      </Badge>
      <Card.Section>
        <ScrollArea
          scrollbars="x"
          scrollHideDelay={300}
          viewportRef={viewportRef}
        >
          <Flex gap="lg" pt="xs" pb="md" align="start">
            <div className="h-1 w-0.5 shrink-0" />

            {loading ? (
              PROJECT_SKELETONS
            ) : (
              <>
                {items.map((project) => (
                  <div key={project.id}>
                    <ProjectAvatar
                      project={project}
                      size={96}
                      radius="md"
                      tooltipProps={{ disabled: true }}
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => onViewProject(project)}
                    />

                    <Text
                      className="max-w-24 truncate text-center !leading-none"
                      mt={8}
                    >
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

            <div className="h-1 w-0.5 shrink-0" />
          </Flex>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
