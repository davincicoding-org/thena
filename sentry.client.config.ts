import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://df99d17f53b209e2fa28e8de4a6ecc9e@o4508201138388992.ingest.de.sentry.io/4509265036640336",
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: "dark",
      autoInject: false,
      useSentryUser: {
        email: "email",
        name: "fullName",
      },
    }),
  ],
});
