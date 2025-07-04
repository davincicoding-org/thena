"use client";

import { useState } from "react";

import type {
  FocusSessionConfig,
  FocusSessionStatus,
  FocusSessionSummary,
} from "@/ui/focus-session/types";
import { filterTaskTrees } from "@/core/task-management";
import { FocusSession, useActiveFocusSession } from "@/ui/focus-session";
import { useProjects, useTodos } from "@/ui/task-management";
import { useTodosWithTimeTravel } from "@/ui/task-management/useTodosWithTimeTravel";

export default function FocusPage() {
  // const handleFinishSession = (
  //   taskStatusUpdates: Record<TaskSelect["id"], TaskSelect["status"]>,
  // ) => {
  //   activeFocusSession.finishSession(taskStatusUpdates);
  //   window.close();
  // };

  const [status, setStatus] = useState<FocusSessionStatus>("idle");
  const todos = useTodos();
  const filteredTodos = filterTaskTrees(
    todos.tasks,
    (task) => task.status === "todo",
  );
  const activeSession = useActiveFocusSession({
    todos: filteredTodos,
    onTaskCompleted: (taskId) =>
      todos.updateTask.mutate({ id: taskId, status: "completed" }),
    onRanOutOfTasks: () => {
      setStatus("finished");
    },
  });
  const [completedSessions, setCompletedSessions] = useState<
    FocusSessionSummary[]
  >([]);

  const handleStartSession = async (config: FocusSessionConfig) => {
    await activeSession.create(config);
    setStatus("session");
  };
  const handleFinishSession = () => {
    const summary = activeSession.finish();
    setCompletedSessions((prev) => [...prev, summary]);
    setStatus("idle");
  };
  const handleStartBreak = (duration: number) => {
    // TODO insert break into db
    setStatus("break");
  };
  const handleFinishBreak = (timeElapsed: number | null) => {
    // TODO update break in db
    setStatus("idle");
  };
  const handleSkipBreak = () => {
    // TODO insert break into db
    setStatus("idle");
  };
  const handleFinish = () => {
    // TODO show summary
  };

  const { createTasks, deleteTasks, updateTask } =
    useTodosWithTimeTravel(todos);
  const projects = useProjects();

  return (
    <main className="h-dvh">
      <FocusSession
        loading={todos.isLoading}
        status={status}
        onStartSession={handleStartSession}
        onFinishSession={handleFinishSession}
        onStartBreak={handleStartBreak}
        onFinishBreak={handleFinishBreak}
        onSkipBreak={handleSkipBreak}
        onFinish={handleFinish}
        completedSessions={completedSessions}
        activeSession={activeSession.session}
        onCompleteTask={activeSession.completeTask}
        onSkipTask={activeSession.skipTask}
        onUnskipTask={activeSession.unskipTask}
        todos={filteredTodos}
        onUpdateTask={updateTask}
        onDeleteTasks={deleteTasks}
        onCreateTasks={createTasks}
        projects={projects.items}
        onCreateProject={(input) => projects.create.mutate(input)}
      />
    </main>
  );
}
