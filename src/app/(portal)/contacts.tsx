import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Contacts() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Контакты</Text>
      <Text style={styles.sub}>Заглушка под интеграцию портала.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 18, backgroundColor: '#FFFFFF' },
  title: { fontSize: 20, fontWeight: '900', color: '#111827' },
  sub: { marginTop: 6, fontSize: 13, fontWeight: '700', color: '#6B7280' },
});

