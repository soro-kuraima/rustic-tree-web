// hooks/useClerkUserSync.ts
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthStore } from "../stores/auth-store";

export function useClerkUserSync() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();
  const createUser = useMutation(api.users.createUser);
  const { setUser, setUserId, clearUser } = useAuthStore();

  // Get Convex user data using the Clerk token only if we have a userId
  const tokenIdentifier = userId ? `clerk:${userId}` : null;
  const convexUser = useQuery(
    api.users.getUserByToken, 
    tokenIdentifier ? { tokenIdentifier } : "skip"
  );

  // Update auth store when user data is available
  useEffect(() => {
    if (convexUser && userId) {
      setUser(convexUser);
      setUserId(convexUser._id);
    } else if (!isSignedIn && isLoaded) {
      clearUser();
    }
  }, [convexUser, userId, isSignedIn, isLoaded, setUser, setUserId, clearUser]);

  // Create user in Convex if needed
  useEffect(() => {
    // Only run this once when the user is first loaded and signed in
    if (isLoaded && isSignedIn && user) {
      const syncUser = async () => {
        try {
          // Safe access to nested properties with fallbacks
          const primaryPhoneNumber = user.primaryPhoneNumber?.phoneNumber || "";
          const phoneVerified = user.primaryPhoneNumber?.verification?.status === "verified";
          
          await createUser({
            email: user.primaryEmailAddress?.emailAddress || "",
            email_verified: user.primaryEmailAddress?.verification?.status === "verified",
            family_name: user.lastName || undefined,
            given_name: user.firstName || "",
            issuer: "clerk",
            name: user.fullName || "",
            primary_phone_number: primaryPhoneNumber,
            phone_number_verified: phoneVerified,
            picture_url: user.imageUrl || "",
            subject: user.id,
            tokenIdentifier: `clerk:${user.id}`,
            updated_at: new Date().toISOString(),
          });
          console.log("User successfully synced to Convex");
        } catch (error) {
          // If error is "User already exists", that's fine
          if (error.message !== "User already exists") {
            console.error("Error syncing user to Convex:", error);
          }
        }
      };

      syncUser();
    }
  }, [isSignedIn, isLoaded, user, createUser]);
}