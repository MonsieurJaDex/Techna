import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { SourceBlock } from '@/components/HR/SourceBlock';
import { Message } from '@/types/chat';

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.row, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>{message.text}</Text>
        {!!message.sources?.length && <SourceBlock sources={message.sources} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingVertical: 7 },
  bubble: {
    maxWidth: 720,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0px 12px 28px rgba(17,24,39,0.08)',
        } as any)
      : null),
  },
  userBubble: { backgroundColor: '#6AB216', borderColor: '#6AB216' },
  assistantBubble: { backgroundColor: '#FFFFFF', borderColor: '#EEF0F3' },
  text: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  userText: { color: '#0B1A04' },
  assistantText: { color: '#111827' },
});

