import * as React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { MessageBubble } from '@/components/Chat/MessageBubble';
import { TypingIndicator } from '@/components/Chat/TypingIndicator';
import { Message } from '@/types/chat';

const mascotAsset = require('../../../assets/images/msctc.png');

export function ChatWindow(props: { messages: Message[]; isLoading: boolean }) {
  const listRef = React.useRef<FlatList<Message>>(null);

  React.useEffect(() => {
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [props.messages.length, props.isLoading]);

  const empty = props.messages.length === 0 && !props.isLoading;

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={props.messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={[styles.content, empty && styles.contentEmpty]}
        ListEmptyComponent={
          empty ? (
            <View style={styles.empty}>
              <View style={styles.emptyCard}>
                <Image source={mascotAsset} style={styles.emptyMascot} resizeMode="contain" />
                <Text style={styles.emptyTitle}>Задайте вопрос HR‑ассистенту</Text>
                <Text style={styles.emptyText}>
                  Я помогу с отпусками, ДМС, справками, выплатами и внутренними процессами.
                </Text>
              </View>
            </View>
          ) : null
        }
        ListFooterComponent={props.isLoading ? <TypingIndicator /> : null}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#F6F7F9' },
  content: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 12 },
  contentEmpty: { flexGrow: 1, justifyContent: 'center' },
  empty: { paddingVertical: 10 },
  emptyCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    padding: 18,
    shadowColor: 'rgba(17,24,39,0.08)',
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 2,
    alignItems: 'center',
    gap: 8,
  },
  emptyMascot: { width: 120, height: 120 },
  emptyTitle: { marginTop: 4, fontSize: 18, fontWeight: '900', color: '#111827', textAlign: 'center' },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#6B7280', lineHeight: 20, textAlign: 'center' },
});

