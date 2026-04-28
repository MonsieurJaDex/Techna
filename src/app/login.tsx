import * as React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { login as loginApi } from '@/services/auth';
import { useUserStore } from '@/store/useUserStore';

export default function LoginScreen() {
  const setUser = useUserStore((s) => s.setUser);
  const token = useUserStore((s) => s.token);

  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (token) router.replace('/');
  }, [token]);

  const onSubmit = async () => {
    const value = email.trim();
    if (!value) return;

    setError(null);
    setIsLoading(true);
    try {
      const res = await loginApi({ email: value });
      setUser({ token: res.token, user: res.user });
      router.replace('/');
    } catch (e: any) {
      setError(e?.message || 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
        <View style={styles.card}>
          <Text style={styles.title}>Вход для сотрудников</Text>
          <Text style={styles.subtitle}>Добро пожаловать на портал сотрудника компании 1221Systems</Text>

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Логин"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={onSubmit}
          />

          <Input
            value={'********'}
            editable={false}
            placeholder="Пароль"
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button title={isLoading ? 'Входим…' : 'Войти'} onPress={onSubmit} disabled={!email.trim() || isLoading} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    justifyContent: 'center',
  },
  kav: { flex: 1, justifyContent: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#EEF0F3',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    gap: 14,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    shadowColor: 'rgba(17,24,39,0.10)',
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: '900', color: '#111827', letterSpacing: 0.2 },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#6B7280', lineHeight: 18 },
  error: { fontSize: 13, fontWeight: '700', color: '#B91C1C' },
});

