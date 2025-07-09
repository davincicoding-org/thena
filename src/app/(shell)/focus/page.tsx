"use client";

import { useState } from "react";
import { createParser, parseAsStringLiteral, useQueryStates } from "nuqs";

import type {
  FocusSessionConfig,
  FocusSessionStatus,
  FocusSessionSummary,
} from "@/ui/focus-session/types";
import { filterTaskTrees } from "@/core/task-management";
import { FocusSession, useActiveFocusSession } from "@/ui/focus-session";
import { useSessionBreak } from "@/ui/focus-session/useSessionBreak";
import {
  ProjectCreator,
  useProjectCreator,
  useProjects,
  useTodos,
  useTodosWithTimeTravel,
} from "@/ui/task-management";
import { useFilteredTasks } from "@/ui/task-management/task-list/useFilteredTasks";

import { Main } from "../shell";

const parseAsProjectFilter = createParser({
  parse(queryValue) {
    if (queryValue === "unassigned") return "unassigned";
    return Number(queryValue);
  },
  serialize(value) {
    if (value === "unassigned") return "unassigned";
    return value.toString();
  },
});

export default function FocusPage() {
  const [status, setStatus] = useState<FocusSessionStatus>("idle");
  const todos = useTodos();
  const openTodos = filterTaskTrees(
    todos.tasks,
    (task) => task.status === "todo",
  );

  const [filters, setFilters] = useQueryStates(
    {
      project: parseAsProjectFilter,
      sort: parseAsStringLiteral(["default", "priority"]).withDefault(
        "default",
      ),
    },
    {
      history: "replace",
    },
  );

  const filteredTodos = useFilteredTasks(openTodos, filters);
  const activeSession = useActiveFocusSession({
    todos: filteredTodos,
    onTaskCompleted: (taskId) =>
      todos.updateTask.mutate({ id: taskId, status: "completed" }),
    onRanOutOfTasks: () => {
      setStatus("finished");
    },
  });

  const sessionBreak = useSessionBreak();

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
    setStatus("break");
  };
  const handleStartBreak = (duration: number) => {
    sessionBreak.start(duration);
  };
  const handleFinishBreak = () => {
    sessionBreak.stop();
    setStatus("idle");
  };
  const handleSkipBreak = () => {
    sessionBreak.skip();
    setStatus("idle");
  };
  const handleExit = () => {
    alert("Not implemented");
    // TODO show summary
    //   window.close();
  };

  const { createTasks, deleteTasks, updateTask } =
    useTodosWithTimeTravel(todos);
  const projects = useProjects();
  const projectCreator = useProjectCreator((input) =>
    projects.create.mutateAsync(input),
  );

  return (
    <Main display="grid" className="h-dvh">
      <FocusSession
        className="h-full min-h-0"
        loading={todos.isLoading}
        status={status}
        onStartSession={handleStartSession}
        onFinishSession={handleFinishSession}
        onStartBreak={handleStartBreak}
        onFinishBreak={handleFinishBreak}
        onSkipBreak={handleSkipBreak}
        onExit={handleExit}
        completedSessions={completedSessions}
        activeSession={activeSession.session}
        onCompleteTask={activeSession.completeTask}
        onSkipTask={activeSession.skipTask}
        onUnskipTask={activeSession.unskipTask}
        todos={filteredTodos}
        taskFilters={filters}
        onUpdateFilters={setFilters}
        onUpdateTask={updateTask}
        onDeleteTasks={deleteTasks}
        onCreateTasks={createTasks}
        onBulkCreateTasks={(tasks) => todos.bulkCreateTasks.mutateAsync(tasks)}
        projects={projects.items}
        onCreateProject={projectCreator.open}
      />
      <ProjectCreator
        opened={projectCreator.opened}
        onClose={projectCreator.close}
        onCreate={projectCreator.create}
      />
    </Main>
  );
}
