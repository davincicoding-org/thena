import type { z, ZodSchema } from "zod";
import { useEffect, useState } from "react";

export function useLocalStorageSync<Schema extends ZodSchema>({
  key,
  state,
  schema,
  read,
}: {
  key: string;
  state: z.infer<Schema>;
  schema: Schema;
  read: (value: z.infer<Schema> | null) => void;
}) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedValue = localStorage.getItem(key);
    // FIXME
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    read(storedValue ? schema.parse(JSON.parse(storedValue)) : null);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  const clear = () => localStorage.removeItem(key);

  return { initialized, clear };
}
