import { apiFetch } from '@/services/api';
import { AuthResponse } from '@/types/user';

export async function login(payload: { email: string }): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    json: payload,
  });
}

