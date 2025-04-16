export type Interpolation = Record<string, any>;

export function interpolate(template: string, values: Interpolation): string {
  return template.replace(/{([^{}]*)}/g, (match, key) => {
    const value = values[key];

    if (value === undefined) return match;

    if (typeof value === "object" && value !== null)
      return JSON.stringify(value, null, 2);

    if (typeof value === "boolean") return value ? "true" : "false";
    return String(value);
  });
}
