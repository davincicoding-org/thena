import type { formats } from "@/i18n/request";

import type messages from "./messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: "en";
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
