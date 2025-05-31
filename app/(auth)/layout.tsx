// app/(auth)/layout.tsx
import { getCurrentUserServer } from '@/lib/auth/server'
import { redirect } from 'next/navigation'

// Force dynamic rendering for the entire auth layout
export const dynamic = 'force-dynamic'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is already logged in
  const user = await getCurrentUserServer()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="auth-layout">
      {/* Auth-specific layout elements */}
      <div className="auth-container">
        {children}
      </div>
    </div>
  )
}