import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Source } from '@/types/chat';

export function SourceBlock({ sources }: { sources: Source[] }) {
  const [open, setOpen] = React.useState(false);

  if (!sources?.length) return null;

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((v) => !v)} style={({ pressed }) => [styles.head, pressed && styles.pressed]}>
        <Text style={styles.headText}>📄 Источники</Text>
        <Text style={styles.chev}>{open ? 'Скрыть' : 'Показать'}</Text>
      </Pressable>
      {open && (
        <View style={styles.body}>
          {sources.map((s, idx) => (
            <View key={`${s.title}-${idx}`} style={styles.item}>
              <Text style={styles.itemTitle}>{s.title}</Text>
              <Text style={styles.itemRef}>{s.reference}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F6F7F9',
    overflow: 'hidden',
  },
  head: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headText: { fontSize: 12, fontWeight: '900', color: '#111827' },
  chev: { fontSize: 12, fontWeight: '800', color: '#6B7280' },
  pressed: { opacity: 0.85 },
  body: { paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  item: { gap: 2 },
  itemTitle: { fontSize: 12, fontWeight: '800', color: '#111827' },
  itemRef: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
});

