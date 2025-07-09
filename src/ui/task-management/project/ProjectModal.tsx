import { FocusTrap, Modal } from "@mantine/core";
import { AnimatePresence, m } from "motion/react";

import type { ProjectSelect } from "@/core/task-management";
import { api } from "@/trpc/react";
import { useProjects } from "@/ui/task-management";

import { ProjectOverview } from "./ProjectOverview";

export interface ProjectModalProps {
  project: ProjectSelect | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const projects = useProjects();
  const { data: summary, isFetching } = api.projects.summary.useQuery(
    project?.id ?? null,
    {
      enabled: project !== null,
    },
  );

  return (
    <Modal
      opened={project !== null}
      centered
      size="sm"
      radius="md"
      classNames={{
        body: "p-0!",
      }}
      transitionProps={{ transition: "pop", duration: 300 }}
      overlayProps={{
        className: "backdrop-blur-xs",
      }}
      withCloseButton={false}
      onClose={onClose}
    >
      <FocusTrap.InitialFocus />
      <AnimatePresence>
        {project && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectOverview
              project={project}
              onDelete={() => {
                projects.delete.mutate(project);
                onClose();
              }}
              summary={isFetching ? undefined : summary}
            />
          </m.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
