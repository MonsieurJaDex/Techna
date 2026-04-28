import * as React from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export function HoverCard(props: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ hovered, pressed }) => [
        styles.base,
        Platform.OS === 'web' && hovered && styles.hovered,
        pressed && styles.pressed,
        props.style,
      ]}>
      <View style={styles.inner}>{props.children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    shadowColor: 'rgba(17,24,39,0.10)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  inner: { padding: 18 },
  hovered: {
    transform: [{ translateY: -2 }],
    shadowColor: 'rgba(106,178,22,0.20)',
    shadowRadius: 22,
  },
  pressed: { opacity: 0.9 },
});

