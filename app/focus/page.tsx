"use client";

import { LoadingOverlay } from "@mantine/core";

import { flattenTasks } from "@/core/task-management";
import { FocusSession } from "@/ui/deep-work";
import { useTodos } from "@/ui/task-management";

export default function FocusPage() {
  const todos = useTodos();
  const tasks = flattenTasks(todos.tasks);

  // const isLoaded = !activeFocusSession.sprints.isLoading;
  // const handleFinishSession = (
  //   taskStatusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  // ) => {
  //   activeFocusSession.finishSession(taskStatusUpdates);
  //   window.close();
  // };

  return (
    <main className="h-dvh">
      <LoadingOverlay visible={todos.isLoading} />
      <FocusSession
        tasks={tasks}
        onStartSprint={() => console.log("start sprint")}
        onFinishSprint={() => console.log("finish sprint")}
        onFinishBreak={() => console.log("finish break")}
        onCompleteTask={() => console.log("complete task")}
        onFinishSession={() => console.log("finish session")}
      />
    </main>
  );
}
