import { apiFetch } from '@/services/api';
import { ChatResponse } from '@/types/chat';

export async function sendMessage(text: string): Promise<ChatResponse> {
  return apiFetch<ChatResponse>('/chat', {
    method: 'POST',
    auth: true,
    json: { text },
  });
}

