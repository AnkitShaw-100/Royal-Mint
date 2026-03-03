import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

export function useSyncUserToDatabase() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) {
      console.log('Sync: Waiting for user to load...');
      return;
    }

    const syncUser = async () => {
      try {
        console.log('Starting user sync...');
        const payload = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.imageUrl,
        };

        console.log('Payload to send:', payload);

        const response = await fetch('http://localhost:5000/api/users/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Sync failed:', response.status, data);
          return;
        }

        console.log('✅ User synced to database successfully:', data);
      } catch (error) {
        console.error('❌ Error syncing user to database:', error);
      }
    };

    syncUser();
  }, [user, isLoaded]);
}
