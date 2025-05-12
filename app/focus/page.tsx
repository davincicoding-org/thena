"use client";

import { LoadingOverlay, Modal } from "@mantine/core";

import type { TaskSelect } from "@/core/task-management";
import { Main } from "@/app/shell";
import { FocusSession, useActiveFocusSession } from "@/ui/deep-work";

export default function FocusPage() {
  // TODO handle no active session
  const activeFocusSession = useActiveFocusSession();

  const isLoaded = !activeFocusSession.sprints.isLoading;
  const handleFinishSession = (
    taskStatusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  ) => {
    activeFocusSession.finishSession(taskStatusUpdates);
    window.close();
  };

  return (
    <Main display="grid">
      <LoadingOverlay visible={!isLoaded} />

      <Modal.Root
        opened={isLoaded}
        fullScreen
        transitionProps={{ transition: "fade", duration: 1000 }}
        onClose={() => void 0}
      >
        <Modal.Content>
          <FocusSession
            session={activeFocusSession.session}
            sprints={activeFocusSession.sprints.data ?? []}
            onStartSprint={activeFocusSession.startSprint}
            onFinishSprint={activeFocusSession.finishSprint}
            onFinishBreak={activeFocusSession.finishBreak}
            onCompleteTask={activeFocusSession.completeTask}
            onSkipTask={activeFocusSession.skipTask}
            onUnskipTask={activeFocusSession.unskipTask}
            onFinishSession={handleFinishSession}
          />
        </Modal.Content>
      </Modal.Root>
    </Main>
  );
}
