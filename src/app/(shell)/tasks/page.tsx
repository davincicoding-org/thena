"use client";

import { LoadingOverlay, Transition } from "@mantine/core";

import { Main } from "@/app/(shell)/shell";
import { TaskListEditor, useProjects, useTodos } from "@/ui/task-management";
import { useTodosWithTimeTravel } from "@/ui/task-management/useTodosWithTimeTravel";
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const todos = useTodos();

  const { createTasks, deleteTasks, updateTask } =
    useTodosWithTimeTravel(todos);

  const projects = useProjects();

  return (
    <Main display="flex" className="flex-col">
      <Transition mounted={todos.isLoading} transition="fade" duration={500}>
        {(styles) => (
          <LoadingOverlay
            loaderProps={{ type: "dots" }}
            visible
            overlayProps={{ backgroundOpacity: 0 }}
            style={styles}
          />
        )}
      </Transition>
      <TaskListEditor
        className={cn(
          "h-full min-h-0 px-8 py-16 transition-opacity delay-300 duration-500",
          {
            "opacity-0": todos.isLoading,
          },
        )}
        tasks={todos.tasks}
        onUpdateTask={updateTask}
        onDeleteTasks={deleteTasks}
        onCreateTasks={createTasks}
        onBulkCreateTasks={(tasks) => todos.bulkCreateTasks.mutateAsync(tasks)}
        projects={projects.items}
        onCreateProject={(input) => projects.create.mutate(input)}
      />
    </Main>
  );
}
