import type { CardProps } from "@mantine/core";
import { Button, Card, Flex, ScrollArea, Skeleton, Text } from "@mantine/core";

import type { ProjectSelect } from "@/core/task-management";
import { ProjectAvatar } from "@/ui/task-management";

const PROJECT_SKELETONS = Array.from({ length: 3 }, (_, index) => (
  <Skeleton
    key={index}
    className="shrink-0"
    height={38}
    width={38}
    radius="sm"
  />
));

export interface ProjectsTileProps {
  loading?: boolean;
  items: ProjectSelect[];
  onCreate: () => void;
}

export function ProjectsTile({
  loading,
  items,
  onCreate,
  ...props
}: ProjectsTileProps & CardProps) {
  return (
    <Card radius="md" shadow="sm" {...props}>
      <Card.Section mb={4}>
        <ScrollArea scrollbars="x" scrollHideDelay={300}>
          <Flex gap="sm" p="md">
            {loading ? (
              PROJECT_SKELETONS
            ) : items.length ? (
              items.map((project) => (
                <ProjectAvatar
                  key={project.id}
                  project={project}
                  size="md"
                  radius="md"
                  // component={Link}
                  // href={`/projects/${project.id}`}
                  // aria-label={`Open "${project.title}" project`}
                />
              ))
            ) : (
              <Text className="text-2xl!">No projects</Text>
            )}
          </Flex>
        </ScrollArea>
      </Card.Section>
      <Button
        mt="auto"
        variant="light"
        fullWidth
        onClick={(e) => {
          onCreate();
          e.currentTarget.blur();
        }}
      >
        Create Project
      </Button>
    </Card>
  );
}
