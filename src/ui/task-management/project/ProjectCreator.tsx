import { useState } from "react";
import { Button, Modal, Space } from "@mantine/core";

import type { ProjectInput } from "@/core/task-management";
import {
  ProjectForm,
  projectFormOpts,
  useProjectForm,
} from "@/ui/task-management";

export interface ProjectCreatorProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (project: ProjectInput, cb: () => void) => void;
}

export function ProjectCreator({
  opened,
  onClose,
  onCreate,
}: ProjectCreatorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectForm = useProjectForm({
    ...projectFormOpts,
    onSubmit: ({ value }) => {
      setIsSubmitting(true);
      onCreate(value, () => {
        projectForm.reset();
        setIsSubmitting(false);
      });
    },
  });
  return (
    <Modal
      opened={opened}
      centered
      radius="md"
      transitionProps={{ transition: "pop" }}
      overlayProps={{
        className: "backdrop-blur-xs",
      }}
      withCloseButton={false}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void projectForm.handleSubmit();
        }}
      >
        <ProjectForm form={projectForm} />

        <Space h="lg" />

        <projectForm.Subscribe
          selector={(state) => state.isValid && state.isDirty}
          children={(isValid) => (
            <Button
              fullWidth
              size="md"
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Create Project
            </Button>
          )}
        />
      </form>
    </Modal>
  );
}
