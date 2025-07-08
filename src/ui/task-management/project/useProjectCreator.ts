import { useRef, useState } from "react";

import type { ProjectInput, ProjectSelect } from "@/core/task-management";

export function useProjectCreator(
  handler: (project: ProjectInput) => Promise<ProjectSelect>,
) {
  const [opened, setOpened] = useState(false);
  const callbackRef = useRef<(projectId: ProjectSelect["id"]) => void>(null);

  const open = (callback?: (projectId: ProjectSelect["id"]) => void) => {
    setOpened(true);
    if (callback) callbackRef.current = callback;
  };

  const close = () => {
    setOpened(false);
    callbackRef.current = null;
  };

  const create = async (input: ProjectInput, callback: () => void) => {
    const result = await handler(input);
    callbackRef.current?.(result.id);
    callback();
    close();
  };

  return { opened, open, close, create };
}
