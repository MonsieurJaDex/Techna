import { Slot } from 'expo-router';
import * as React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Sidebar } from '@/components/Portal/Sidebar';
import { TopBar } from '@/components/Portal/TopBar';

export function PortalShell() {
  const { width } = useWindowDimensions();
  const showSidebar = Platform.OS === 'web' ? width >= 900 : width >= 768;

  return (
    <View style={styles.root}>
      <TopBar />
      <View style={styles.body}>
        {showSidebar && <Sidebar />}
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1, flexDirection: 'row' },
  content: { flex: 1, backgroundColor: '#FFFFFF' },
});

