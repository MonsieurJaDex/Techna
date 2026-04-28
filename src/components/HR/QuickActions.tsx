import * as React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';

const ACTIONS = [
  'Сколько у меня отпуска?',
  'Когда зарплата?',
  'Как оформить отпуск?',
  'ДМС программы',
];

export function QuickActions({ onPick }: { onPick: (text: string) => void }) {
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {ACTIONS.map((t) => (
          <Pressable
            key={t}
            onPress={() => onPick(t)}
            style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
            <Text style={styles.text}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8, backgroundColor: '#F6F7F9' },
  content: { gap: 10, paddingRight: 18 },
  pill: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F6F7F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  text: { fontSize: 14, fontWeight: '800', color: '#111827' },
  pressed: { opacity: 0.85 },
});

