import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary(props: { error: Error; retry: () => void }) {
  // Make sure errors are visible even on web white-screen failures.
  return (
    <View style={stylesEB.screen}>
      <Text style={stylesEB.title}>App crashed</Text>
      <Text style={stylesEB.subtitle}>{String(props.error?.message || props.error)}</Text>
      <ScrollView style={stylesEB.stack} contentContainerStyle={stylesEB.stackContent}>
        <Text style={stylesEB.stackText}>{props.error?.stack}</Text>
      </ScrollView>
      <Pressable style={stylesEB.btn} onPress={props.retry}>
        <Text style={stylesEB.btnText}>Reload</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    ...FontAwesome.font,
  });

  React.useEffect(() => {
    if (fontError) {
      // Ensure splash isn't stuck if font loading fails.
      SplashScreen.hideAsync();
      return;
    }
    if (loaded) SplashScreen.hideAsync();
  }, [loaded, fontError]);

  if (!loaded && !fontError) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
      <Stack.Screen name="(portal)" />
    </Stack>
  );
}

const stylesEB = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: '#0B0F14' },
  title: { fontSize: 20, fontWeight: '900', color: '#F9FAFB' },
  subtitle: { marginTop: 8, fontSize: 13, fontWeight: '700', color: '#FCA5A5' },
  stack: { marginTop: 12, flex: 1 },
  stackContent: { paddingBottom: 16 },
  stackText: { fontSize: 12, color: '#E5E7EB' },
  btn: {
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6AB216',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  btnText: { fontSize: 15, fontWeight: '900', color: '#0B1A04' },
});

