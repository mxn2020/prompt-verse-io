"use client";

import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function DashboardHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 sm:gap-6">
        <div className="flex flex-1 items-center gap-2">
          <span className="font-semibold">Dashboard</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ModeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || 'User'} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={async (event) => {
                  event.preventDefault();
                  try {
                    await signOut();
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}