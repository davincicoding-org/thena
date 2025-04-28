export type Interpolation = Record<string, unknown>;

export function interpolate(template: string, values: Interpolation): string {
  return template.replace(/{([^{}]*)}/g, (match, key) => {
    const value = values[key as keyof typeof values];

    if (value === undefined) return match;

    if (typeof value === "object" && value !== null)
      return JSON.stringify(value, null, 2);

    if (typeof value === "boolean") return value ? "true" : "false";
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(value);
  });
}
