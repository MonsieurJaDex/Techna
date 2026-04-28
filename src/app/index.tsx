import { useUserStore } from '@/store/useUserStore';
import { Redirect } from 'expo-router';

export default function Index() {
  const token = useUserStore((s) => s.token);
  return <Redirect href={token ? '/home' : '/login'} />;
}
