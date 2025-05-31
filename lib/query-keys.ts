export const queryKeys = {
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