import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService, { CreateUserPayload } from '@/services/user.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const USER_KEYS = {
  all:    ['users']               as const,
  byId:   (id: string | number) => ['users', id] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useUsers() {
  return useQuery({
    queryKey: USER_KEYS.all,
    queryFn:  userService.getAll,
  });
}

export function useUser(id: string | number) {
  return useQuery({
    queryKey: USER_KEYS.byId(id),
    queryFn:  () => userService.getById(id),
    enabled:  !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.create(payload),
    onSuccess: () => {
      // Invalide le cache users → refetch automatique
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
  });
}