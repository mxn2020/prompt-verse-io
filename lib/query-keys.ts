export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
    status: () => [...queryKeys.auth.all, 'status'] as const,
    profile: (userId?: string) => [...queryKeys.auth.all, 'profile', userId] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
  prompts: {
    all: ['prompts'] as const,
    list: () => [...queryKeys.prompts.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.prompts.all, 'detail', id] as const,
  },
  modules: {
    all: ['modules'] as const,
    list: () => [...queryKeys.modules.all, 'list'] as const,
  },
} as const;