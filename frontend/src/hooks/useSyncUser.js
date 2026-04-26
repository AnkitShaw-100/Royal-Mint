import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { isClerkConfigured } from "@/lib/clerk";

/**
 * On sign-in, push the Clerk user record to the Express backend
 * (POST /users/save). Runs once per session.
 */
export function useSyncUser() {
  const { user, isSignedIn } = useUser();
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isClerkConfigured || !isSignedIn || !user || synced) return;

    api.users
      .save(user.id, {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        profileImage: user.imageUrl,
      })
      .then(() => setSynced(true))
      .catch((e) => setError(e.message));
  }, [isSignedIn, user, synced]);

  return { synced, error };
}
