import { useState } from "react";
import { useDndContext } from "@dnd-kit/core";
import { ActionIcon, Button, FocusTrap, Kbd, TextInput } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import z from "zod";

import type { TaskFormValues } from "@/core/task-management";
import { HotKeyHint, useHotKeyHint } from "@/ui/components/HotKeyHint";
import { cn } from "@/ui/utils";

export interface TaskAdderProps {
  hotkey?: string;
  order?: number;
  onCreateTasks: (tasks: TaskFormValues[]) => void;
}

export function TaskAdder({
  hotkey = "",
  onCreateTasks,
  order,
}: TaskAdderProps) {
  const { active } = useDndContext();
  useHotkeys([
    [
      hotkey,
      () => {
        setOpened(true);
        createTaskTip.markAsExecuted();
      },
    ],
  ]);
  const t = useTranslations("SessionPlanner");
  const createTaskTip = useHotKeyHint();

  const [opened, setOpened] = useState(false);

  const taskForm = useForm({
    defaultValues: {
      title: "",
    },
    validators: {
      onChange: z.object({
        title: z.string().min(3),
      }),
    },
    onSubmit: ({ value }) => {
      onCreateTasks([
        {
          ...value,
          customSortOrder: order ?? null,
          parentId: null,
          projectId: null,
          priority: null,
        },
      ]);
      setOpened(false);
      taskForm.reset();
    },
  });

  return (
    <AnimatePresence mode="wait">
      {opened ? (
        <motion.form
          key="new-task-form"
          className={cn({ "py-5": order !== undefined })}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={(e) => {
            e.preventDefault();
            void taskForm.handleSubmit();
          }}
        >
          <taskForm.Field
            name="title"
            children={(field) => (
              <FocusTrap>
                <TextInput
                  placeholder={t("TaskPool.TaskCreator.placeholder")}
                  value={field.state.value}
                  onFocus={(e) => {
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={() => setOpened(false)}
                />
              </FocusTrap>
            )}
          />
        </motion.form>
      ) : (
        <motion.div
          key="task-adders"
          className="flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {order === undefined ? (
            <HotKeyHint
              opened={createTaskTip.opened}
              disabled={!hotkey}
              withinPortal={false}
              onClose={createTaskTip.close}
              isExecuted={createTaskTip.isExecuted}
              message={t.rich("TaskPool.TaskCreator.hotKeyHint", {
                kbd: () => <Kbd>{hotkey}</Kbd>,
              })}
            >
              <Button
                flex={1}
                leftSection={<IconPlus size={16} />}
                onMouseEnter={createTaskTip.open}
                onMouseLeave={createTaskTip.close}
                onClick={() => {
                  createTaskTip.close();
                  setOpened(true);
                }}
              >
                {t("TaskPool.TaskCreator.cta")}
              </Button>
            </HotKeyHint>
          ) : (
            <ActionIcon
              flex={1}
              size="xs"
              variant="light"
              className={cn(
                "my-0.5 opacity-0 transition-opacity !outline-none hover:opacity-100 focus-visible:opacity-100",
                {
                  "pointer-events-none": active,
                },
              )}
              onClick={() => {
                createTaskTip.close();
                setOpened(true);
              }}
            >
              <IconPlus size={12} />
            </ActionIcon>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
