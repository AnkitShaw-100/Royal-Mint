// Clerk publishable key. Safe to keep in source — it's a public key.
// Set VITE_CLERK_PUBLISHABLE_KEY in .env to override.
export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ??
  "pk_test_REPLACE_WITH_YOUR_CLERK_PUBLISHABLE_KEY";

export const isClerkConfigured =
  typeof CLERK_PUBLISHABLE_KEY === "string" &&
  CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
  !CLERK_PUBLISHABLE_KEY.includes("REPLACE_WITH");
