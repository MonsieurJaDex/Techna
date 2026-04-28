import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ChatWindow } from '@/components/Chat/ChatWindow';
import { QuickActions } from '@/components/HR/QuickActions';
import { UserHeader } from '@/components/HR/UserHeader';
import { Input } from '@/components/UI/Input';
import { useChatStore } from '@/store/useChatStore';
import { useUserStore } from '@/store/useUserStore';

export default function ChatScreen() {
  const token = useUserStore((s) => s.token);
  const logout = useUserStore((s) => s.logout);

  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const clearChat = useChatStore((s) => s.clearChat);

  const [draft, setDraft] = React.useState('');

  React.useEffect(() => {
    if (!token) router.replace('/login');
  }, [token]);

  const onSend = async (text?: string) => {
    const value = (text ?? draft).trim();
    if (!value || isLoading) return;
    setDraft('');
    await sendMessage(value);
  };

  return (
    <View style={styles.screen}>
      <UserHeader
        onLogout={() => {
          clearChat();
          logout();
          router.replace('/login');
        }}
      />

      <View style={styles.titleRow}>
        <Text style={styles.title}>HR‑чат</Text>
        <Text style={styles.subtitle}>Задайте вопрос — я помогу разобраться</Text>
      </View>

      <ChatWindow messages={messages} isLoading={isLoading} />

      <QuickActions onPick={(t) => onSend(t)} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.composer}>
          <Input
            value={draft}
            onChangeText={setDraft}
            placeholder="Напиши вопрос…"
            returnKeyType="send"
            onSubmitEditing={() => onSend()}
            rightSlot={
              <Pressable
                accessibilityRole="button"
                onPress={() => onSend()}
                disabled={!draft.trim() || isLoading}
                style={({ pressed }) => [
                  styles.send,
                  (!draft.trim() || isLoading) && styles.sendDisabled,
                  pressed && draft.trim() && !isLoading && styles.sendPressed,
                ]}>
                <FontAwesome name="send" size={16} color="#0B1A04" />
              </Pressable>
            }
            style={styles.input}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7F9' },
  titleRow: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8, gap: 4 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  composer: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  input: { fontSize: 16, paddingVertical: 10 },
  send: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6AB216',
  },
  sendDisabled: { opacity: 0.5 },
  sendPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});

