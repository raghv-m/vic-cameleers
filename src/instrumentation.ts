import type { Instrumentation } from "next";

/**
 * Sentry error tracking for the server side: API routes, server actions, server rendering and
 * the proxy. Does nothing until SENTRY_DSN is set in Vercel. No browser SDK, so no client bundle
 * or CSP change.
 *
 * Privacy: no default PII, and every event is stripped of request bodies, cookies, headers and
 * query strings and of user details before it leaves the server. Stack traces and our
 * structured log context (ids, reference numbers) are what's left.
 */
export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  const Sentry = await import("@sentry/nextjs");
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    // Collect no user info, cookies, headers, bodies or query params (Sentry v11 dataCollection).
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
    },
    tracesSampleRate: 0,
    beforeSend(event) {
      if (event.request) {
        delete event.request.data;
        delete event.request.cookies;
        delete event.request.headers;
        delete event.request.query_string;
      }
      delete event.user;
      return event;
    },
  });
}

export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!process.env.SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
};
