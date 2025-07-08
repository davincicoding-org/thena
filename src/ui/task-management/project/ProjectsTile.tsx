import type { CardProps } from "@mantine/core";
import { useRef } from "react";
import {
  ActionIcon,
  Card,
  Flex,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import type { ProjectSelect } from "@/core/task-management";
import { ProjectAvatar } from "@/ui/task-management";

const PROJECT_SKELETONS = Array.from({ length: 3 }, (_, index) => (
  <div key={index} className="shrink-0">
    <Skeleton key={index} height={96} width={96} radius="md" />
    <Skeleton height={16} width={80} radius="md" mx="auto" mt={8} />
  </div>
));

export interface ProjectsTileProps {
  loading?: boolean;
  items: ProjectSelect[];
  onCreate: (callback: (projectId: ProjectSelect["id"]) => void) => void;
  onView: (project: ProjectSelect) => void;
}

export function ProjectsTile({
  loading,
  items,
  onCreate,
  onView,
  ...props
}: ProjectsTileProps & CardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <Card radius="md" shadow="sm" {...props}>
      <Card.Section>
        <ScrollArea
          scrollbars="x"
          scrollHideDelay={300}
          viewportRef={viewportRef}
        >
          <Flex gap="lg" pb="sm" pt="lg">
            <div className="h-1 w-0.5 shrink-0" />

            {loading ? (
              PROJECT_SKELETONS
            ) : items.length ? (
              <>
                {items.map((project) => (
                  <div key={project.id}>
                    <ProjectAvatar
                      project={project}
                      size={96}
                      radius="md"
                      tooltipProps={{ disabled: true }}
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => onView(project)}
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
                    onCreate(() => {
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
            ) : (
              <Text className="text-2xl!">No projects</Text>
            )}
            <div className="h-1 w-0.5 shrink-0" />
          </Flex>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
