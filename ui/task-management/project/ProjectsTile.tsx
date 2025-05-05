import type { CardProps } from "@mantine/core";
import {
  Avatar,
  Button,
  Card,
  Flex,
  ScrollArea,
  Skeleton,
  Text,
  Tooltip,
} from "@mantine/core";

import type { ProjectSelect } from "@/core/task-management";

const PROJECT_SKELETONS = Array.from({ length: 10 }, (_, index) => (
  <Skeleton key={index} height={38} width={38} radius="sm" />
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
                <Tooltip key={project.uid} label={project.title}>
                  <Avatar
                    // component={Link}
                    // href={`/projects/${project.id}`}
                    // aria-label={`Open "${project.name}" project`}
                    display="inline-block"
                    size="md"
                    radius="md"
                    src={project.image}
                    alt={project.title}
                    // color={project.color ?? "gray"}
                    name={project.title}
                  />
                </Tooltip>
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
