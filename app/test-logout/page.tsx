"use client";

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export default function TestLogout() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    console.log('Test logout button clicked');
    try {
      await signOut();
      console.log('signOut function completed');
    } catch (error) {
      console.error('signOut function error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Logout Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Current User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}
        </div>
        
        <div>
          <strong>User ID:</strong> {user?.id || 'None'}
        </div>
        
        <Button onClick={handleLogout} variant="destructive">
          Test Logout
        </Button>
        
        <div className="text-sm text-gray-600">
          Check the browser console for debug messages.
        </div>
      </div>
    </div>
  );
}
