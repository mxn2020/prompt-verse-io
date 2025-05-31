// Server-side exports
export {
  getCurrentUserServer,
  requireAuth,
  getUserProfile,
  isUserLoggedIn,
} from './server';

// Client-side exports
export {
  getCurrentUserClient,
  getUserProfileClient,
} from './client';

// Guards
export {
  redirectIfAuthenticated,
  redirectIfNotAuthenticated,
} from './guards';

// Re-export service for direct access if needed
export { AuthService } from '@/lib/services/auth.service';