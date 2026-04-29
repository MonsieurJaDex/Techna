import { Link, Stack } from 'expo-router';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Страница не найдена</Text>
        <Link href="/home" style={styles.link}>
          На главную
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '900', color: '#111827' },
  link: { marginTop: 12, fontSize: 14, fontWeight: '800', color: '#6AB216' },
});

