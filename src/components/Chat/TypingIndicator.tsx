import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function TypingIndicator() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>HR-бот печатает...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
});

