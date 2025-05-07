import type { ActionIconProps } from "@mantine/core";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ActionIcon } from "@mantine/core";
import * as Sentry from "@sentry/nextjs";
import { IconBug } from "@tabler/icons-react";

export function BugReporter(props: ActionIconProps) {
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      Sentry.setUser({
        email: user.emailAddresses[0]?.emailAddress,
        fullName: user.fullName,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  const handleClick = async () => {
    const feedback = Sentry.getFeedback();

    if (feedback) {
      const form = await feedback.createForm();
      form.appendToDom();
      form.open();
      const container = document.getElementById("sentry-feedback");
      if (container) {
        // Workaround for preventing hot keys to be fired when filling out the form
        container.contentEditable = "true";
      }
    }
  };

  return (
    <ActionIcon {...props} onClick={handleClick}>
      <IconBug />
    </ActionIcon>
  );
}
