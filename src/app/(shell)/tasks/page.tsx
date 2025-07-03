"use client";

import { LoadingOverlay, Transition } from "@mantine/core";

import { Main } from "@/app/(shell)/shell";
import { TaskListEditor, useProjects, useTodos } from "@/ui/task-management";
import { cn } from "@/ui/utils";

export default function SessionPage() {
  const todos = useTodos();

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
        onUpdateTask={todos.updateTask}
        onDeleteTasks={todos.deleteTasks}
        onCreateTasks={todos.createTasks}
        projects={projects.items}
        onCreateProject={(input) => projects.create.mutate(input)}
      />
    </Main>
  );
}
