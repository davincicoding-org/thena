import { z } from "zod";

import { taskSchema } from "@/core/task-management";

export const sprintPlanSchema = z.object({
  id: z.string(),
  duration: z.number(),
  tasks: z.array(taskSchema),
});
export type SprintPlan = z.infer<typeof sprintPlanSchema>;
