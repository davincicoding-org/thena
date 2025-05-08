import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import type { Duration } from "./types";

dayjs.extend(duration);

export const resolveDuration = (duration: Duration) => dayjs.duration(duration);
