import { z } from "zod";

const runMetricsSchema = z.object({
  completedAt: z.number().optional(),
  skipped: z.boolean().optional(),
  pulledIn: z.boolean().optional(),
});

/**
 * A generic Zod schema that adds run metrics to any base schema
 * @param baseSchema The base schema to extend with run metrics
 */
export const withRunMetricsSchema = <T extends z.ZodObject<z.ZodRawShape>>(
  baseSchema: T,
) => baseSchema.extend(runMetricsSchema.shape);

/**
 * Type helper that adds run metrics to any type, inferred from the schema
 */
export type WithRunMetrics<T> = T & z.infer<typeof runMetricsSchema>;

// Example usage:
// const mySchema = z.object({ name: z.string() });
// const mySchemaWithMetrics = withRunMetricsSchema(mySchema);
// type MyType = { name: string };
// type MyTypeWithMetrics = WithRunMetrics<MyType>;
